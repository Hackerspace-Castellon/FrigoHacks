<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;


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

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
            'uuid' => ['required', 'string', 'max:12'],
        ])->validate();

        // check if email is in ALLOWED_EMAILS or ending in ALLOWED_ORGANIZATIONS_EMAILS
        $allowed_emails = explode(',', env('ALLOWED_EMAILS'));
        $allowed_organizations_emails = explode(',', env('ALLOWED_ORGANIZATIONS_EMAILS'));



        if(!(env('ALLOWED_ORGANIZATIONS_EMAILS') == null || env('ALLOWED_ORGANIZATIONS_EMAILS') == '' || env('ALLOWED_ORGANIZATIONS_EMAILS') == '*') || !(env('ALLOWED_EMAILS') == null || env('ALLOWED_EMAILS') == '' || env('ALLOWED_EMAILS') == '*')) {
            $email = $input['email'];
            $email_domain = substr(strrchr($email, "@"), 1);
            if (!in_array($email, $allowed_emails) && !in_array($email_domain, $allowed_organizations_emails)) {
                throw new \Exception('Unauthorized email');

            }
        }

        $pin_code = $this->generatePinCode();
        // check if pin code exists
        while (User::where('pin_code', $pin_code)->exists()) {
            $pin_code = $this->generatePinCode();
        }

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
            'uuid' => $input['uuid'],
            'pin_code' => $pin_code
        ]);
    }
}
