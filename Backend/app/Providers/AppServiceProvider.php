<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Illuminate\Support\Facades\Gate::define('is-super-admin', function ($user) {
            return $user->role === 'super_admin';
        });

        \Illuminate\Support\Facades\Gate::define('is-supervisor', function ($user) {
            return $user->role === 'supervisor';
        });
    }
}
