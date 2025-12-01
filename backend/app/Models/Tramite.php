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
        'code',
        'title',
        'description',
        'requirements',
        'steps',
        'requirements_html',
        'steps_html',
        'normativas_html',
        'keywords',
        'estimated_time',
        'cost',
        'created_by',
        'is_active',
        'is_featured',  // ✅ NUEVO: Para marcar favoritos
    ];

    protected $casts = [
        'requirements' => 'array',
        'steps'        => 'array',
        'is_active'    => 'boolean',
        'is_featured'  => 'boolean',  // ✅ NUEVO
        'cost'         => 'decimal:2',
    ];

    // ============================
    // Auto-generación de código
    // ============================

    protected static function booted(): void
    {
        static::creating(function (Tramite $tramite) {
            if (empty($tramite->code) && $tramite->unit_id) {
                $tramite->code = self::generateCode($tramite->unit_id);
            }
        });
    }

    public static function generateCode(int $unitId): string
    {
        $unit = Unit::find($unitId);
        $prefix = $unit?->code_prefix ?? 'TR';

        $lastTramite = self::where('code', 'LIKE', $prefix . '%')
            ->orderByRaw("CAST(SUBSTRING(code FROM '[0-9]+$') AS INTEGER) DESC")
            ->first();

        if ($lastTramite && preg_match('/(\d+)$/', $lastTramite->code, $matches)) {
            $nextNumber = (int) $matches[1] + 1;
        } else {
            $nextNumber = 1;
        }

        return $prefix . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }

    // ============================
    // Relaciones
    // ============================

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // ============================
    // Scopes
    // ============================

    /**
     * Scope para obtener solo favoritos
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope para obtener solo activos
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope de búsqueda
     */
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
                ->orWhere('normativas_html', 'ILIKE', $like)
                ->orWhere('keywords', 'ILIKE', $like);
        });
    }

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

    // ===========================================
    // Compatibilidad con datos antiguos
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