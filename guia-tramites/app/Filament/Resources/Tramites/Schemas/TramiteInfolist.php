<?php

namespace App\Filament\Resources\Tramites\Schemas;

use Filament\Schemas\Schema;
use Filament\Infolists\Components\TextEntry;

class TramiteInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->schema([
            TextEntry::make('title')
                ->label('Título'),

            TextEntry::make('code')
                ->label('Código')
                ->badge(),

            TextEntry::make('unit.name')
                ->label('Unidad'),

            TextEntry::make('estimated_time')
                ->label('Tiempo estimado'),

            TextEntry::make('cost')
                ->label('Costo'),

            TextEntry::make('description')
                ->label('Descripción'),
        ]);
    }
}
