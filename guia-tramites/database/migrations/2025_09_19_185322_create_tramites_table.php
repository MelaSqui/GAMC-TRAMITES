<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('tramites', function (Blueprint $table) {
            $table->id();

            $table->foreignId('unit_id')->constrained()->cascadeOnDelete();

            $table->string('code', 20)->unique();     // ej. ZN0001
            $table->string('title', 255);
            $table->text('description');              // NOT NULL

            $table->json('requirements');             // NOT NULL (JSON en PG)
            $table->json('steps');                    // NOT NULL

            $table->string('estimated_time', 100)->nullable();
            $table->decimal('cost', 10, 2)->default(0);

            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('tramites');
    }
};
