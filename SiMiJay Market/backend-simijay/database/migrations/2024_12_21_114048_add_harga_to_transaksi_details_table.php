<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transaksi_details', function (Blueprint $table) {
            $table->float('harga')->nullable()->after('barang_id'); 
        });
    }

    public function down(): void
    {
        Schema::table('transaksi_details', function (Blueprint $table) {
            $table->dropColumn('harga');
        });
    }
};
