<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;


// return public folder if is diferent to /api/*, user/*,  storage/*, sanctum/*, login, register, logout. 
Route::get('{any}', function () {
    $path = public_path('dist/index.html');

    if (!File::exists($path)) {
        abort(404);
    }

    return File::get($path);
})->where('any', '^((?!api|user|storage|sanctum).)*$');