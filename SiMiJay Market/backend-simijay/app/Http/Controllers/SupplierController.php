<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        $supplier = Supplier::all();

        return response()->json($supplier);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'nama' => 'required|string|max:255',
                'nama_barang' => 'required|string|max:255',
                'stok' => 'required|integer|min:0',
                'harga' => 'required|numeric|min:0',
            ]);

            $supplier = new Supplier;
            $supplier->nama = $request->nama;
            $supplier->nama_barang = $request->nama_barang;
            $supplier->stok = $request->stok;
            $supplier->harga = $request->harga;
            $supplier->save();

            return response()->json($supplier, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $supplier = Supplier::findOrFail($id);

        return response()->json($supplier);
    }

    public function edit(Supplier $supplier)
    {
        //
    }

    public function update(Request $request, $id)
    {
        try {
            $supplier = Supplier::findOrFail($id);

            $request->validate([
                'nama' => 'required|string|max:255',
                'nama_barang' => 'required|string|max:255',
                'stok' => 'required|integer|min:0',
                'harga' => 'required|numeric|min:0',
            ]);

            $supplier->update($request->all());

            return response()->json($supplier);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();

        return response()->json(['message' => 'Berhasil menghapus data']);
    }
}
