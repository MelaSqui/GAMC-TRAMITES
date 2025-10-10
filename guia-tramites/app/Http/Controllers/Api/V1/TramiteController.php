<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Tramite;
use Illuminate\Http\Request;

class TramiteController extends Controller
{
    /**
     * GET /api/v1/public/tramites?q=&unit=
     */
    public function index(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $unitId = $request->query('unit');

        $tramites = Tramite::query()
            ->when($unitId, fn($query) => $query->where('unit_id', $unitId))
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

        return response()->json(['data' => $tramites]);
    }

    /**
     * GET /api/v1/public/tramites/{id}
     */
    public function show(Tramite $tramite)
    {
        $unit = $tramite->unit()->select('id', 'name', 'code_prefix')->first();

        return response()->json([
            'data' => [
                'id' => $tramite->id,
                'unit_id' => $tramite->unit_id,
                'code' => $tramite->code,
                'title' => $tramite->title,
                'description' => $tramite->description,
                'requirements_html' => $tramite->requirements_html,
                'steps_html' => $tramite->steps_html,
                'normativas_html' => $tramite->normativas_html,
                'keywords' => $tramite->keywords,
                'estimated_time' => $tramite->estimated_time,
                'cost' => $tramite->cost,
                'is_active' => (bool) $tramite->is_active,
                'created_at' => $tramite->created_at,
                'updated_at' => $tramite->updated_at,
                'unit' => $unit,
            ]
        ]);
    }
}
