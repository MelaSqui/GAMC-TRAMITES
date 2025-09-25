<?php

namespace App\Filament\Resources\Normativas;

use App\Filament\Resources\Normativas\Pages\CreateNormativa;
use App\Filament\Resources\Normativas\Pages\EditNormativa;
use App\Filament\Resources\Normativas\Pages\ListNormativas;
use App\Filament\Resources\Normativas\Pages\ViewNormativa;
use App\Filament\Resources\Normativas\Schemas\NormativaForm;
use App\Filament\Resources\Normativas\Schemas\NormativaInfolist;
use App\Filament\Resources\Normativas\Tables\NormativasTable;
use App\Models\Normativa;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Auth;

class NormativaResource extends Resource
{
    protected static ?string $model = Normativa::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedScale;

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return NormativaForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return NormativaInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return NormativasTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListNormativas::route('/'),
            'create' => CreateNormativa::route('/create'),
            'view' => ViewNormativa::route('/{record}'),
            'edit' => EditNormativa::route('/{record}/edit'),
        ];
    }

    // 🔒 Ocultar del sidebar si es funcionario
    public static function shouldRegisterNavigation(): bool
    {
        $user = Auth::user();
        return $user && $user->role === 'super_admin';
    }

    // 🔒 Bloquear acceso si es funcionario (por URL directa)
    public static function canViewAny(): bool
    {
        $user = Auth::user();
        return $user && $user->role === 'super_admin';
    }
}
