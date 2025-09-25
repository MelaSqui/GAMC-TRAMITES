<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Normativa extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'link',
        'issued_date',
        'is_active',
    ];

    protected $casts = [
        'issued_date' => 'date',
        'is_active'   => 'boolean',
    ];

    /** Trámites relacionados (pivot: tramite_normativa) */
    public function tramites(): BelongsToMany
    {
        return $this->belongsToMany(Tramite::class, 'tramite_normativa');
    }
}
