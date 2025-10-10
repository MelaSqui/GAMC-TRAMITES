<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('tramites', function (Blueprint $table) {
            // Nuevos campos rich
            $table->text('requirements_html')->nullable();
            $table->text('steps_html')->nullable();

            // Palabras clave como CSV "permiso,vehicular,renovación"
            $table->text('keywords')->nullable();

            // (Opcional) si ya no usarás los JSON, puedes dejarlos por compatibilidad:
            // $table->dropColumn(['requirements','steps']);
        });
    }

    public function down(): void
    {
        Schema::table('tramites', function (Blueprint $table) {
            $table->dropColumn(['requirements_html','steps_html','keywords']);
        });
    }
};
