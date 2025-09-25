<?php
// app/Http/Resources/TramiteResource.php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TramiteResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'            => $this->id,
            'code'          => $this->code,
            'title'         => $this->title,
            'description'   => $this->description,
            'requirements'  => $this->requirements ?? [],
            'steps'         => $this->steps ?? [],
            'estimated_time'=> $this->estimated_time,
            'cost'          => $this->cost,
            'is_active'     => (bool) $this->is_active,
            'unit'          => $this->whenLoaded('unit', fn () => [
                                'id' => $this->unit->id,
                                'name' => $this->unit->name,
                                'code_prefix' => $this->unit->code_prefix,
                              ]),
            'normativas'    => $this->whenLoaded('normativas', fn () => $this->normativas->map(fn ($n) => [
                                'id' => $n->id,
                                'title' => $n->title,
                                'link' => $n->link,
                                'issued_date' => $n->issued_date,
                              ])),
            'created_at'    => $this->created_at,
        ];
    }
}
