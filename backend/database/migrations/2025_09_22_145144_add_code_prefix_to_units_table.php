<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('units', function (Blueprint $table) {
            if (! Schema::hasColumn('units', 'code_prefix')) {
                // Primero como nullable para no fallar si ya hay filas
                $table->string('code_prefix', 10)->nullable()->after('name');
            }
        });

        // Rellenar filas existentes sin prefijo (elige un valor temporal seguro)
        DB::table('units')->whereNull('code_prefix')->update(['code_prefix' => 'UN']);

        // Hacerlo NOT NULL (PostgreSQL)
        DB::statement('ALTER TABLE units ALTER COLUMN code_prefix SET NOT NULL');

        // (Opcional) Si quieres índice:
        // Schema::table('units', function (Blueprint $table) {
        //     $table->index('code_prefix');
        // });

        // (Opcional) Si estás 100% seguro de que no habrá duplicados, puedes volverlo único:
        // Schema::table('units', function (Blueprint $table) {
        //     $table->unique('code_prefix');
        // });
    }

    public function down(): void
    {
        Schema::table('units', function (Blueprint $table) {
            if (Schema::hasColumn('units', 'code_prefix')) {
                // Si agregaste índice/único arriba, primero elimínalos:
                // $table->dropUnique(['code_prefix']);
                // $table->dropIndex(['code_prefix']);

                $table->dropColumn('code_prefix');
            }
        });
    }
};
