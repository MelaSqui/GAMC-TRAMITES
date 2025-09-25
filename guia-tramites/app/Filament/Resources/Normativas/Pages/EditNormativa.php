<?php

namespace App\Filament\Resources\Normativas\Pages;

use App\Filament\Resources\Normativas\NormativaResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditNormativa extends EditRecord
{
    protected static string $resource = NormativaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
