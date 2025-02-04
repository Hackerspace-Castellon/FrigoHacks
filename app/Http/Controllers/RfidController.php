<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RfidController extends Controller
{
    // Procesar usuario a través de RFID
    public function processUser(Request $request)
    {
        $validated = $request->validate([
            'UUID' => 'required|string',
        ]);
        Log::info($validated['UUID']);
        return response()->json(['message' => 'User found'], 200);
        $user = User::where('UUID', $validated['UUID'])->first();

        if ($user) {
            return response()->json(['message' => 'User found'], 200);
        }

        return response()->json(['message' => 'User not found'], 404);
    }

    // Procesar usuario a través de código (pin_code)
    public function processCode(Request $request)
    {
        $validated = $request->validate([
            'user_code' => 'required|string',
        ]);

        $user = User::where('pin_code', $validated['user_code'])->first();

        if ($user) {
            return response()->json(['message' => 'User found'], 200);
        }

        return response()->json(['message' => 'User not found'], 404);
    }

    // Comprar producto con RFID
    public function purchaseWithRfid(Request $request)
    {
        $validated = $request->validate([
            'UUID' => 'required|string',
            'product_id' => 'required|string',
        ]);

        // Aquí puedes realizar la lógica para la compra con RFID
        $url = env('ESP32_IP') . '/rfid/product';
        $response = Http::post($url, [
            'UUID' => $validated['UUID'],
            'product_id' => $validated['product_id']
        ]);

        if ($response->status() == 200) {
            return response()->json(['message' => 'Producto suministrado'], 200);
        }

        return response()->json(['message' => 'Error en producto'], 400);
    }

    // Comprar producto con código
    public function purchaseWithCode(Request $request)
    {
        $validated = $request->validate([
            'user_code' => 'required|string',
            'product_id' => 'required|string',
        ]);

        // Aquí puedes realizar la lógica para la compra con código
        $url = env('ESP32_IP') . '/code/product';
        $response = Http::post($url, [
            'user_code' => $validated['user_code'],
            'product_id' => $validated['product_id']
        ]);

        if ($response->status() == 200) {
            return response()->json(['message' => 'Producto suministrado'], 200);
        }

        return response()->json(['message' => 'Error en producto'], 400);
    }

    // Obtener UUID de la tarjeta RFID
    public function getCard()
    {
        $url = env('ESP32_IP') . '/scan';
        $response = Http::get($url);

        if ($response->status() == 200) {
            return response()->json(['UUID' => $response->body()], 200);
        }

        return response()->json(['message' => 'Error al obtener el UUID de la tarjeta'], 400);
    }

    // Verificar el estado del lector RFID
    public function status()
    {
        $url = env('ESP32_IP') . '/status';
        $response = Http::get($url);

        if ($response->status() == 200) {
            return response()->json(['message' => 'Lector RFID en funcionamiento'], 200);
        }

        return response()->json(['message' => 'Error con el lector RFID'], 404);
    }
}
