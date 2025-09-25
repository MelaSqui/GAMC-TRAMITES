<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Unit extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code_prefix',   // ej.: 'ZN'
        'description',
    ];

    /** Trámites de la unidad */
    public function tramites(): HasMany
    {
        return $this->hasMany(Tramite::class);
    }

    /** Usuarios asignados (pivot: user_unit) */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_unit');
    }
}
