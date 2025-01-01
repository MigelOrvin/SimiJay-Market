<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LabaRugiController extends Controller
{
    public function index()
    {
        $labarugi = DB::table('barangs')
            ->join('suppliers', 'barangs.id_supplier', '=', 'suppliers.id')
            ->leftJoin('transaksi_details', 'barangs.id', '=', 'transaksi_details.barang_id')
            ->select(
                'barangs.nama',
                'suppliers.harga as harga_supplier',
                'barangs.harga as harga_barang',
                DB::raw('(barangs.harga - suppliers.harga) as laba_per_produk'),
                DB::raw('SUM(transaksi_details.jumlah) as stok_terjual'),
                DB::raw('(barangs.harga * SUM(transaksi_details.jumlah)) as total_harga'),
                DB::raw('((barangs.harga - suppliers.harga) * SUM(transaksi_details.jumlah)) as total_laba'),
                DB::raw('((barangs.harga * SUM(transaksi_details.jumlah)) - ((barangs.harga - suppliers.harga) * SUM(transaksi_details.jumlah))) as modal')
            )
            ->groupBy(
                'barangs.id',
                'barangs.nama',
                'suppliers.harga',
                'barangs.harga'
            )
            ->get();

        return response()->json(['data' => $labarugi]);
    }
}
