<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('tramite_normativa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tramite_id')->constrained()->cascadeOnDelete();
            $table->foreignId('normativa_id')->constrained()->cascadeOnDelete();
            $table->unique(['tramite_id', 'normativa_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('tramite_normativa');
    }
};
