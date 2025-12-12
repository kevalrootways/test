<?php

use App\Http\Controllers\Admin\AccountController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Accounts routes
    Route::prefix('accounts')->as('accounts.')->controller(AccountController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('create', 'create')->name('create');
        Route::post('/', 'store')->name('store');
        Route::get('{account}', 'show')->name('show');
        Route::get('{account}/edit', 'edit')->name('edit');
        Route::put('{account}', 'update')->name('update');
        Route::delete('{account}', 'destroy')->name('destroy');
        Route::post('table', 'table')->name('table');
    });
});

require __DIR__.'/settings.php';
