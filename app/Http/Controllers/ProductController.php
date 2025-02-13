<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Buglinjo\LaravelWebp\Facades\Webp;
use Intervention\Image\Laravel\Facades\Image;
use Intervention\Image\Encoders\WebpEncoder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class ProductController extends Controller
{

    private function saveImage($request){
        $image = Image::read($request->file('image'))
                ->cover(400, 400)
                ->encode(new WebpEncoder(quality: 75));

            
            // create image route if needed
            if (!file_exists(public_path('images'))) {
                mkdir(public_path('images'));
            }

            // Generate a unique name for the image without extension
            $imgName = $request->file('image')->hashName();
            // save
            $image->save(public_path('images/' . $imgName . '.webp'));
            return $imgName;
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }
    
    public function showAll(Request $request)
    {
        $products = Product::all();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        // check in_fridge always less than quantity

        $validated = $request->validate([
            'name' => 'required|string',
            'quantity' => 'required|integer|min:0',
            'in_fridge' => 'required|integer|min:0|lte:quantity',
            'price' => 'required|numeric|min:0',
            'file' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ], [
            'in_fridge.lte' => 'The in fridge must be less than or equal to quantity.'
        ]);


        if(env('ALWAYS_EQUAL_FRIDGE_TO_STOCK')){
            $validated['in_fridge'] = $validated['quantity'];
        }

        // if has file, upload it convert it to webp 400x400
        if ($request->hasFile('image')) {
            $validated['image'] = $this->saveImage($request);
        }else{
            $validated['image'] = 'default.webp';
        }

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'nullable|string',
            'quantity' => 'nullable|integer|min:0',
            'in_fridge' => 'nullable|integer|min:0|lte:quantity',
            'price' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ], [
            'in_fridge.lte' => 'The in fridge must be less than or equal to quantity.'
        ]);
        // return response()->json($request->all());
        // if has file, upload it convert it to webp 400x400
        if ($request->hasFile('image')) {
            $validated['image'] = $this->saveImage($request);
            $validated['image'] = $validated['image'] . '.webp';
        }

        $product = Product::findOrFail($id);

        if(env('ALWAYS_EQUAL_FRIDGE_TO_STOCK')){
            if($request->has('quantity')){
                $validated['in_fridge'] = $validated['quantity'];
            }else{
                $validated['in_fridge'] = $product->quantity;
            }
        }


        // if has file, delete the old one
        if ($request->hasFile('image')) {
            // remove not unlink
            File::delete(public_path('images/' . $product->image . '.webp'));
        }else{
            $validated['image'] = $product->image;
        }

        $product->update($validated);
        $product->save();
        return response()->json($product);
    }


    public function print()
    {
        $products = Product::all();
        return view('products.print', compact('products'));
    }
   
}
