<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BalanceController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\ReturnController;
use App\Http\Controllers\RfidController;
use App\Http\Controllers\AdminController;

// Rutas de autenticación
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// test api
Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

// Rutas de usuarios
Route::prefix('users')->group(function () {
    Route::post('/', [UserController::class, 'store']);
    Route::get('/{id}', [UserController::class, 'show']);
    Route::put('/{id}', [UserController::class, 'update']);
    Route::delete('/{id}', [UserController::class, 'destroy']);
    Route::get('/{id}/balance', [UserController::class, 'balance']);
    Route::get('/balances', [UserController::class, 'balances']);
    Route::get('/{id}/transactions', [UserController::class, 'transactions']);
});

// Rutas de productos
Route::prefix('products')->group(function () {
    Route::post('/', [ProductController::class, 'store']);
    Route::delete('/{id}', [ProductController::class, 'destroy']);
    Route::patch('/{id}/quantity', [ProductController::class, 'updateQuantity']);
    Route::patch('/{id}/price', [ProductController::class, 'updatePrice']);
    Route::patch('/{id}/restock', [ProductController::class, 'restock']);
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/{id}', [ProductController::class, 'show']);
});

// Rutas de compras y devoluciones
Route::prefix('purchases')->group(function () {
    Route::post('/', [PurchaseController::class, 'store']);
    Route::get('/', [PurchaseController::class, 'index']);
});


// Rutas de RFID & Hardware
Route::prefix('rfid')->group(function () {
    Route::post('/user', [RfidController::class, 'processUser']);
    Route::post('/code/user', [RfidController::class, 'processCode']);
    Route::post('/product', [RfidController::class, 'purchaseWithRfid']);
    Route::post('/code/product', [RfidController::class, 'purchaseWithCode']);
    Route::post('/getCard', [RfidController::class, 'getCard']);
    Route::get('/status', [RfidController::class, 'status']);
});

// Rutas de administración
Route::get('/stats', [AdminController::class, 'stats']);
