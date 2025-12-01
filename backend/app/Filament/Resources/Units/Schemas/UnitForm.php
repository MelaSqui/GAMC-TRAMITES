<?php

namespace App\Filament\Resources\Units\Schemas;

use App\Models\Unit;
use App\Models\User;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Notifications\Notification;

class UnitForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->schema([

            // =========================
            // Identificación de Unidad
            // =========================
            Section::make('Datos de la Unidad')
                ->description('Información general y código de la unidad administrativa.')
                ->schema([
                    Forms\Components\TextInput::make('name')
                        ->label('Nombre')
                        ->required()
                        ->maxLength(255),

                    Forms\Components\TextInput::make('code_prefix')
                        ->label('Prefijo de código')
                        ->helperText('Ej.: ZN, ADM, ST, etc.')
                        ->maxLength(10)
                        ->required(),

                    Forms\Components\Textarea::make('description')
                        ->label('Descripción')
                        ->rows(3)
                        ->columnSpanFull(),
                ])
                ->columns(2),

            // =========================
            // Responsable y contacto
            // =========================
            Section::make('Responsable y Contacto')
                ->description('Selecciona al usuario responsable. Se mostrará en el portal.')
                ->schema([
                    Forms\Components\Select::make('responsable_user_id')
                        ->label('Responsable (usuario)')
                        ->relationship('responsable', 'name')
                        ->searchable()
                        ->preload()
                        ->placeholder('Selecciona un usuario responsable…')
                        ->native(false)
                        ->live()
                        ->afterStateUpdated(function ($state, ?Unit $record, callable $set) {
                            if (! $state) {
                                return;
                            }

                            // Copia el nombre al campo "contact_name" como respaldo visible
                            if ($user = User::find($state)) {
                                $set('contact_name', $user->name);
                            }

                            // Si estamos editando (record ya existe), lo anexamos a la unidad.
                            if ($record && !$record->users()->where('users.id', $state)->exists()) {
                                $record->users()->attach($state);

                                Notification::make()
                                    ->title('Responsable asignado y vinculado a la unidad')
                                    ->success()
                                    ->send();
                            }
                        })
                        ->helperText('Además de mostrarse en público, el usuario quedará vinculado a esta unidad.'),

                    Forms\Components\TextInput::make('contact_name')
                        ->label('Contacto (texto)')
                        ->helperText('Se completa automáticamente al elegir responsable, puedes ajustarlo si es necesario.')
                        ->maxLength(120),

                    Forms\Components\TextInput::make('level')
                        ->label('Nivel')
                        ->maxLength(120),

                    Forms\Components\TextInput::make('internal_phone')
                        ->label('Interno')
                        ->maxLength(120),
                ])
                ->columns(2),

            // =========================
            // Ubicación y comunicación
            // =========================
            Section::make('Ubicación y comunicación')
                ->schema([
                    Forms\Components\TextInput::make('address')
                        ->label('Dirección')
                        ->maxLength(255)
                        ->columnSpanFull(),

                    Forms\Components\TextInput::make('phones')
                        ->label('Teléfonos')
                        ->placeholder('Ej.: 4-4258000, 4-4258001')
                        ->helperText('Separa múltiples teléfonos con comas'),

                    Forms\Components\TextInput::make('website_url')
                        ->label('Página web')
                        ->url()
                        ->maxLength(255)
                        ->helperText('Ej.: https://www.cochabamba.bo'),
                ])
                ->columns(2),

            // =========================
            // Portada / Imagen
            // =========================
            Section::make('Portada')
                ->description('Imagen que se mostrará en el card y modal de la unidad.')
                ->schema([
                    Forms\Components\FileUpload::make('cover_url')
                        ->label('Imagen de portada')
                        ->image()
                        ->directory('units/covers')
                        ->disk('public')
                        ->maxSize(4096)
                        ->imageEditor()
                        ->helperText('Formatos: JPG/PNG. Tamaño recomendado panorámico. Máx. 4MB.'),
                ]),
        ])
        ->columns(1);
    }
}