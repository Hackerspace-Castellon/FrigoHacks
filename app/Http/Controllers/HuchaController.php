<?php

namespace App\Http\Controllers;

use App\Models\Hucha;
use Illuminate\Http\Request;

class HuchaController extends Controller
{
    public function index()
    {
        return Hucha::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'balance' => 'required|numeric',
        ]);

        $hucha = Hucha::create($request->all());

        return response()->json($hucha, 201);
    }

    public function show($id)
    {
        return Hucha::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $hucha = Hucha::findOrFail($id);
        $hucha->update($request->all());

        return response()->json($hucha, 200);
    }

    public function destroy($id)
    {
        Hucha::destroy($id);

        return response()->json(null, 204);
    }
}
