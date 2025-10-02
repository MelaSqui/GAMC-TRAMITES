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
        'name', 'code_prefix', 'description',
        'level', 'contact_name', 'address',
        'phones', 'internal_phone', 'website_url', 'cover_url',
    ];

    protected $casts = [
        'phones' => 'array',
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

    protected static function boot()
{
    parent::boot();
    
    static::saving(function ($unit) {
        \Log::info('Guardando unidad:', $unit->toArray());
        \Log::info('Datos sucios:', $unit->getDirty());
    });
    
    static::saved(function ($unit) {
        \Log::info('Unidad guardada:', $unit->fresh()->toArray());
    });
}
}
