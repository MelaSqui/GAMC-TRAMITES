<?php
// routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\UnitController;
use App\Http\Controllers\Api\V1\TramiteController;

Route::prefix('v1/public')->group(function () {
    Route::get('units',            [UnitController::class, 'index']);   // <- IMPORTANTE
    Route::get('units/{unit}',     [UnitController::class, 'show']);

    Route::get('units/{unit}/tramites', [TramiteController::class, 'byUnit']);
    Route::get('tramites/{tramite}',    [TramiteController::class, 'show']);
});
