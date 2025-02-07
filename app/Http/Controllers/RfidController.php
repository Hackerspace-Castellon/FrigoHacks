<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RfidController extends Controller
{


    private function userGlobal($user){

        if ($user) {
            return response()->json(['message' => 'User found'], 200);
        }
        return response()->json(['message' => 'User not found'], 404);
    }

    private function userProduct($user, $product){
        if ($user) {
            if ($product) {
                
                // check if enought product
                if ($product->quantity <= 0) {
                    return response()->json(['message' => 'Product out of stock'], 400);
                }
                if ($product->in_fridge <= 0) {
                    return response()->json(['message' => 'Product not in fridge'], 400);
                }

                // check if enought balance
                if ($user->balance < $product->price) {
                    return response()->json(['message' => 'Insufficient balance'], 400);
                }

                // remove balance
                $user->balance -= $product->price;
                $user->save();

                // remove product
                $product->quantity -= 1;
                $product->in_fridge -= 1;
                $product->save();

                // create transaction
                $user->transactions()->create([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'amount' => $product->price,
                    'type' => 'purchase',
                ]);

                return response()->json(['message' => 'Product bought successfully'], 200);
                

            }
            return response()->json(['message' => 'Product not found'], 404);
        }
        return response()->json(['message' => 'User not found'], 404);
    }

    // Procesar usuario a través de RFID
    public function processUser(Request $request)
    {
        $validated = $request->validate([
            'UUID' => 'required|string',
        ]);
        $user = User::where('uuid', $validated['UUID'])->first();
        return $this->userGlobal($user);
    }

    // Procesar usuario a través de código (pin_code)
    public function processCode(Request $request)
    {
        $validated = $request->validate([
            'user_code' => 'required|string',
        ]);

        $user = User::where('pin_code', $validated['user_code'])->first();

        return $this->userGlobal($user);
    }

    // Comprar producto con RFID
    public function purchaseWithRfid(Request $request)
    {
        $validated = $request->validate([
            'UUID' => 'required|string',
            'product_id' => 'required|string',
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $user = User::where('uuid', $validated['UUID'])->first();

        return $this->userProduct($user, $product);
    }

    // Comprar producto con código
    public function purchaseWithCode(Request $request)
    {
        $validated = $request->validate([
            'user_code' => 'required|string',
            'product_id' => 'required|string',
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $user = User::where('pin_code', $validated['user_code'])->first();

        return $this->userProduct($user, $product);
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
