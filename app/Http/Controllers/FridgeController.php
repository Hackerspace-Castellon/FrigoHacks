<?php

namespace App\Http\Controllers;

use App\Models\Fridge;
use App\Models\Product;
use Illuminate\Http\Request;

class FridgeController extends Controller
{
    /**
     * Mostrar todos los frigoríficos.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Trae todos los frigoríficos con su producto relacionado
        return Fridge::with('product')->get();
    }

    /**
     * Crear un nuevo frigorífico.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validación de los datos
        $request->validate([
            'product_id' => 'required|exists:products,id', // Aseguramos que el producto exista
            'quantity' => 'required|integer|min:1', // Aseguramos que la cantidad sea un número entero positivo
        ]);

        // Crear el frigorífico y asignar los datos
        $fridge = Fridge::create([
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
        ]);

        // Devolver el frigorífico recién creado con el producto relacionado
        return response()->json($fridge->load('product'), 201);
    }

    /**
     * Mostrar un frigorífico específico.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // Buscar el frigorífico con su producto relacionado
        $fridge = Fridge::with('product')->findOrFail($id);

        return response()->json($fridge);
    }

    /**
     * Actualizar un frigorífico.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Validación de los datos
        $request->validate([
            'product_id' => 'required|exists:products,id', // Aseguramos que el producto exista
            'quantity' => 'required|integer|min:1', // Aseguramos que la cantidad sea un número entero positivo
        ]);

        // Buscar el frigorífico y actualizar los valores
        $fridge = Fridge::findOrFail($id);
        $fridge->update([
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
        ]);

        // Devolver el frigorífico actualizado con el producto relacionado
        return response()->json($fridge->load('product'), 200);
    }

    /**
     * Eliminar un frigorífico.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // Buscar y eliminar el frigorífico
        Fridge::destroy($id);

        return response()->json(null, 204);
    }
}
