<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'quantity' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
        ]);

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function updateQuantity(Request $request, $id)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $product = Product::findOrFail($id);
        $product->quantity = $validated['quantity'];
        $product->save();

        return response()->json(['message' => 'Quantity updated successfully']);
    }

    public function updatePrice(Request $request, $id)
    {
        $validated = $request->validate([
            'price' => 'required|numeric|min:0',
        ]);

        $product = Product::findOrFail($id);
        $product->price = $validated['price'];
        $product->save();

        return response()->json(['message' => 'Price updated successfully']);
    }

    public function restock(Request $request, $id)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $product = Product::findOrFail($id);
        $product->quantity += $validated['quantity'];
        $product->save();

        return response()->json(['message' => 'Product restocked successfully']);
    }

    public function index()
    {
        $products = Product::all();
        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }
}
