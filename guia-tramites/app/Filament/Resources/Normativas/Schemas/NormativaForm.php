<?php

namespace App\Filament\Resources\Normativas\Schemas;

use Filament\Forms;
use Filament\Schemas\Schema;

class NormativaForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\TextInput::make('title')->label('Título')->required()->maxLength(255),
            Forms\Components\Textarea::make('description')->label('Descripción')->rows(3),
            Forms\Components\TextInput::make('link')->label('Link PDF')->url()->maxLength(2048),
            Forms\Components\DatePicker::make('issued_date')->label('Fecha de emisión'),
            Forms\Components\Toggle::make('is_active')->label('Activo')->default(true),
        ])->columns(2);
    }
}
