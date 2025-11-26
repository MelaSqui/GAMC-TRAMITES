<?php

namespace App\Filament\Resources\Units\Pages;

use App\Filament\Resources\Units\UnitResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Auth;

class EditUnit extends EditRecord
{
    protected static string $resource = UnitResource::class;

    public static function canAccess(array $parameters = []): bool
    {
        return Auth::user()?->role === 'super_admin';
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make()
                ->visible(fn () => Auth::user()?->role === 'super_admin'),
        ];
    }

    protected function getSavedNotificationTitle(): ?string
    {
        return 'Unidad actualizada correctamente';
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
