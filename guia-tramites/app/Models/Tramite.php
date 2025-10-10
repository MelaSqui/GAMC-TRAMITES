<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tramite extends Model
{
    use HasFactory;

    protected $fillable = [
        'unit_id',
        'code',             // único (ej. ZN0001)
        'title',
        'description',

        // Campos antiguos (compatibilidad)
        'requirements',     // JSON
        'steps',            // JSON

        // Nuevos campos RichEditor + keywords (CSV)
        'requirements_html', // TEXT
        'steps_html',        // TEXT
        'normativas_html',   // ✅ NUEVO campo
        'keywords',          // TEXT (CSV: "vehicular, renovación")

        'estimated_time',
        'cost',
        'created_by',
        'is_active',
    ];

    protected $casts = [
        'requirements' => 'array',
        'steps'        => 'array',
        'is_active'    => 'boolean',
        'cost'         => 'decimal:2',
    ];

    /** Unidad dueña del trámite */
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    /** Usuario creador (opcional) */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // 🔥 ELIMINAMOS la relación antigua con normativas (pivot)
    // ❌ public function normativas(): BelongsToMany { ... }

    // ============================
    // Helpers para Palabras Clave
    // ============================

    public function getKeywordsArrayAttribute(): array
    {
        if (!$this->keywords) {
            return [];
        }

        return collect(explode(',', $this->keywords))
            ->map(fn ($s) => trim($s))
            ->filter()
            ->values()
            ->all();
    }

    public function setKeywordsArrayAttribute($arr): void
    {
        $this->keywords = collect(is_array($arr) ? $arr : [$arr])
            ->map(fn ($s) => trim((string) $s))
            ->filter()
            ->implode(',');
    }

    // ============================
    // Scope de búsqueda mejorado
    // ============================

    public function scopeSearch($query, ?string $q)
    {
        $q = trim((string) $q);
        if ($q === '') {
            return $query;
        }

        $like = "%{$q}%";

        return $query->where(function ($sub) use ($like) {
            $sub->where('title', 'ILIKE', $like)
                ->orWhere('description', 'ILIKE', $like)
                ->orWhere('requirements_html', 'ILIKE', $like)
                ->orWhere('steps_html', 'ILIKE', $like)
                ->orWhere('normativas_html', 'ILIKE', $like) // ✅ ahora se busca en normativas también
                ->orWhere('keywords', 'ILIKE', $like);
        });
    }

    // ===========================================
    // (Opcional) Compatibilidad con datos antiguos
    // ===========================================

    public function getRequirementsHtmlFromJsonAttribute(): ?string
    {
        if ($this->requirements_html || empty($this->requirements)) {
            return $this->requirements_html;
        }

        $items = collect($this->requirements)->map(function ($r) {
            if (is_array($r)) {
                $txt = $r['item'] ?? ($r['detalle'] ?? json_encode($r));
            } else {
                $txt = (string) $r;
            }
            return '<li>' . e($txt) . '</li>';
        })->implode('');

        return $items ? "<ul>{$items}</ul>" : null;
    }

    public function getStepsHtmlFromJsonAttribute(): ?string
    {
        if ($this->steps_html || empty($this->steps)) {
            return $this->steps_html;
        }

        $items = collect($this->steps)->map(function ($s) {
            if (is_array($s)) {
                $txt = $s['detalle'] ?? ($s['item'] ?? json_encode($s));
            } else {
                $txt = (string) $s;
            }
            return '<li>' . e($txt) . '</li>';
        })->implode('');

        return $items ? "<ol>{$items}</ol>" : null;
    }
}
