<?php

use Illuminate\Database\Migrations\Migration;   // <-- FALTA ESTO
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('units', function (Blueprint $table) {   // <-- 'units'
            $table->string('level', 120)->nullable();
            $table->string('contact_name', 120)->nullable();
            $table->text('address')->nullable();
            $table->json('phones')->nullable();
            $table->string('internal_phone', 120)->nullable();
            $table->string('website_url', 255)->nullable();
            $table->string('cover_url', 255)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->dropColumn([
                'level',
                'contact_name',
                'address',
                'phones',
                'internal_phone',
                'website_url',
                'cover_url',
            ]);
        });
    }
};
