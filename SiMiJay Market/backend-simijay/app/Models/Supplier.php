<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'nama_barang',
        'stok',
        'harga'
    ];

    public function barang() {
        return $this->hasMany(Barang::class);
    }
}
