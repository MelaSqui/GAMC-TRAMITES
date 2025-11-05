<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets\AccountWidget;
use Filament\Widgets\FilamentInfoWidget;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
           //Logo
            ->brandLogo(asset('images/Logo_cocha.png'))
            ->brandLogoHeight('3rem')
            ->brandName('')
            //Paleta de colores
            ->colors([
                'primary' => [
                    50  => '#F3ECFA',
                    100 => '#E3D2F3',
                    200 => '#C7A5E7',
                    300 => '#AB78DB',
                    400 => '#8F4BCF',
                    500 => '#6E55A4', 
                    600 => '#5A4587',
                    700 => '#46356B',
                    800 => '#32244F',
                    900 => '#1E1433',
                ],
                'secondary' => [
                    50  => '#E0F6FB',
                    100 => '#B3EAF6',
                    200 => '#80DDF2',
                    300 => '#4DD0ED',
                    400 => '#1AC3E8',
                    500 => '#47B4D8', 
                    600 => '#3BA0C2',
                    700 => '#2E8CAA',
                    800 => '#217894',
                    900 => '#15647D',
                ],
                'success' => '#50C878',
                'warning' => '#FFD200',
                'danger'  => '#C8102E',
            ])

            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([
                AccountWidget::class,
                FilamentInfoWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
