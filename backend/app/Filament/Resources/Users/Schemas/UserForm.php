<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Http;
use Illuminate\Database\Eloquent\Builder;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->schema([

            // CARNET (primero)
            Forms\Components\TextInput::make('carnet')
                ->label('Carnet')
                ->placeholder('Ej.: 12345678')
                ->required()
                ->maxLength(30)
                ->unique(table: 'users', column: 'carnet', ignoreRecord: true)
                ->validationMessages([
                    'unique' => 'Este carnet ya está registrado.',
                ])
                ->autocomplete(false)
                ->reactive()
                ->debounce(1200)
                ->afterStateUpdated(function ($state, callable $set) {
                    if (!filled($state)) {
                        $set('name', '');
                        return;
                    }

                    try {
                        $response = Http::asForm()
                            ->timeout(6)
                            ->withHeaders([
                                'Accept' => 'application/json',
                                'User-Agent' => 'Filament-RRHH/1.0',
                            ])
                            ->post('https://appgamc.cochabamba.bo/transparencia/servicio/busqueda_empleados.php', [
                                'tipo' => 'D',
                                'dato' => $state,
                            ]);

                        if (! $response->successful()) {
                            Notification::make()
                                ->title('Error al contactar RRHH')
                                ->body('Código HTTP: ' . $response->status())
                                ->danger()
                                ->send();
                            return;
                        }

                        $result = $response->json();

                        if (! is_array($result)) {
                            Notification::make()
                                ->title('Respuesta no válida')
                                ->body('El sistema RRHH no devolvió JSON correcto.')
                                ->warning()
                                ->send();
                            return;
                        }

                        $empleado = $result['data'][0]['empleado'] ?? null;

                        if ($empleado) {
                            $set('name', $empleado);
                            Notification::make()
                                ->title('Usuario encontrado')
                                ->body('Se completó el nombre: ' . $empleado)
                                ->success()
                                ->send();
                        } else {
                            $set('name', '');
                            Notification::make()
                                ->title('Usuario no encontrado')
                                ->body('El CI no está registrado en RRHH.')
                                ->warning()
                                ->send();
                        }
                    } catch (\Throwable $e) {
                        Notification::make()
                            ->title('Error en la conexión')
                            ->body('No se pudo comunicar con RRHH: ' . $e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),

            // DATOS BÁSICOS
            Forms\Components\TextInput::make('name')
                ->label('Nombre')
                ->required()
                ->disabled()      // lo llena RRHH si existe
                ->dehydrated(true),

            Forms\Components\TextInput::make('email')
                ->label('Email')
                ->email()
                ->required()
                ->maxLength(255),

            Forms\Components\Select::make('role')
                ->label('Rol')
                ->options([
                    'super_admin' => 'Super Admin',
                    'funcionario' => 'Funcionario',
                ])
                ->required(),

            Forms\Components\Toggle::make('is_active')
                ->label('Activo')
                ->default(true),

            // Unidades (evita DISTINCT con columnas JSON en PostgreSQL)
            Forms\Components\Select::make('units')
                ->label('Unidades asignadas')
                ->multiple()
                ->relationship(
                    name: 'units',
                    titleAttribute: 'name',
                    modifyQueryUsing: function (Builder $query) {
                        // Evita seleccionar * (que podría incluir JSON y romper DISTINCT).
                        $query->select('units.id', 'units.name')->orderBy('units.name');
                    }
                )
                ->preload()
                ->searchable(),

            // PASSWORD
            Forms\Components\TextInput::make('password')
                ->label('Contraseña')
                ->password()
                ->revealable()
                ->required(fn (string $context) => $context === 'create')
                ->dehydrateStateUsing(fn ($state) => filled($state) ? bcrypt($state) : null)
                ->dehydrated(fn ($state) => filled($state)),
        ])->columns(2);
    }
}
