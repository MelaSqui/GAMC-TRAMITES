<?php

namespace App\Filament\Resources\Units\Schemas;

use App\Models\Unit;
use App\Models\User;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Notifications\Notification;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;

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

                    // ===============================================
                    // MODIFICADO: Campo 'phones' ahora es un Repeater
                    // ===============================================
                    Repeater::make('phones')
                        ->label('Números de Teléfono de Contacto')
                        ->schema([
                            TextInput::make('phone_number')
                                ->label('Número')
                                ->required()
                                ->tel()
                                ->maxLength(255)
                                ->rules(['regex:/^(\+?\d{1,3}[-.\s]?)?(\(\d{1,4}\)[-.\s]?)?[\d\s-]{4,}$/'])
                        ])
                        ->required()
                        ->defaultItems(1)
                        ->columnSpanFull()
                        ->reorderable(true)
                        ->afterStateHydrated(function ($component, $state) {
                            // Al cargar, convierte el array de strings de la DB a la estructura del Repeater
                            if (is_array($state) && !empty($state) && is_string(array_values($state)[0] ?? '')) {
                                $component->state(array_map(function ($item) {
                                    return ['phone_number' => $item];
                                }, $state));
                            }
                        })
                        ->dehydrateStateUsing(function ($state) {
                            // Al guardar, convierte la estructura del Repeater a un array simple de strings
                            return array_map(function ($item) {
                                return $item['phone_number'];
                            }, $state);
                        })
                        ->live(), // Importante para que el Select de WhatsApp se actualice en tiempo real


                    // ===============================================
                    // AÑADIDO: Campo 'whatsapp_phone' (Select)
                    // ===============================================
                    Select::make('whatsapp_phone')
                        ->label('Seleccionar Número de WhatsApp')
                        ->placeholder('Seleccione el número para WhatsApp')
                        ->helperText('Este número debe ser uno de los listados arriba. Aparecerá con el icono de WhatsApp en la interfaz pública.')
                        ->options(function ($get) {
                            // Obtiene el estado del campo 'phones' y crea las opciones del Select
                            $phoneData = $get('phones');
                            
                            $options = [];
                            
                            if (is_array($phoneData)) {
                                foreach ($phoneData as $item) {
                                    // Asegúrate de que el key 'phone_number' existe en el item del repeater
                                    $phoneNumber = $item['phone_number'] ?? null;
                                    if ($phoneNumber) {
                                        $options[$phoneNumber] = $phoneNumber;
                                    }
                                }
                            }
                            return $options;
                        })
                        ->required(fn ($get) => count($get('phones') ?? []) > 0) 
                        ->searchable()
                        ->nullable()
                        ->columnSpanFull(),
                        
                    Forms\Components\TextInput::make('website_url')
                        ->label('Página web')
                        ->url()
                        ->maxLength(255)
                        ->columnSpanFull() // Se usa full para que no se apile con el select anterior
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