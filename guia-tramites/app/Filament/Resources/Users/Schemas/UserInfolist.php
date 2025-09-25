<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Schemas\Schema;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\IconEntry;

class UserInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->schema([
            TextEntry::make('name')
                ->label('Nombre'),

            TextEntry::make('email')
                ->label('Correo'),

            TextEntry::make('role')
                ->label('Rol')
                ->badge(),

            IconEntry::make('is_active')
                ->label('Activo')
                ->boolean(),

            // Muestra las unidades como lista simple: "Zoonosis, Subalcaldía..."
            TextEntry::make('units.name')
                ->label('Unidades')
                ->separator(', ')
                ->tooltip('Unidades asignadas'),
        ]);
    }
}
