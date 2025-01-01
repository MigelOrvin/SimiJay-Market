<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaksi;
use App\Models\TransaksiDetail;
use App\Models\Barang;
use Carbon\Carbon;

class TransaksiController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'items' => 'required|array',
            'items.*.barang_id' => 'required|exists:barangs,id',
            'items.*.jumlah' => 'required|integer|min:1',
        ]);

        $totalHarga = 0;
        foreach ($data['items'] as $item) {
            $barang = Barang::findOrFail($item['barang_id']);
            $totalHarga += $barang->harga * $item['jumlah'];
        }

        $transaksi = Transaksi::create([
            'user_id' => $data['user_id'],
            'total_harga' => $totalHarga,
            'waktu_transaksi' => Carbon::now('Asia/Jakarta'),
        ]);

        foreach ($data['items'] as $item) {
            $barang = Barang::findOrFail($item['barang_id']);
            $barang->stok -= $item['jumlah'];
            $barang->save();
            TransaksiDetail::create([
                'transaksi_id' => $transaksi->id,
                'barang_id' => $item['barang_id'],
                'jumlah' => $item['jumlah'],
                'harga' => $barang->harga,
                'subtotal' => $barang->harga * $item['jumlah'],
            ]);
        }

        return response()->json(['message' => 'Transaksi berhasil disimpan', 'transaksi' => $transaksi]);
    }

    public function kasirStore(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'items' => 'required|array',
            'items.*.barang_id' => 'required|exists:barangs,id',
            'items.*.jumlah' => 'required|integer|min:1',
        ]);

        $totalHarga = 0;
        foreach ($data['items'] as $item) {
            $barang = Barang::findOrFail($item['barang_id']);
            $totalHarga += $barang->harga * $item['jumlah'];
        }

        $transaksi = Transaksi::create([
            'user_id' => $data['user_id'],
            'total_harga' => $totalHarga,
            'waktu_transaksi' => Carbon::now('Asia/Jakarta'),
        ]);

        foreach ($data['items'] as $item) {
            $barang = Barang::findOrFail($item['barang_id']);
            $barang->stok -= $item['jumlah'];
            $barang->save();
            TransaksiDetail::create([
                'transaksi_id' => $transaksi->id,
                'barang_id' => $item['barang_id'],
                'jumlah' => $item['jumlah'],
                'harga' => $barang->harga,
                'subtotal' => $barang->harga * $item['jumlah'],
            ]);
        }

        return response()->json(['message' => 'Transaksi berhasil disimpan', 'transaksi' => $transaksi]);
    }

    public function latest()
    {
        $transaksi = Transaksi::with('details.barang')->latest()->first();
        return response()->json(['transaksi' => $transaksi]);
    }

    public function kasirLatest()
    {
        $transaksi = Transaksi::with('details.barang')->latest()->first();
        return response()->json(['transaksi' => $transaksi]);
    }

    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $transaksi = Transaksi::with('details.barang')
            ->where('user_id', $userId)
            ->orderBy('waktu_transaksi', 'desc')
            ->get();
        return response()->json(['transaksi' => $transaksi->map(function ($trans) {
            $trans->details->each(function ($detail) {
                $detail->harga = $detail->barang->harga;
            });
            return $trans;
        })]);
    }

    public function kasirIndex(Request $request)
    {
        $userId = $request->user()->id;
        $transaksi = Transaksi::with('details.barang')
            ->where('user_id', $userId)
            ->orderBy('waktu_transaksi', 'desc')
            ->get();
        return response()->json(['transaksi' => $transaksi->map(function ($trans) {
            $trans->details->each(function ($detail) {
                $detail->harga = $detail->barang->harga;
            });
            return $trans;
        })]);
    }


    public function laporan()
    {
        $transaksi = Transaksi::with('details.barang')
            ->orderBy('waktu_transaksi', 'desc')
            ->get();
        return response()->json(['transaksi' => $transaksi->map(function ($trans) {
            $trans->details->each(function ($detail) {
                $detail->harga = $detail->barang->harga;
            });
            return $trans;
        })]);
    }
}
