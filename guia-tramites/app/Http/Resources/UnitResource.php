<?php
// app/Http/Resources/UnitResource.php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UnitResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'code_prefix' => $this->code_prefix,
            'description' => $this->description,
            'tramites_count' => $this->whenCounted('tramites'),
        ];
    }
}
