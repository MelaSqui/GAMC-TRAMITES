<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Models\Tramite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UnitController extends Controller
{
    /**
     * GET /api/v1/public/units?q=
     */
    public function index(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        // Seleccionamos con alias para que el frontend tenga claves estables.
        $units = Unit::query()
            ->when($q !== '', function ($query) use ($q) {
                $like = "%{$q}%";
                $query->where(function ($sub) use ($like) {
                    $sub->where('name', 'ILIKE', $like)
                        ->orWhere('code_prefix', 'ILIKE', $like)
                        ->orWhere('description', 'ILIKE', $like)
                        ->orWhere('contact_name', 'ILIKE', $like)
                        ->orWhere('address', 'ILIKE', $like);
                });
            })
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'code_prefix',
                'description',
                'level',
                'contact_name as contact',
                'address',
                'phones',
                'whatsapp_phone',  // ✅ AGREGADO
                'website_url as website',
                'cover_url',
            ])
            ->map(function ($u) {
                return $this->normalizeUnit($u);
            })
            ->values();

        return response()->json(['data' => $units]);
    }

    /**
     * GET /api/v1/public/units/{unit}
     */
    public function show(Unit $unit)
    {
        $u = (object) [
            'id'         => $unit->id,
            'name'       => $unit->name,
            'code_prefix'=> $unit->code_prefix,
            'description'=> $unit->description,
            'level'      => $unit->level,
            'contact'    => $unit->contact_name,  // ✅ CORREGIDO (estaba "contservact_name")
            'address'    => $unit->address,
            'phones'     => $unit->phones,
            'whatsapp_phone'=> $unit->whatsapp_phone,  // ✅ YA ESTABA
            'website'    => $unit->website_url,
            'cover_url'  => $unit->cover_url,
        ];

        return response()->json(['data' => $this->normalizeUnit($u)]);
    }

    /**
     * GET /api/v1/public/units/{unit}/tramites?q=
     */
    public function tramites(Request $request, Unit $unit)
    {
        $q = trim((string) $request->query('q', ''));

        $tramites = Tramite::query()
            ->where('unit_id', $unit->id)
            ->where('is_active', true)
            ->when($q !== '', fn ($query) => $query->search($q))
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

        $unitPayload = $this->normalizeUnit((object) [
            'id'         => $unit->id,
            'name'       => $unit->name,
            'code_prefix'=> $unit->code_prefix,
            'description'=> $unit->description,
            'level'      => $unit->level,
            'contact'    => $unit->contact_name,
            'address'    => $unit->address,
            'phones'     => $unit->phones,
            'whatsapp_phone'=> $unit->whatsapp_phone,  // ✅ AGREGADO
            'website'    => $unit->website_url,
            'cover_url'  => $unit->cover_url,
        ]);

        return response()->json([
            'unit' => $unitPayload,
            'data' => $tramites,
        ]);
    }

    /**
     * Normaliza el payload:
     * - Convierte phones (jsonb) a array<string>
     * - Genera URL completa para cover_url
     */
    private function normalizeUnit(object $u): array
    {
        // phones puede venir como jsonb (array, objeto o string). Lo convertimos a array de strings.
        $phones = [];
        if (is_array($u->phones)) {
            foreach ($u->phones as $k => $v) {
                if (is_string($v) && trim($v) !== '') {
                    $phones[] = $v;
                } elseif (is_array($v)) {
                    $phones[] = trim(implode(' ', array_map('strval', $v)));
                } elseif (is_object($v)) {
                    $phones[] = trim(implode(' ', array_map('strval', (array) $v)));
                } elseif (is_numeric($v)) {
                    $phones[] = (string) $v;
                }
            }
        } elseif (is_string($u->phones) && trim($u->phones) !== '') {
            $phones = array_map('trim', preg_split('/[,;]+/', $u->phones));
        }

        // Generar URL completa para la imagen de portada
        $coverUrl = null;
        if (!empty($u->cover_url)) {
            $coverUrl = Storage::disk('public')->url($u->cover_url);
        }

        return [
            'id'          => $u->id,
            'name'        => $u->name,
            'code_prefix' => $u->code_prefix,
            'description' => $u->description,
            'level'       => $u->level,
            'contact'     => $u->contact,
            'address'     => $u->address,
            'phones'      => $phones,
            'whatsapp_phone' => $u->whatsapp_phone ?? null,  // ✅ AGREGADO
            'website'     => $u->website,
            'cover_url'   => $coverUrl,
        ];
    }
}