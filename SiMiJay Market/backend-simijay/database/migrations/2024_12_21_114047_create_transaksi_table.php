<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaksis', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->float('total_harga');
            $table->timestamp('waktu_transaksi');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('transaksi_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('transaksi_id');
            $table->unsignedBigInteger('barang_id');
            $table->integer('jumlah');
            $table->float('harga');
            $table->float('subtotal');
            $table->timestamps();

            $table->foreign('transaksi_id')->references('id')->on('transaksis')->onDelete('cascade');
            $table->foreign('barang_id')->references('id')->on('barangs')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi_details');
        Schema::dropIfExists('transaksis');
    }
};
