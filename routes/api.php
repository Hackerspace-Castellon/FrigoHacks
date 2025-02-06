<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\RfidController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\GoogleAuthController;





Route::prefix('user')->group(function () {
        Route::get('/', [UserController::class, 'get']);
        Route::put('/', [UserController::class, 'update']);
        Route::post('/password', [UserController::class, 'updatePassword']);
        Route::post('/transactions', [UserController::class, 'transactions']);
        // Route::post('logout', [AuthController::class, 'logout']);
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
    Route::get('/{id}/transactions', [UserController::class, 'transactionsSpecify']);
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
    Route::get('/getCard', [RfidController::class, 'getCard']);
    Route::get('/status', [RfidController::class, 'status']);
});




Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::get('/auth/google', [GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);


// Rutas de administración
Route::get('/stats', [AdminController::class, 'stats']);
