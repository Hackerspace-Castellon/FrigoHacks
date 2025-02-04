<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = User::findOrFail($validated['user_id']);
        $product = Product::findOrFail($validated['product_id']);

        if ($product->quantity < $validated['quantity']) {
            return response()->json(['message' => 'Not enough stock'], 400);
        }

        $totalPrice = $product->price * $validated['quantity'];
        if ($user->balance < $totalPrice) {
            return response()->json(['message' => 'Insufficient balance'], 400);
        }

        // Create transaction
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => $validated['quantity'],
            'total_price' => $totalPrice,
        ]);

        // Update product quantity and user balance
        $product->quantity -= $validated['quantity'];
        $product->save();

        $user->balance -= $totalPrice;
        $user->save();

        return response()->json(['message' => 'Purchase successful', 'transaction' => $transaction]);
    }

    public function index()
    {
        $purchases = Transaction::where('type', 'purchase')->get();
        return response()->json($purchases);
    }
}
