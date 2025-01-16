<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\LabaRugiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->middleware('guest')->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum', 'auth', 'cekrole:admin'])->group(function () {
    Route::get('/admin/barang', [BarangController::class, 'index']);
    Route::post('/admin/barang/store', [BarangController::class, 'store']);
    Route::get('/admin/barang/{id}', [BarangController::class, 'show']);
    Route::put('/admin/barang/{id}', [BarangController::class, 'update']);
    Route::delete('/admin/barang/{id}', [BarangController::class, 'destroy']);

    Route::get('/admin/kategori', [KategoriController::class, 'index']);
    Route::post('/admin/kategori/store', [KategoriController::class, 'store']);
    Route::get('/admin/kategori/{id}', [KategoriController::class, 'show']);
    Route::put('/admin/kategori/{id}', [KategoriController::class, 'update']);
    Route::delete('/admin/kategori/{id}', [KategoriController::class, 'destroy']);

    Route::get('/admin/user', [UserController::class, 'index']);
    Route::post('/admin/user/store', [UserController::class, 'store']);
    Route::get('/admin/user/{id}', [UserController::class, 'show']);
    Route::put('/admin/user/{id}', [UserController::class, 'update']);
    Route::delete('/admin/user/{id}', [UserController::class, 'destroy']);

    Route::get('/admin/supplier', [SupplierController::class, 'index']);
    Route::post('admin/supplier/store', [SupplierController::class, 'store']);
    Route::get('/admin/supplier/{id}', [SupplierController::class, 'show']);
    Route::put('/admin/supplier/{id}', [SupplierController::class, 'update']);
    Route::delete('/admin/supplier/{id}', [SupplierController::class, 'destroy']);
    Route::get('/admin/labarugi', [LabaRugiController::class, 'index']);
});

Route::middleware(['auth:sanctum', 'auth', 'cekrole:customer'])->group(function () {
    Route::get('/customer/barang', [BarangController::class, 'customerIndex']);
    Route::get('/customer/user', [UserController::class, 'profile']);
    Route::put('/customer/user/{id}', [UserController::class, 'updateProfile']);
    Route::get('/customer/keranjang', [KeranjangController::class, 'index']);
    Route::post('/customer/transaksi', [TransaksiController::class, 'store']);
    Route::get('/customer/transaksi/latest', [TransaksiController::class, 'latest']);
    Route::get('/customer/transaksi', [TransaksiController::class, 'index']);
});

Route::middleware(['auth:sanctum', 'auth', 'cekrole:kasir'])->group(function () {
    Route::get('/kasir/barang', [BarangController::class, 'kasirIndex']);
    Route::get('/kasir/keranjang', [KeranjangController::class, 'kasirIndex']);
    Route::post('/kasir/transaksi', [TransaksiController::class, 'kasirStore']);
    Route::get('/kasir/transaksi/latest', [TransaksiController::class, 'kasirLatest']);
    Route::get('/kasir/transaksi', [TransaksiController::class, 'kasirIndex']);
    Route::get('/kasir/laporan', [TransaksiController::class, 'laporan']);
});