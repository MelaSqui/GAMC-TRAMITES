<?php

namespace App\Filament\Resources\Tramites\Pages;

use App\Filament\Resources\Tramites\TramiteResource;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Unit;

class CreateTramite extends CreateRecord
{
    protected static string $resource = TramiteResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $user = Auth::user();
        $unit = Unit::findOrFail($data['unit_id']);

        // Postgres: toma la parte numérica final del code
        $lastNum = DB::table('tramites')
            ->where('unit_id', $unit->id)
            ->whereRaw("code::text LIKE ?", [$unit->code_prefix.'%'])
            ->selectRaw("COALESCE(MAX(CAST(SUBSTRING(code FROM '\\d+$') AS INTEGER)), 0) as maxnum")
            ->value('maxnum');

        $next = str_pad((string) ($lastNum + 1), 4, '0', STR_PAD_LEFT);
        $data['code'] = $unit->code_prefix . $next;

        $data['created_by']   = $user?->id;
        $data['requirements'] = $data['requirements'] ?? [];
        $data['steps']        = $data['steps'] ?? [];

        return $data;
    }
}