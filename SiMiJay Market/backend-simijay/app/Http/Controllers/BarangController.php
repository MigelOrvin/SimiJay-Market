<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Kategori;
use App\Models\Supplier;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;

class BarangController extends Controller
{
    public function index()
    {
        $barang = Barang::all();
        $kategori = Kategori::all();
        $supplier = Supplier::all();

        return response()->json([
            'message' => 'show all',
            'data' => [
                'barang' => $barang,
                'kategori' => $kategori,
                'supplier' => $supplier,
            ],
        ]);
    }

    public function customerIndex()
    {
        $barang = Barang::all();
        $kategori = Kategori::all();
        $supplier = Supplier::all();

        return response()->json([
            'message' => 'show all',
            'data' => [
                'barang' => $barang,
                'kategori' => $kategori,
                'supplier' => $supplier,
            ],
        ]);
    }

    public function kasirIndex()
    {
        $barang = Barang::all();
        $kategori = Kategori::all();
        $supplier = Supplier::all();

        return response()->json([
            'message' => 'show all',
            'data' => [
                'barang' => $barang,
                'kategori' => $kategori,
                'supplier' => $supplier,
            ],
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $sekarang = Carbon::now();
        $tahun_bulan = $sekarang->year . $sekarang->month;
        $cek = Barang::count();

        if ($cek == 0) {
            $urut = 10001;
            $kode = 'KD' . $tahun_bulan . $urut;
        } else {
            $ambil = Barang::all()->last();
            $urut = (int)substr($ambil->kode, -5) + 1;
            $kode = 'KD' . $tahun_bulan . $urut;
        }

        try {
            $request->validate([
                'nama' => 'required|string|max:255',
                'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'id_kategori' => 'required|exists:kategoris,id',
                'id_supplier' => 'required|exists:suppliers,id',
                'harga' => 'required|numeric|min:0',
                'stok' => 'required|integer|min:0',
                'tag' => 'required|string|max:255',
                'berat' => 'required|numeric|min:0',
                'deskripsi' => 'required|string',
                'detail' => 'required|string',
            ]);

            $barang = Barang::create([
                'kode' => $kode,
                'nama' => $request->nama,
                'id_kategori' => $request->id_kategori,
                'id_supplier' => $request->id_supplier,
                'harga' => $request->harga,
                'stok' => $request->stok,
                'tag' => $request->tag,
                'berat' => $request->berat,
                'deskripsi' => $request->deskripsi,
                'detail' => $request->detail,
            ]);

            if ($request->hasFile('gambar')) {
                $relativePath = $this->saveImage($request->gambar);
                $barang->gambar = $relativePath;
                $barang->save();
            }

            return response()->json($barang, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    private function saveImage($image)
    {
        $dir = 'images/barang/';
        $fileName = time() . '.' . $image->getClientOriginalExtension();
        $absolutePath = public_path($dir);
        $relativePath = $dir . $fileName;

        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }

        $image->move($absolutePath, $fileName);

        return $relativePath;
    }

    public function show($id)
    {
        $barang = Barang::with('kategori', 'supplier')->find($id);
        $kategori = Kategori::all();
        $supplier = Supplier::all();

        return response()->json([
            'message' => 'barang by id',
            'data' => [
                'barang' => $barang,
                'kategori' => $kategori,
                'supplier' => $supplier,
            ]
        ]);
    }

    public function edit(Barang $barang)
    {
        //
    }

    public function update(Request $request, $id)
    {
        try {
            $barang = Barang::findOrFail($id);

            $request->validate([
                'nama' => 'required|string|max:255',
                'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'id_kategori' => 'required|exists:kategoris,id',
                'id_supplier' => 'required|exists:suppliers,id',
                'harga' => 'required|numeric|min:0',
                'stok' => 'required|integer|min:0',
                'tag' => 'required|string|max:255',
                'berat' => 'required|numeric|min:0',
                'deskripsi' => 'required|string',
                'detail' => 'required|string',
            ]);

            if ($request->hasFile('gambar')) {
                if ($barang->gambar) {
                    $absolutePath = public_path($barang->gambar);
                    File::delete($absolutePath);
                }
    
                $relativePath = $this->saveImage($request->gambar);
                $barang->gambar = $relativePath;
            }

            $barang->update([
                'nama' => $request->nama,
                'gambar' => $barang->gambar,
                'id_kategori' => $request->id_kategori,
                'id_supplier' => $request->id_supplier,
                'harga' => $request->harga,
                'stok' => $request->stok,
                'tag' => $request->tag,
                'berat' => $request->berat,
                'deskripsi' => $request->deskripsi,
                'detail' => $request->detail,
            ]);

            return response()->json($barang);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $barang = Barang::findOrFail($id);
        $barang->delete();

        return response()->json(['message' => 'Berhasil menghapus data']);
    }
}
