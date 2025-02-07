<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AdminUserController extends Controller
{

    public function showAll()
    {
        $users = User::all();
        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'UUID' => 'required|string|unique:users',
        ]);

        $user = User::create($validated);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'nullable|string',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'balance' => 'nullable|numeric',
            'role_id' => 'nullable|numeric',
            'password' => 'nullable|string|min:6',
            'UUID' => 'nullable|string|unique:users,UUID,' . $id,
            'pin_code' => 'nullable|string|min:2|max:2|unique:users,pin_code,' . $id,
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


    public function transactionsSpecify($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user->transactions()->with('product:name')->get());
    }

}
