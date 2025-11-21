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
            // description
            if (! Schema::hasColumn('units', 'description')) {
                $table->text('description')->nullable();
            }

            // timestamps (created_at, updated_at)
            if (! Schema::hasColumn('units', 'created_at')) {
                $table->timestamp('created_at')->nullable();
            }
            if (! Schema::hasColumn('units', 'updated_at')) {
                $table->timestamp('updated_at')->nullable();
            }
        });

        // Opcional: inicializa timestamps vacíos a NOW() si quieres
        DB::statement("UPDATE units SET created_at = COALESCE(created_at, NOW()), updated_at = COALESCE(updated_at, NOW())");
    }

    public function down(): void
    {
        Schema::table('units', function (Blueprint $table) {
            if (Schema::hasColumn('units', 'description')) {
                $table->dropColumn('description');
            }
            if (Schema::hasColumn('units', 'created_at')) {
                $table->dropColumn('created_at');
            }
            if (Schema::hasColumn('units', 'updated_at')) {
                $table->dropColumn('updated_at');
            }
        });
    }
};
