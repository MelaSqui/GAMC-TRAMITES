<?php

namespace App\Filament\Resources\Tramites\Schemas;

use App\Models\Unit;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Illuminate\Support\Facades\Auth;

class TramiteForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->schema([

            Section::make('Datos generales del trámite')
                ->description('Información básica de identificación y unidad')
                ->schema([
                    Forms\Components\Select::make('unit_id')
                        ->label('Unidad responsable')
                        ->options(function () {
                            $user = Auth::user();
                            if ($user && method_exists($user, 'isFuncionario') && $user->isFuncionario()) {
                                $ids = $user->units()->pluck('units.id');
                                return Unit::whereIn('id', $ids)->pluck('name', 'id');
                            }
                            return Unit::pluck('name', 'id');
                        })
                        ->required()
                        ->native(false)
                        ->searchable()
                        ->preload(),

                    Forms\Components\TextInput::make('code')
                        ->label('Código')
                        ->disabled()
                        ->dehydrated(false)
                        ->helperText('Se autogenera al crear el trámite'),

                    Forms\Components\TextInput::make('title')
                        ->label('Título')
                        ->required()
                        ->maxLength(255),

                    Forms\Components\Textarea::make('description')
                        ->label('Descripción')
                        ->rows(3)
                        ->placeholder('Breve descripción general del trámite...')
                        ->required(),
                ])
                ->columns(2),

            // Requisitos
            Section::make('Requisitos del trámite')
                ->description('Incluye documentos o condiciones necesarias. Usa listas y formato.')
                ->schema([
                    Forms\Components\RichEditor::make('requirements_html')
                        ->label('Contenido de Requisitos')
                        ->toolbarButtons([
                            'bold', 'italic', 'underline', 'strike',
                            'bulletList', 'orderedList', 'blockquote',
                            'link', 'h2', 'h3', 'codeBlock',
                            'undo', 'redo',
                        ])
                        ->placeholder('Ej.: Presentar fotocopia de CI, croquis del inmueble...')
                        ->columnSpanFull()
                        ->required(),
                ]),

            // Pasos
            Section::make('Procedimiento o pasos')
                ->description('Describe el paso a paso del trámite. Usa listas numeradas o viñetas.')
                ->schema([
                    Forms\Components\RichEditor::make('steps_html')
                        ->label('Contenido de Pasos')
                        ->toolbarButtons([
                            'bold', 'italic', 'underline', 'strike',
                            'bulletList', 'orderedList', 'blockquote',
                            'link', 'h2', 'h3', 'codeBlock',
                            'undo', 'redo',
                        ])
                        ->placeholder('Ej.: 1) Llenar formulario. 2) Presentar documentos...')
                        ->columnSpanFull()
                        ->required(),
                ]),

            // Normativas
            Section::make('Normativas asociadas')
                ->description('Leyes, decretos, reglamentos u otras normativas relacionadas con este trámite.')
                ->schema([
                    Forms\Components\RichEditor::make('normativas_html')
                        ->label('Contenido de Normativas')
                        ->toolbarButtons([
                            'bold', 'italic', 'underline', 'strike',
                            'bulletList', 'orderedList', 'blockquote',
                            'link', 'h2', 'h3', 'codeBlock',
                            'undo', 'redo',
                        ])
                        ->placeholder('Ej.: Ley N° 1234, Decreto N° 5678...')
                        ->columnSpanFull(),
                ]),

            // Palabras clave
            Section::make('Palabras clave y referencias')
                ->description('Mejoran la búsqueda del trámite en el portal público.')
                ->schema([
                    Forms\Components\TagsInput::make('keywords_array')
                        ->label('Palabras clave')
                        ->placeholder('Ej.: licencia, vehículo, renovación')
                        ->separator(',')
                        ->helperText('Escribe términos que ayuden a encontrar este trámite.')
                        ->afterStateHydrated(function ($component, $state, $record) {
                            if ($record) {
                                $component->state($record->keywords_array);
                            }
                        })
                        ->dehydrateStateUsing(function ($state, $record) {
                            if ($record) {
                                $record->keywords_array = $state ?? [];
                            }
                            return null;
                        })
                        ->dehydrated(false)
                        ->columnSpanFull(),
                ]),

            // Datos complementarios
            Section::make('Datos complementarios')
                ->schema([
                    Forms\Components\TextInput::make('estimated_time')
                        ->label('Tiempo estimado')
                        ->maxLength(100)
                        ->placeholder('Ej.: 3 días hábiles'),

                    Forms\Components\TextInput::make('cost')
                        ->label('Costo')
                        ->numeric()
                        ->prefix('Bs')
                        ->default(0),

                    Forms\Components\Toggle::make('is_active')
                        ->label('Activo')
                        ->default(true),
                ])
                ->columns(3),

            // ✅ NUEVO: Sección de Favoritos (solo para super_admin)
            Section::make('Destacar trámite')
                ->description('Los trámites destacados aparecen en la sección de favoritos del portal público.')
                ->schema([
                    Forms\Components\Toggle::make('is_featured')
                        ->label('⭐ Marcar como favorito')
                        ->helperText('Este trámite aparecerá en la sección de favoritos del portal.')
                        ->default(false)
                        ->onColor('warning')
                        ->offColor('gray'),
                ])
                ->visible(fn () => Auth::user()?->isSuperAdmin() ?? false)
                ->collapsed(),

        ])->columns(1);
    }
}