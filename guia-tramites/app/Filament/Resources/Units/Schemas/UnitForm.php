<?php

namespace App\Filament\Resources\Units\Schemas;

use Filament\Forms;
use Filament\Schemas\Schema;

class UnitForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->schema([
                // Básicos
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
                    ->rows(3)
                    ->columnSpanFull(),

                // Nuevos campos de perfil
                Forms\Components\TextInput::make('level')
                    ->label('Nivel')
                    ->maxLength(120),

                Forms\Components\TextInput::make('contact_name')
                    ->label('Contacto')
                    ->maxLength(120),

                Forms\Components\Textarea::make('address')
                    ->label('Dirección')
                    ->rows(2)
                    ->columnSpanFull(),

                Forms\Components\TagsInput::make('phones')
                    ->label('Teléfonos')
                    ->placeholder('E.g. 4250000')
                    ->reorderable(),

                Forms\Components\TextInput::make('internal_phone')
                    ->label('Interno')
                    ->maxLength(120),

                Forms\Components\TextInput::make('website_url')
                    ->label('Página web')
                    ->url()
                    ->maxLength(255),

                Forms\Components\FileUpload::make('cover_url')
                    ->label('Portada')
                    ->image()
                    ->directory('units')
                    ->disk('public')
                    ->imageEditor()
                    ->openable()
                    ->downloadable()
                    ->columnSpanFull(),
            ])
            ->columns(2);
    }
}
