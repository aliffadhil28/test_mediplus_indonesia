<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jadwal extends Model
{
    protected $fillable = [
        'klinik_id',
        'tanggal',
        'quota',
        'harga'
    ];
}
