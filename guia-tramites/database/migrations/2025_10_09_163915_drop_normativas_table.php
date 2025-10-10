<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// drop_normativas_table
return new class extends Migration {
    public function up(): void
    {
        Schema::dropIfExists('normativas');
    }
    public function down(): void
    {
        // Si necesitas restaurarla, vuelve a crearla aquí.
    }
};
