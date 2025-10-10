<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// drop_tramite_normativa_table
return new class extends Migration {
    public function up(): void
    {
        Schema::dropIfExists('tramite_normativa');
    }
    public function down(): void
    {
        // Si necesitas restaurarla, vuelve a crearla aquí.
    }
};
