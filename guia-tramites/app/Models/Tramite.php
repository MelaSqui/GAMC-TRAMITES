<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tramite extends Model
{
    use HasFactory;

    protected $fillable = [
        'unit_id',
        'code',             // único (ej. ZN0001)
        'title',
        'description',
        'requirements',     // JSON NOT NULL
        'steps',            // JSON NOT NULL
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

    /** Normativas vinculadas (pivot: tramite_normativa) */
    public function normativas(): BelongsToMany
    {
        return $this->belongsToMany(Normativa::class, 'tramite_normativa');
    }
}
