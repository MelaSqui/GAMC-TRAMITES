<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Models\Tramite;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    /**
     * GET /api/v1/public/units?q=
     * Lista todas las unidades con búsqueda opcional.
     */
    public function index(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        $units = Unit::query()
            ->when($q !== '', function ($query) use ($q) {
                $like = "%{$q}%";
                $query->where('name', 'ILIKE', $like)
                      ->orWhere('code_prefix', 'ILIKE', $like)
                      ->orWhere('description', 'ILIKE', $like);
            })
            ->orderBy('name')
            ->get(['id', 'name', 'code_prefix', 'description']);

        return response()->json(['data' => $units]);
    }

    /**
     * GET /api/v1/public/units/{id}
     */
    public function show(Unit $unit)
    {
        return response()->json(['data' => $unit]);
    }

    /**
     * GET /api/v1/public/units/{id}/tramites?q=
     * Lista trámites activos de una unidad.
     */
    public function tramites(Request $request, Unit $unit)
    {
        $q = trim((string) $request->query('q', ''));

        $tramites = Tramite::query()
            ->where('unit_id', $unit->id)
            ->where('is_active', true)
            ->when($q !== '', fn($query) => $query->search($q))
            ->orderBy('title')
            ->get([
                'id',
                'unit_id',
                'code',
                'title',
                'description',
                'requirements_html',
                'steps_html',
                'normativas_html',
                'keywords',
                'estimated_time',
                'cost',
                'is_active',
                'created_at',
                'updated_at',
            ]);

        return response()->json([
            'unit' => [
                'id' => $unit->id,
                'name' => $unit->name,
                'code_prefix' => $unit->code_prefix,
                'description' => $unit->description,
            ],
            'data' => $tramites,
        ]);
    }
}
