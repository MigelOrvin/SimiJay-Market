<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Keranjang;
use App\Models\Transaksi;
use App\Models\TransaksiDetail;

class TransaksiController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $keranjangs = Keranjang::where('user_id', $data['user_id'])->get();

        if ($keranjangs->isEmpty()) {
            return response()->json(['message' => 'Cart is empty.'], 400);
        }

        $transaksi = Transaksi::create([
            'user_id' => $data['user_id'],
            'total_harga' => $keranjangs->sum('total_harga'),
            'waktu_transaksi' => now(),
        ]);

        foreach ($keranjangs as $keranjang) {
            TransaksiDetail::create([
                'transaksi_id' => $transaksi->id,
                'barang_id' => $keranjang->barang_id,
                'jumlah' => $keranjang->jumlah,
                'subtotal' => $keranjang->total_harga,
            ]);
        }

        Keranjang::where('user_id', $data['user_id'])->delete();
        return response()->json(['message' => 'Transaction completed successfully.']);
    }
}


