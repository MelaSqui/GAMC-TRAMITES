<?php

namespace App\Filament\Resources\Units\Tables;

use App\Filament\Resources\Units\UnitResource;
use App\Filament\Resources\Tramites\TramiteResource;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\Action;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Auth;

class UnitsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('Nombre')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('code_prefix')->label('Prefijo')->badge()->sortable(),
                Tables\Columns\TextColumn::make('description')->label('Descripción')->limit(60),
                Tables\Columns\TextColumn::make('created_at')->since()->sortable(),
            ])
            // 📎 Al hacer clic en una unidad:
            ->recordUrl(function ($record) {
                $user = Auth::user();
                if ($user && $user->role === 'funcionario') {
                    // Ir a la lista de Trámites filtrada por esta unidad
                    return TramiteResource::getUrl('index', ['unit' => $record->id]);
                }

                // Admin: abrir editar unidad
                return UnitResource::getUrl('edit', ['record' => $record]);
            })
            ->recordActions([
                // Botón directo a Trámites (solo funcionarios)
                Action::make('tramites')
                    ->label('Trámites')
                    ->icon('heroicon-o-queue-list')
                    ->visible(fn () => Auth::user()?->role === 'funcionario')
                    ->url(fn ($record) => TramiteResource::getUrl('index', ['unit' => $record->id]))
                    ->openUrlInNewTab(false),
                // Editar (solo admin)
                EditAction::make()
                    ->visible(fn () => Auth::user()?->role === 'super_admin'),
            ])
            ->toolbarActions([
                DeleteBulkAction::make()->visible(fn () => Auth::user()?->role === 'super_admin'),
            ]);
    }
}
