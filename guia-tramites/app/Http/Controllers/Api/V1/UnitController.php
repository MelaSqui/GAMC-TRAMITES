<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UnitResource;
use App\Models\Unit;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    public function index()
{
    $units = Unit::query()
        ->select('id','name','code_prefix','description')
        ->withCount('tramites')
        ->orderBy('name')
        ->get();

    // Devolver array plano (sin 'data')
    return response()->json(
        \App\Http\Resources\UnitResource::collection($units)->resolve(),
        200,
        [],
        JSON_UNESCAPED_UNICODE
    );
}

    public function show(Unit $unit)
    {
        $unit->loadCount('tramites');

        // El frontend espera un objeto plano para /units/:id
        return UnitResource::make($unit);
    }
}
