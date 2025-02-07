<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{

      public function get(Request $request)
    {

        // request user with tiers and aviable factures to make
        $user =  $request->user();
        if (!$user) {
            return response("Unauthorized", 401);
        }
        return response()->json($user, 200);
    }



    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'UUID' => 'required|string|unique:users',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'UUID' => $validated['UUID'],
        ]);

        return response()->json($user, 201);
    }

    

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string',
            'email' => 'nullable|email|unique:users,email' ,
            'password' => 'nullable|string|min:6',
            'UUID' => 'nullable|string|unique:users,UUID',
        ]);

        $user = $request->user();
        $user->update($validated);
        return response()->json($user);
    }

    
    public function transactions(Request $request)
    {
        $user =  $request->user();
        // return users tranasctions with the product name in the response without adding hole product object. put the product in the transaction object not as a subobjet
        return response()->json($user->transactions()->with('product:id,name')->get());
    }

    public function buy(Request $request)
    {

        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'nullable|integer|min:1',
        ]);
        $user =  $request->user();
        $product = Product::findOrFail($request->product_id);
        
        $quantity = $validated['quantity'] ?? 1;

        // check if product is available
        if ($product->quantity < $quantity) {
            return response()->json(['message' => 'Product not available'], 400);
        }

        // check if poduct is in the fridge
        if ($product->in_fridge < $quantity) {
            return response()->json(['message' => 'Product not in the fridge, ask admin to add'], 400);
        }


        // check if user has enough balance to buy the product
        if ($user->balance < $product->price * $quantity) {
            return response()->json(['message' => 'Insufficient balance'], 400);
        }

        // update user balance
        $user->balance -= $product->price;
        $user->save();

        // update product quantity
        $product->quantity -= 1;
        $product->in_fridge -= 1;
        $product->save();

        // create transaction
        $user->transactions()->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => $quantity,
            'amount' => $product->price,
            'type' => 'purchase',
        ]);

        return response()->json(['message' => 'Product bought successfully'],200);
    }

    public function addBalance(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        $user =  $request->user();
        $user->balance += $validated['amount'];
        $user->save();
        return response()->json($user);
    }

    public function removeBalance(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        $user =  $request->user();
        // check if user has enough balance to remove
        if ($user->balance < $validated['amount']) {
            return response()->json(['message' => 'Insufficient balance'], 400);
        }
        $user->balance -= $validated['amount'];
        $user->save();
        return response()->json($user);
    }

}
