<?php
// app/Http/Resources/TramiteResource.php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TramiteResource extends JsonResource
{
   // app/Http/Resources/TramiteResource.php
public function toArray($request)
{
    return [
        'id'             => $this->id,
        'unit_id'        => $this->unit_id,
        'code'           => $this->code,
        'title'          => $this->title,
        'description'    => $this->description,
        'estimated_time' => $this->estimated_time,
        'cost'           => $this->cost,
        'requirements'   => $this->requirements, // JSON
        'steps'          => $this->steps,        // JSON
        'unit'           => $this->whenLoaded('unit', function () {
            return [
                'id'          => $this->unit->id,
                'name'        => $this->unit->name,
                'code_prefix' => $this->unit->code_prefix,
            ];
        }),
        'normativas'     => $this->whenLoaded('normativas', function () {
            return $this->normativas->map(fn ($n) => [
                'id'          => $n->id,
                'title'       => $n->title,
                'link'        => $n->link,
                'issued_date' => $n->issued_date,
            ]);
        }),
    ];
}

}
