<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UnitResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code_prefix' => $this->code_prefix,
            'description' => $this->description,
            'level' => $this->level,
            'contact_name' => $this->contact_name,
            'address' => $this->address,
            'phones' => $this->phones_array,  // Usa el helper del modelo
            'internal_phone' => $this->internal_phone,
            'website_url' => $this->website_url,
            'cover_url' => $this->cover_url ? asset('storage/' . $this->cover_url) : null,
            'tramites_count' => $this->tramites_count ?? 0,
        ];
    }
}