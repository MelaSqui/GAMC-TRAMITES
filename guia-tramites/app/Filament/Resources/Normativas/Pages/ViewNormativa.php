<?php

namespace App\Filament\Resources\Normativas\Pages;

use App\Filament\Resources\Normativas\NormativaResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewNormativa extends ViewRecord
{
    protected static string $resource = NormativaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
