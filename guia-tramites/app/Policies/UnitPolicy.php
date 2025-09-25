<?php

namespace App\Policies;

use App\Models\Unit;
use App\Models\User;

class UnitPolicy
{
    /**
     * Da acceso total al super_admin para cualquier acción.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->role === 'super_admin') {
            return true;
        }

        return null;
    }

    /**
     * Cualquier usuario autenticado puede ver el listado.
     * (Los funcionarios verán solo sus unidades por filtros en el Resource.)
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Un funcionario solo puede ver una unidad si le pertenece.
     */
    public function view(User $user, Unit $unit): bool
    {
        return $user->units()->whereKey($unit->id)->exists();
    }

    /**
     * Solo super_admin (ya cubierto en before). Funcionario: no.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Solo super_admin (ya cubierto en before). Funcionario: no.
     */
    public function update(User $user, Unit $unit): bool
    {
        return false;
    }

    /**
     * Solo super_admin (ya cubierto en before). Funcionario: no.
     */
    public function delete(User $user, Unit $unit): bool
    {
        return false;
    }

    /**
     * Solo super_admin (ya cubierto en before). Funcionario: no.
     */
    public function restore(User $user, Unit $unit): bool
    {
        return false;
    }

    /**
     * Solo super_admin (ya cubierto en before). Funcionario: no.
     */
    public function forceDelete(User $user, Unit $unit): bool
    {
        return false;
    }
}
