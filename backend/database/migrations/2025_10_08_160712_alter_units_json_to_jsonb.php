<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Ajusta los nombres de columnas que sean json en "units"
        // Ejemplos: phones, extra, metadata, etc. Quita las que no existan.
        DB::statement('ALTER TABLE units ALTER COLUMN phones TYPE jsonb USING phones::jsonb');
        // DB::statement('ALTER TABLE units ALTER COLUMN otra_columna TYPE jsonb USING otra_columna::jsonb');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE units ALTER COLUMN phones TYPE json USING phones::json');
        // DB::statement('ALTER TABLE units ALTER COLUMN otra_columna TYPE json USING otra_columna::json');
    }
};
