import React, { useEffect, useState } from 'react';
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";

const Transaksi = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);
  const [produkTerjual, setProdukTerjual] = useState([]);
  const [isSidebarActive, setIsSidebarActive] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popularitasProduk, setPopularitasProduk] = useState({ terlaris: [], kurangDiminati: [] });
  const [searchTerm, setSearchTerm] = useState("");

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaksi();
  }, []);

  useEffect(() => {
    const calculatePopularitas = () => {
      if (produkTerjual.length > 0) {
        const maxJumlah = Math.max(...produkTerjual.map(produk => produk.jumlah));
        const minJumlah = Math.min(...produkTerjual.map(produk => produk.jumlah));

        const terlaris = produkTerjual.filter(produk => produk.jumlah === maxJumlah);
        const kurangDiminati = produkTerjual.filter(produk => produk.jumlah === minJumlah);

        setPopularitasProduk({ terlaris, kurangDiminati });
      }
    };

    calculatePopularitas();
  }, [produkTerjual]);

  const handleToggleSidebar = (isActive) => {
    setIsSidebarActive(isActive);
  };

  const handleShowPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProdukTerjual = produkTerjual
    .filter(produk => produk.nama.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.nama.localeCompare(b.nama));

  return (
    <>
      <SidebarMenu onToggleSidebar={handleToggleSidebar} />
      <div className={`home_content ${isSidebarActive ? "active" : ""}`}>
        <div className="container mt-5 mb-5">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-12">
                  <div className="card border-0 rounded shadow-sm mb-4">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1>Laporan Penjualan</h1>
                        <div className="d-flex">
                          <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Cari Produk"
                            value={searchTerm}
                            onChange={handleSearch}
                            style={{ width: "200px" }}
                          />
                          <button className="btn btn-info" onClick={handleShowPopup}>
                            Popularitas Produk
                          </button>
                        </div>
                      </div>
                      {isLoading ? (
                        <div className="text-center">
                          <div className="spinner-border" style={{ color: "#89CFF0" }} role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <div className="mt-2">Loading</div>
                        </div>
                      ) : transaksi.length === 0 ? ( 
                        <p className="text-center">Belum ada data Laporan Penjualan</p>
                      ) : (
                        <>
                          {filteredProdukTerjual.length > 0 ? (
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>Nama Produk</th>
                                  <th>Jumlah Terjual</th>
                                  <th>Harga<sub> / produk</sub></th>
                                  <th>Total Harga<sub> / produk</sub></th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredProdukTerjual.map((produk, index) => (
                                  <tr
                                    key={index}
                                    className={
                                      popularitasProduk.terlaris.some(p => p.nama === produk.nama)
                                        ? "table-success"
                                        : popularitasProduk.kurangDiminati.some(p => p.nama === produk.nama)
                                        ? "table-danger"
                                        : ""
                                    }
                                  >
                                    <td>{produk.nama}</td>
                                    <td>{produk.jumlah}</td>
                                    <td>{formatRupiah(produk.harga)}</td>
                                    <td>{formatRupiah(produk.totalHarga)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="text-center">"{searchTerm}" tidak ditemukan</p>
                          )}
                          {searchTerm === "" && (
                            <h2><br/>Total Keseluruhan : {formatRupiah(totalPengeluaran)}</h2>
                          )}
                          {showPopup && (
                            <div className="popularitas-popup">
                              <button className="close-btn" onClick={handleClosePopup}>x</button>
                              <div className="content">
                                <div className="column">
                                  <h2>Produk Terlaris</h2>
                                  {popularitasProduk.terlaris.map((produk, index) => (
                                    <p key={index}>{produk.nama}</p>
                                  ))}
                                  {popularitasProduk.terlaris.length > 0 && (
                                    <button className="btn btn-success btn-sm mt-2">Terjual {popularitasProduk.terlaris[0].jumlah}</button>
                                  )}
                                </div>
                                <div className="separator"></div>
                                <div className="column">
                                  <h2>Produk Kurang Diminati</h2>
                                  {popularitasProduk.kurangDiminati.map((produk, index) => (
                                    <p key={index}>{produk.nama}</p>
                                  ))}
                                  {popularitasProduk.kurangDiminati.length > 0 && (
                                    <button className="btn btn-danger btn-sm mt-2">Terjual {popularitasProduk.kurangDiminati[0].jumlah}</button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Transaksi;
