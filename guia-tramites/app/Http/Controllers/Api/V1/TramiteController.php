<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TramiteResource;
use App\Http\Resources\UnitResource;
use App\Models\Tramite;
use App\Models\Unit;
use Illuminate\Http\Request;

class TramiteController extends Controller
{
    // Listado por unidad (endpoint que usa el frontend)
    public function byUnit(Unit $unit, Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        $query = Tramite::query()
            ->where('unit_id', $unit->id)
            ->where('is_active', true)
            ->select('id', 'unit_id', 'code', 'title', 'description', 'estimated_time', 'cost');

        if ($q !== '') {
            $like = "%{$q}%";
            $query->where(function ($sub) use ($like) {
                $sub->where('title', 'ILIKE', $like)
                    ->orWhere('description', 'ILIKE', $like)
                    ->orWhere('code', 'ILIKE', $like);
                    // Si quieres buscar en JSON, descomenta:
                    // ->orWhereRaw('"requirements"::text ILIKE ?', [$like])
                    // ->orWhereRaw('"steps"::text ILIKE ?', [$like]);
            });
        }

        $tramites = $query->orderBy('title')->get();

        // Respuesta que espera el frontend: { unit: {...}, items: [...] }
        return response()->json([
            'unit'  => UnitResource::make($unit)->resolve(),
            'items' => TramiteResource::collection($tramites)->resolve(),
        ]);
    }

    // Detalle de trámite
    public function show(Tramite $tramite)
    {
        $tramite->loadMissing([
            'unit:id,name,code_prefix',
            'normativas:id,title,link,issued_date',
        ]);

        return TramiteResource::make($tramite);
    }

    // (Opcional) Listado general con filtros ?unit_id=&q=
    public function index(Request $request)
    {
        $q      = trim((string) $request->query('q', ''));
        $unitId = $request->integer('unit_id');

        $query = Tramite::query()
            ->with(['unit:id,name,code_prefix'])
            ->where('is_active', true);

        if ($unitId) {
            $query->where('unit_id', $unitId);
        }

        if ($q !== '') {
            $like = "%{$q}%";
            $query->where(function ($sub) use ($like) {
                $sub->where('title', 'ILIKE', $like)
                    ->orWhere('description', 'ILIKE', $like)
                    ->orWhereRaw('"requirements"::text ILIKE ?', [$like])
                    ->orWhereRaw('"steps"::text ILIKE ?', [$like]);
            });
        }

        $tramites = $query->orderBy('title')->get();

        return response()->json([
            'items' => TramiteResource::collection($tramites)->resolve(),
        ]);
    }
}
