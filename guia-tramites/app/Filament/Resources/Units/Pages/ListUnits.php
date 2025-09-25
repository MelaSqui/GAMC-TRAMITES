<?php

namespace App\Filament\Resources\Units\Pages;

use App\Filament\Resources\Units\UnitResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Support\Facades\Auth;

class ListUnits extends ListRecords
{
    protected static string $resource = UnitResource::class;

    protected function getHeaderActions(): array
    {
        // Solo el super_admin ve el botón "Crear"
        return Auth::user()?->role === 'super_admin'
            ? [Actions\CreateAction::make()]
            : [];
    }
}
