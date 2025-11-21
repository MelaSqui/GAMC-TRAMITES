<?php

namespace App\Filament\Resources\Units\Pages;

use App\Filament\Resources\Units\UnitResource;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Auth;

class CreateUnit extends CreateRecord
{
    protected static string $resource = UnitResource::class;

    public static function canAccess(array $parameters = []): bool
    {
        // Bloquea el acceso directo para funcionarios
        return Auth::user()?->role === 'super_admin';
    }
}
