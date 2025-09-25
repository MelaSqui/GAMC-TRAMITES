<?php

namespace App\Filament\Resources\Units\Schemas;

use Filament\Forms;
use Filament\Schemas\Schema;

class UnitForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\TextInput::make('name')
                ->label('Nombre')
                ->required()
                ->maxLength(255),

            Forms\Components\TextInput::make('code_prefix')
                ->label('Prefijo de código')
                ->helperText('Ej.: ZN, ADM, etc.')
                ->required()
                ->maxLength(10),

            Forms\Components\Textarea::make('description')
                ->label('Descripción')
                ->rows(3),
        ])->columns(2);
    }
}
