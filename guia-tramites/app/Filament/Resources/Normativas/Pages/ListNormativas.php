<?php

namespace App\Filament\Resources\Normativas\Pages;

use App\Filament\Resources\Normativas\NormativaResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListNormativas extends ListRecords
{
    protected static string $resource = NormativaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
