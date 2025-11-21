<?php

namespace App\Filament\Resources\Units\Tables;

use App\Filament\Resources\Tramites\TramiteResource;
use App\Filament\Resources\Units\UnitResource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Support\Facades\Auth;

class UnitsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Nombre')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('code_prefix')
                    ->label('Prefijo')
                    ->badge()
                    ->sortable(),

                TextColumn::make('description')
                    ->label('Descripción')
                    ->limit(60),

                TextColumn::make('created_at')
                    ->since()
                    ->sortable(),
            ])

            // 📎 Al hacer clic en una fila:
            ->recordUrl(function ($record) {
                $user = Auth::user();
                if ($user && $user->role === 'funcionario') {
                    // Ir a la lista de Trámites filtrada por esta unidad
                    return TramiteResource::getUrl('index', ['unit' => $record->id]);
                }
                // Admin: abrir editar unidad
                return UnitResource::getUrl('edit', ['record' => $record]);
            })

            // 🎯 Acciones por registro (fila)
            ->actions([
                // Botón directo a Trámites (solo funcionarios)
                Action::make('tramites')
                    ->label('Trámites')
                    ->icon('heroicon-o-queue-list')
                    ->visible(fn () => Auth::user()?->role === 'funcionario')
                    ->url(fn ($record) => TramiteResource::getUrl('index', ['unit' => $record->id]))
                    ->openUrlInNewTab(false),

                // Editar (solo super_admin)
                EditAction::make()
                    ->visible(fn () => Auth::user()?->role === 'super_admin'),
            ])

            // 🧹 Acciones masivas (v3 usa bulkActions, no toolbarActions)
            ->bulkActions([
                DeleteBulkAction::make()
                    ->visible(fn () => Auth::user()?->role === 'super_admin'),
            ]);
    }
}
