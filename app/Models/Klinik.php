<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Klinik extends Model
{
    protected $fillable = [
        'name',
        'kategori',
        'image',
        'limit'
    ];
}
