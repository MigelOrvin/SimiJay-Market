<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index()
    {
        $user = User::all();

        return response()->json($user);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $sekarang = Carbon::now();
        $tahun_bulan = $sekarang->year . $sekarang->month;
        $cek = User::count();

        if ($cek == 0) {
            $urut = 10001;
            $kode = 'SN' . $tahun_bulan . $urut;
        } else {
            $ambil = User::all()->last();
            $urut = (int)substr($ambil->kode, -5) + 1;
            $kode = 'SN' . $tahun_bulan . $urut;
        }

        try {
            $request->validate([
                'nama' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string',
                'role' => 'required|in:admin,customer,kasir',
                'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            ]);

            $user = User::create([
                'kode' => $kode,
                'nama' => $request->nama,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ]);

            if ($request->hasFile('foto')) {
                $relativePath = $this->saveImage($request->foto);
                $user->foto = $relativePath;
                $user->save();
            }

            return response()->json($user, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ]);
        }
    }

    private function saveImage($image)
    {
        $dir = 'images/fotos/';
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
        $user = User::findOrFail($id);

        return response()->json($user);
    }

    public function edit(User $user)
    {
        //
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'password' => 'nullable|string|min:8',
        ]);

        $user->nama = $request->nama;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        if ($request->hasFile('foto')) {
            if ($user->foto) {
                $absolutePath = public_path($user->foto);
                File::delete($absolutePath);
            }

            $relativePath = $this->saveImage($request->foto);
            $user->foto = $relativePath;
        }

        $user->save();

        return response()->json(['message' => 'Berhasil di Edit', 'user' => $user]);
    }

    public function updateProfile(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);
            $currentUser = Auth::user();

            if ($currentUser->role === 'customer' && $currentUser->id != $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $request->validate([
                'nama' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $user->id,
                'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($request->hasFile('foto')) {
                if ($user->foto) {
                    $oldPhotoPath = public_path($user->foto);
                    if (file_exists($oldPhotoPath)) {
                        unlink($oldPhotoPath);
                    }
                }

                $fotoPath = $request->file('foto')->store('photos', 'public');
                $user->foto = 'storage/' . $fotoPath;
            }

            $user->nama = $request->nama;
            $user->email = $request->email;


            if ($request->password) {
                $user->password = Hash::make($request->password);
            }

            $user->save();

            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }


    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Berhasil menghapus data']);
    }
}
