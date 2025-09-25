<?php

namespace App\Filament\Resources\Normativas\Schemas;

use Filament\Schemas\Schema;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\IconEntry;

class NormativaInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Detalles de la normativa')
                ->columns(2)
                ->schema([
                    TextEntry::make('title')->label('Título')->columnSpanFull(),
                    TextEntry::make('link')
                        ->label('Enlace')
                        ->url(fn ($state) => $state, shouldOpenInNewTab: true)
                        ->copyable()
                        ->columnSpanFull(),
                    TextEntry::make('issued_date')->label('Fecha de emisión')->date(),
                    IconEntry::make('is_active')->label('Activa')->boolean(),
                    TextEntry::make('description')->label('Descripción')->columnSpanFull(),
                    TextEntry::make('created_at')->label('Creado')->dateTime(),
                    TextEntry::make('updated_at')->label('Actualizado')->dateTime(),
                ]),
        ]);
    }
}
