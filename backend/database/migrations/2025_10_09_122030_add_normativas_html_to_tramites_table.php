<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Si existe, elimínalo
        if (Schema::hasTable('tramite_normativa')) {
            Schema::drop('tramite_normativa');
        }
    }

    public function down(): void
    {
        // (Opcional) recreación simple del pivot
        Schema::create('tramite_normativa', function ($table) {
            $table->unsignedBigInteger('tramite_id');
            $table->unsignedBigInteger('normativa_id');
            $table->primary(['tramite_id', 'normativa_id']);
        });
    }
};
