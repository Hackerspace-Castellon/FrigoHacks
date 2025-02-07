<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\RfidController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Middleware\IsAdmin;

Route::prefix('user')->group(function () {
        Route::get('/', [UserController::class, 'get']);
        Route::put('/', [UserController::class, 'update']);
        Route::put('/add-balance', [UserController::class, 'addBalance']);
        Route::put('/remove-balance', [UserController::class, 'removeBalance']);
        Route::post('/password', [UserController::class, 'updatePassword']);
        Route::get('/transactions', [UserController::class, 'transactions']);
        Route::post('/buy', [UserController::class, 'buy']);
        // Route::post('logout', [AuthController::class, 'logout']);
    });


// test api
Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

// Rutas de usuarios
Route::prefix('users')->middleware(IsAdmin::class)->group(function () {
    Route::get('/', [AdminUserController::class, 'showAll']);
    Route::get('/{id}', [AdminUserController::class, 'show']);
    Route::post('/', [AdminUserController::class, 'store']);
    Route::put('/{id}', [AdminUserController::class, 'update']);
    Route::delete('/{id}', [AdminUserController::class, 'destroy']);
    Route::get('/{id}/balance', [AdminUserController::class, 'balance']);
    Route::get('/balances', [AdminUserController::class, 'balances']);
    Route::get('/{id}/transactions', [AdminUserController::class, 'transactionsSpecify']);
});

// Rutas de productos
Route::get('/products/print', [ProductController::class, 'print']);
Route::prefix('products')->middleware(IsAdmin::class)->group(function () {
    Route::get('/', [ProductController::class, 'showAll']);
    Route::get('/{id}', [ProductController::class, 'show']);
    Route::post('/', [ProductController::class, 'store']);
    Route::post('/update/{id}', [ProductController::class, 'update']);
    Route::delete('/{id}', [ProductController::class, 'destroy']);
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
