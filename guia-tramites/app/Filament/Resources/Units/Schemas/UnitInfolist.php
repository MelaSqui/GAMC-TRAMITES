<?php

namespace App\Filament\Resources\Units\Schemas;

use Filament\Schemas\Schema;
use Filament\Infolists\Components\TextEntry;

class UnitInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->schema([
            TextEntry::make('name')
                ->label('Nombre'),

            TextEntry::make('code_prefix')
                ->label('Prefijo')
                ->badge(),

            TextEntry::make('description')
                ->label('Descripción'),

            TextEntry::make('tramites_count')
                ->label('Trámites')
                ->numeric(),
        ]);
    }
}
