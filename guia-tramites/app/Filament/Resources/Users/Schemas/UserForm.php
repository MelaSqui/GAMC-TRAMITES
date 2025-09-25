<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\TextInput::make('name')->label('Nombre')->required()->maxLength(255),
            Forms\Components\TextInput::make('email')->email()->required()->maxLength(255),
            Forms\Components\TextInput::make('password')
                ->password()
                ->dehydrateStateUsing(fn ($state) => filled($state) ? bcrypt($state) : null)
                ->required(fn ($ctx) => $ctx === 'create')
                ->dehydrated(fn ($state) => filled($state)),
            Forms\Components\Select::make('role')->label('Rol')->options([
                'super_admin' => 'Super Admin',
                'funcionario' => 'Funcionario',
            ])->required(),
            Forms\Components\Toggle::make('is_active')->label('Activo')->default(true),
            Forms\Components\Select::make('units')->label('Unidades asignadas')
                ->multiple()
                ->relationship('units','name')
                ->preload()
                ->searchable(),
        ])->columns(2);
    }
}
