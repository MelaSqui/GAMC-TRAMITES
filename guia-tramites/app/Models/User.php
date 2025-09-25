<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // necesario para login
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',        // 'super_admin' | 'funcionario'
        'is_active',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'password'  => 'hashed',
        'is_active' => 'boolean',
    ];

    /** Un usuario puede pertenecer a varias unidades (pivot: user_unit) */
    public function units(): BelongsToMany
    {
        return $this->belongsToMany(Unit::class, 'user_unit');
    }

    /** Logs del usuario */
    public function logs(): HasMany
    {
        return $this->hasMany(Log::class);
    }

    // Helpers de rol
    public function isSuperAdmin(): bool { return $this->role === 'super_admin'; }
    public function isFuncionario(): bool { return $this->role === 'funcionario'; }
}
