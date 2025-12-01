<?php

namespace App\Filament\Resources\Units\Schemas;

use Filament\Schemas\Schema;
use Filament\Infolists\Components\ImageEntry; 
use Filament\Infolists\Components\TextEntry;  

class UnitInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->schema([
                ImageEntry::make('cover_url')
                    ->label('Portada')
                    ->disk('public')
                    ->columnSpanFull(),

                TextEntry::make('name')->label('Nombre'),
                TextEntry::make('code_prefix')->label('Prefijo'),

                TextEntry::make('level')->label('Nivel'),
                TextEntry::make('contact_name')->label('Contacto'),

                TextEntry::make('phones')
                    ->label('Teléfonos')
                    // Corregido: Ahora se pasan dos argumentos ($state y $record)
                    ->formatState(fn ($state, $record) => is_array($state) ? implode(', ', $state) : ($state ?? '')),

                TextEntry::make('internal_phone')->label('Interno'),
                TextEntry::make('website_url')->label('Página web'),

                TextEntry::make('address')->label('Dirección')->columnSpanFull(),
                TextEntry::make('description')->label('Descripción')->columnSpanFull(),

                TextEntry::make('tramites_count')->label('Trámites'),
            ])
            ->columns(2);
    }
}