<?php

namespace App\Filament\Resources\Tramites\Schemas;

use App\Models\Unit;
use Filament\Forms;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Auth;

class TramiteForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\Select::make('unit_id')
                ->label('Unidad')
                ->options(function () {
                    $user = Auth::user();
                    if ($user && method_exists($user,'isFuncionario') && $user->isFuncionario()) {
                        return Unit::whereIn('id', $user->units()->pluck('units.id'))
                            ->pluck('name','id');
                    }
                    return Unit::pluck('name','id');
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

            Forms\Components\TextInput::make('title')->label('Título')->required()->maxLength(255),
            Forms\Components\Textarea::make('description')->label('Descripción')->rows(4)->required(),

            Forms\Components\Repeater::make('requirements')
                ->label('Requisitos')
                ->schema([
                    Forms\Components\TextInput::make('item')->label('Item')->required()->maxLength(255),
                    Forms\Components\Textarea::make('detalle')->label('Detalle')->rows(2),
                ])
                ->default([]) // NOT NULL
                ->columns(2)
                ->collapsible(),

            Forms\Components\Repeater::make('steps')
                ->label('Pasos')
                ->schema([
                    Forms\Components\TextInput::make('paso')->numeric()->required()->label('Paso'),
                    Forms\Components\Textarea::make('detalle')->rows(2)->required()->label('Detalle'),
                    Forms\Components\TextInput::make('link')->label('Link')->url()->maxLength(2048),
                ])
                ->default([]) // NOT NULL
                ->columns(3)
                ->collapsible(),

            Forms\Components\TextInput::make('estimated_time')->label('Tiempo estimado')->maxLength(100),
            Forms\Components\TextInput::make('cost')->label('Costo')->numeric()->prefix('Bs')->default(0),
            Forms\Components\Toggle::make('is_active')->label('Activo')->default(true),

            Forms\Components\Select::make('normativas')
                ->label('Normativas')
                ->relationship('normativas','title')
                ->multiple()
                ->preload()
                ->searchable(),
        ])->columns(2);
    }
}
