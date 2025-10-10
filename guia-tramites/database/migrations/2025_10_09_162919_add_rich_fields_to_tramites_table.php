<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('tramites', function (Blueprint $table) {
            // Si aún no existen, agrégalas. (text en PostgreSQL)
            if (! Schema::hasColumn('tramites', 'requirements_html')) {
                $table->text('requirements_html')->nullable();
            }
            if (! Schema::hasColumn('tramites', 'steps_html')) {
                $table->text('steps_html')->nullable();
            }
            if (! Schema::hasColumn('tramites', 'keywords')) {
                $table->text('keywords')->nullable(); // CSV de palabras clave
            }
            // NUEVA que te falta:
            if (! Schema::hasColumn('tramites', 'normativas_html')) {
                $table->text('normativas_html')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('tramites', function (Blueprint $table) {
            if (Schema::hasColumn('tramites', 'normativas_html')) {
                $table->dropColumn('normativas_html');
            }
            if (Schema::hasColumn('tramites', 'keywords')) {
                $table->dropColumn('keywords');
            }
            if (Schema::hasColumn('tramites', 'steps_html')) {
                $table->dropColumn('steps_html');
            }
            if (Schema::hasColumn('tramites', 'requirements_html')) {
                $table->dropColumn('requirements_html');
            }
        });
    }
};
