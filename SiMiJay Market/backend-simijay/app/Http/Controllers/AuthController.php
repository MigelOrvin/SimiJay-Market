<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request) {
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

        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,customer,kasir',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'kode' => $kode,
            'nama' => $request->nama,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['message' => 'Berhasil Register', 'access_token' => $token, 'token_type' => 'Bearer']);
    }

    public function login(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        } else {
            if ($user->role == 'admin') {
                $token = $user->createToken('auth_token')->plainTextToken;
                return response()->json(['message' => 'Berhasil Login', 'role' => 'admin', 'access_token' => $token, 'token_type' => 'Bearer', 'user' => $user]);
            } else if ($user->role == 'customer') {
                $token = $user->createToken('auth_token')->plainTextToken;
                return response()->json(['message' => 'Berhasil Login', 'role' => 'customer', 'access_token' => $token, 'token_type' => 'Bearer', 'user' => $user]);
            } else {
                $token = $user->createToken('auth_token')->plainTextToken;
                return response()->json(['message' => 'Berhasil Login', 'role' => 'kasir', 'access_token' => $token, 'token_type' => 'Bearer', 'user' => $user]);
            }

        }

    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Berhasil Logout']);
    }
}