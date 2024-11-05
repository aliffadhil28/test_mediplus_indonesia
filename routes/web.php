<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\KlinikController;
use App\Http\Controllers\JadwalController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/klinik', [HomeController::class, 'klinik'])->name('klinik.index');

    // Admin
    Route::prefix('admin')->name('admin.')->group(function () {
        // Dashboard
        Route::get('/', function () {
            return Inertia::render('Dashboard');
        })->middleware(['auth', 'verified'])->name('index');

        // Klinik
        Route::prefix('klinik')->name('klinik.')->group(function () {
            Route::get('/', [KlinikController::class, 'index'])->name('index');
            Route::post('/', [KlinikController::class, 'store'])->name('store');
            Route::post('/book', [KlinikController::class, 'booking'])->name('booking');
            Route::delete('/{id}', [KlinikController::class, 'destroy'])->name('destroy');
        });

        // Jadwal
        Route::prefix('jadwal')->name('jadwal.')->group(function () {
            Route::get('/{id}',[JadwalController::class, 'index'])->name('index');
            Route::post('/',[JadwalController::class, 'store'])->name('store');
            Route::delete('/{id}',[JadwalController::class, 'destroy'])->name('destroy');
            Route::post('/booking/{id}',[JadwalController::class, 'booking'])->name('booking');
        });
    });

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
