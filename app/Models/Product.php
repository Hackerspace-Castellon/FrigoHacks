<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'price', 'quantity', 'in_fridge', 'image'];


    public function purchases()
    {
        return $this->hasMany(Transaction::class);
    }

    public function fridge()
    {
        return $this->hasOne(Fridge::class);
    }
}
