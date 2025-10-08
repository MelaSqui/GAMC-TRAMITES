<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Si tu tabla ya tiene muchos registros, usa nullable para evitar choques al migrar
            if (! Schema::hasColumn('users', 'carnet')) {
                $table->string('carnet', 30)->nullable()->unique()->after('id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'carnet')) {
                $table->dropUnique(['carnet']);
                $table->dropColumn('carnet');
            }
        });
    }
};
