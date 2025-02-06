<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Fortify\Fortify;

class AuthController extends Controller
{

    // generate pin code with 123456789ABCD len 2
    private function generatePinCode()
    {
        $pin_code = '';
        $characters = '123456789ABCD';
        $max = strlen($characters) - 1;
        for ($i = 0; $i < 2; $i++) {
            $pin_code .= $characters[mt_rand(0, $max)];
        }
        return $pin_code;
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'uuid' => 'required|string|max:12',
        ]);

        // check if email is in ALLOWED_EMAILS or ending in ALLOWED_ORGANIZATIONS_EMAILS
        $allowed_emails = explode(',', env('ALLOWED_EMAILS'));
        $allowed_organizations_emails = explode(',', env('ALLOWED_ORGANIZATIONS_EMAILS'));

        return response()->json(['message' => env('ALLOWED_ORGANIZATIONS_EMAILS')], 401);


        if(!(env('ALLOWED_ORGANIZATIONS_EMAILS') == null || env('ALLOWED_ORGANIZATIONS_EMAILS') == '' || env('ALLOWED_ORGANIZATIONS_EMAILS') == '*') || !(env('ALLOWED_EMAILS') == null || env('ALLOWED_EMAILS') == '' || env('ALLOWED_EMAILS') == '*')) {
            $email = $request->email;
            $email_domain = substr(strrchr($email, "@"), 1);
            if (!in_array($email, $allowed_emails) && !in_array($email_domain, $allowed_organizations_emails)) {
                return response()->json(['message' => 'Unauthorized email'], 401);
            }
        }




        $pin_code = $this->generatePinCode();
        // check if pin code exists
        while (User::where('pin_code', $pin_code)->exists()) {
            $pin_code = $this->generatePinCode();
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'uuid' => $request->uuid,
            'pin_code' => $pin_code

        ]);

        return response()->json([
            'token' => $user->createToken('API Token')->plainTextToken,
            'user' => $user
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Email or password don\'t match our records'], 401);
        }
        $user = Auth::user();
        return response()->json([
            'token' => $user->createToken('API-Token')->plainTextToken,
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
