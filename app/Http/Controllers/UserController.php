<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{

      public function get(Request $request)
    {

        // request user with tiers and aviable factures to make
        $user =  $request->user();
 
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

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'nullable|string',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'UUID' => 'nullable|string|unique:users,UUID,' . $id,
        ]);

        $user = User::findOrFail($id);
        $user->update($validated);
        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function balance($id)
    {
        $user = User::findOrFail($id);
        return response()->json(['balance' => $user->balance]);
    }

    public function balances()
    {
        $users = User::all();
        return response()->json($users->pluck('balance'));
    }

    public function transactions($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user->transactions);
    }
}
