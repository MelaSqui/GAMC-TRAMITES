<?php

namespace App\Filament\Resources\Tramites\Tables;

use App\Filament\Resources\Tramites\TramiteResource;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\Action;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class TramitesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('code')->label('Código')->badge()->sortable()->searchable(),
                Tables\Columns\TextColumn::make('unit.name')->label('Unidad')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('title')->label('Título')->limit(60)->searchable(),
                Tables\Columns\IconColumn::make('is_active')->label('Activo')->boolean(),
                Tables\Columns\TextColumn::make('cost')->label('Costo')->money('BOB', true)->sortable(),
                Tables\Columns\TextColumn::make('created_at')->since()->sortable(),
            ])
            // 🔎 Filtrar usando ?unit=ID y por unidades del funcionario
            ->modifyQueryUsing(function (Builder $query) {
                $user = Auth::user();

                if ($user && $user->role === 'funcionario') {
                    $allowedUnitIds = $user->units()->pluck('units.id');
                    $query->whereIn('unit_id', $allowedUnitIds);
                }

                $unitId = request()->integer('unit');
                if ($unitId) {
                    $query->where('unit_id', $unitId);
                }
            })
            ->recordActions([
                // Botón Ver (si usas Infolists, si no, lo puedes quitar)
                Action::make('ver')
                    ->label('Ver')
                    ->icon('heroicon-o-eye')
                    ->url(fn ($record) => TramiteResource::getUrl('view', ['record' => $record]))
                    ->openUrlInNewTab(false),
                EditAction::make(),
            ])
            ->toolbarActions([
                DeleteBulkAction::make(),
            ]);
    }
}
