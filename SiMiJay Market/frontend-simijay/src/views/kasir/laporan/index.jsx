import React, { useEffect, useState } from 'react';
import Api from "../../../services/api";
import Navbar from "../../../components/Navbar";
import SidebarMenu from "../../../components/SidebarMenu";

const Transaksi = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);
  const [produkTerjual, setProdukTerjual] = useState([]);

  useEffect(() => {
    const fetchTransaksi = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token invalid");
        return;
      }

      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await Api.get("/api/kasir/laporan");
        setTransaksi(response.data.transaksi);
        const total = response.data.transaksi.reduce((sum, trans) => sum + trans.total_harga, 0);
        setTotalPengeluaran(total);

        const produkMap = {};
        response.data.transaksi.forEach(trans => {
          trans.details.forEach(detail => {
            if (!produkMap[detail.barang.nama]) {
              produkMap[detail.barang.nama] = {
                nama: detail.barang.nama,
                jumlah: 0,
                harga: detail.harga,
                totalHarga: 0
              };
            }
            produkMap[detail.barang.nama].jumlah += detail.jumlah;
            produkMap[detail.barang.nama].totalHarga += detail.jumlah * detail.harga;
          });
        });
        setProdukTerjual(Object.values(produkMap));
      } catch (error) {
        console.error("Gagal mengambil data transaksi:", error.response ? error.response.data : error.message);
      }
    };

    fetchTransaksi();
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col-md-3">
            <SidebarMenu />
          </div>
          <div className="col-md-9">
            <h1>Laporan Transaksi</h1>
            <table className="table">
              <thead>
                <tr>
                  <th>Nama Produk</th>
                  <th>Jumlah Terjual</th>
                  <th>Harga per Produk</th>
                  <th>Total Harga per Produk</th>
                </tr>
              </thead>
              <tbody>
                {produkTerjual.map((produk, index) => (
                  <tr key={index}>
                    <td>{produk.nama}</td>
                    <td>{produk.jumlah}</td>
                    <td>{formatRupiah(produk.harga)}</td>
                    <td>{formatRupiah(produk.totalHarga)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2>Total Keseluruhan: {formatRupiah(totalPengeluaran)}</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default Transaksi;
