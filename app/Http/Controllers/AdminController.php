<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        $stats = [
            'total_products' => Product::count(),
            'total_stock' => Product::sum('quantity'),
            'total_value' => Product::sum('quantity * price'),
        ];

        return response()->json($stats);
    }
}
