<?php

namespace App\Filament\Resources\Tramites\Pages;

use App\Filament\Resources\Tramites\TramiteResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditTramite extends EditRecord
{
    protected static string $resource = TramiteResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
