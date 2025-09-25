<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('units', function (Blueprint $table) {
            if (! Schema::hasColumn('units', 'name')) {
                // Agregamos la columna con un default temporal para no fallar si hay filas existentes
                $table->string('name', 255)->default('')->after('id');
            }
        });

        // Si quieres, setea un nombre por defecto a filas existentes vacías
        DB::table('units')->where('name', '')->update(['name' => 'Unidad']);

        // (Opcional) Si quieres quitar el default:
        // DB::statement("ALTER TABLE units ALTER COLUMN name DROP DEFAULT");
    }

    public function down(): void
    {
        Schema::table('units', function (Blueprint $table) {
            if (Schema::hasColumn('units', 'name')) {
                $table->dropColumn('name');
            }
        });
    }
};
