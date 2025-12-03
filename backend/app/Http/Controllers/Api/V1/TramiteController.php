<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Tramite;
use Illuminate\Http\Request;

class TramiteController extends Controller
{
    /**
     * GET /api/v1/public/tramites?q=&unit=&page=&per_page=
     * Lista de trámites con filtros y paginación opcional
     */
    public function index(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $unitId = $request->query('unit');
        $perPage = (int) $request->query('per_page', 0); // 0 = sin paginación

        $query = Tramite::query()
            ->with('unit:id,name,code_prefix,description,contact_name,address,phones,whatsapp_phone,website_url')
            ->when($unitId, fn($qry) => $qry->where('unit_id', $unitId))
            ->where('is_active', true)
            ->when($q !== '', fn($qry) => $qry->search($q))
            ->orderBy('title');

        // Si se solicita paginación
        if ($perPage > 0) {
            $paginated = $query->paginate($perPage);
            
            return response()->json([
                'data' => $paginated->items(),
                'meta' => [
                    'current_page' => $paginated->currentPage(),
                    'last_page' => $paginated->lastPage(),
                    'per_page' => $paginated->perPage(),
                    'total' => $paginated->total(),
                ],
            ]);
        }

        // Sin paginación (comportamiento original)
        $tramites = $query->get();

        return response()->json(['data' => $tramites]);
    }

    /**
     * GET /api/v1/public/tramites/featured
     * Lista de trámites marcados como favoritos
     */
    public function featured(Request $request)
    {
        $tramites = Tramite::query()
            ->with('unit:id,name,code_prefix,description,contact_name,address,phones,whatsapp_phone,website_url')
            ->where('is_active', true)
            ->where('is_featured', true)
            ->orderBy('title')
            ->get();

        return response()->json(['data' => $tramites]);
    }

    /**
     * GET /api/v1/public/tramites/{id}
     * Detalle de un trámite
     */
    public function show(Tramite $tramite)
    {
        $tramite->load('unit:id,name,code_prefix,description,contact_name,address,phones,whatsapp_phone,website_url');

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
                'is_featured' => (bool) $tramite->is_featured,
                'created_at' => $tramite->created_at,
                'updated_at' => $tramite->updated_at,
                'unit' => $tramite->unit,
            ]
        ]);
    }
}