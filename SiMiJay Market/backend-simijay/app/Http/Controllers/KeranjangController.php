<?php

namespace App\Http\Controllers;

use App\Models\Keranjang;
use App\Models\Barang;
use Illuminate\Http\Request;

class KeranjangController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'barang_id' => 'required|exists:barangs,id',
            'jumlah' => 'required|integer|min:1',
        ]);

        $barang = Barang::findOrFail($data['barang_id']);
        $data['total_harga'] = $barang->harga * $data['jumlah'];
        $data['waktu_pesan'] = now();

        Keranjang::create($data);
        return response()->json(['message' => 'Item added to cart successfully.']);
    }

    public function index(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $keranjang = Keranjang::where('user_id', $data['user_id'])->get();
        return response()->json(['keranjang' => $keranjang]);
    }

    public function kasirIndex(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $keranjang = Keranjang::where('user_id', $data['user_id'])->get();
        return response()->json(['keranjang' => $keranjang]);
    }
}
