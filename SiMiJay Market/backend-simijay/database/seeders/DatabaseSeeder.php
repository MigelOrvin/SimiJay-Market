<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Supplier;
use App\Models\Kategori;
use App\Models\Barang;
use Illuminate\Support\Facades\DB;  

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $userData = DB::table('users')->get();  
        foreach ($userData as $user) {
            User::create([
                'kode' => $user->kode,
                'nama' => $user->nama,
                'email' => $user->email,
                'password' => $user->password,
                'foto' => $user->foto,
                'role' => $user->role,
            ]);
        }

        $supplierData = DB::table('suppliers')->get();
        foreach ($supplierData as $supplier) {
            Supplier::create([
                'nama' => $supplier->nama,
                'nama_barang' => $supplier->nama_barang,
                'stok' => $supplier->stok,
                'harga' => $supplier->harga,
            ]);
        }

        $kategoriData = DB::table('kategoris')->get();
        foreach ($kategoriData as $kategori) {
            Kategori::create([
                'nama' => $kategori->nama,
            ]);
        }

        $barangData = DB::table('barangs')->get(); 
        foreach ($barangData as $barang) {
            Barang::create([
                'kode' => $barang->kode,
                'nama' => $barang->nama,
                'gambar' => $barang->gambar,
                'id_kategori' => $barang->id_kategori,
                'id_supplier' => $barang->id_supplier,
                'harga' => $barang->harga,
                'stok' => $barang->stok,
                'tag' => $barang->tag,
                'berat' => $barang->berat,
                'deskripsi' => $barang->deskripsi,
                'detail' => $barang->detail,
            ]);
        }
    }
}

