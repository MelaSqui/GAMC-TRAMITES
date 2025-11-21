<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\TramiteController;
use App\Http\Controllers\Api\V1\UnitController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Todas las rutas públicas consumidas por el frontend React.
| Prefijo común: /api/v1/public
|
*/

Route::prefix('v1/public')->group(function () {
    // === UNIDADES ===
    Route::get('/units', [UnitController::class, 'index']);
    Route::get('/units/{unit}', [UnitController::class, 'show'])->whereNumber('unit');
    Route::get('/units/{unit}/tramites', [UnitController::class, 'tramites'])->whereNumber('unit');

    // === TRÁMITES ===
    Route::get('/tramites', [TramiteController::class, 'index']);
    Route::get('/tramites/{tramite}', [TramiteController::class, 'show'])->whereNumber('tramite');
});
