<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('barangs', function (Blueprint $table) {
            $table->id();
            $table->string('kode');
            $table->string('nama');
            $table->string('gambar')->nullable();
            $table->integer('id_kategori');
            $table->integer('id_supplier');
            $table->float('harga');
            $table->integer('stok');
            $table->string('tag'); 
            $table->float('berat'); 
            $table->text('deskripsi');
            $table->text('detail'); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('barangs');
    }
};
