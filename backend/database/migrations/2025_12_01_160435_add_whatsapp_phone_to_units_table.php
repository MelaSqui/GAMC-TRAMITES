<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('units', function (Blueprint $table) {
            // Agrega la columna para almacenar el número de teléfono designado para WhatsApp.
            // Es nullable porque no todas las unidades pueden tener un número de WhatsApp.
            $table->string('whatsapp_phone', 255)->nullable()->after('phones');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->dropColumn('whatsapp_phone');
        });
    }
};