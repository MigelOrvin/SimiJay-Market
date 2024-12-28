<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Laporan extends Model
{
    use HasFactory;

    protected $fillable = ['barang_id', 'jumlah_terjual', 'total_harga_per_produk', 'total_seluruh_harga'];

    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }
}
