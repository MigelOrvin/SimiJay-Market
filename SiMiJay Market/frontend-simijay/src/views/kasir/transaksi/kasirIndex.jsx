import React, { useEffect, useState } from 'react';
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";

const Transaksi = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);
  const [isSidebarActive, setIsSidebarActive] = useState(false); // Add sidebar state

  useEffect(() => {
    const fetchTransaksi = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token invalid");
        return;
      }

      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await Api.get("/api/kasir/transaksi");
        setTransaksi(response.data.transaksi);
        const total = response.data.transaksi.reduce((sum, trans) => sum + trans.total_harga, 0);
        setTotalPengeluaran(total);
      } catch (error) {
        console.error("Gagal mengambil data transaksi:", error.response ? error.response.data : error.message);
      }
    };

    fetchTransaksi();
  }, []);

  const handleToggleSidebar = (isActive) => {
    setIsSidebarActive(isActive);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <>
      <SidebarMenu onToggleSidebar={handleToggleSidebar} />
      <div className={`home_content ${isSidebarActive ? "active" : ""}`}>
        <div className="container mt-5 mb-5">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-4">
                  <div className="card border-0 rounded shadow-sm mb-4">
                    <div className="card-body">
                      <h4>Total Pengeluaran</h4>
                      <h5>{formatRupiah(totalPengeluaran)}</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {transaksi.length > 0 ? (
                  transaksi.map((trans) => (
                    <div key={trans.id} className="col-md-6">
                      <div className="card border-0 rounded shadow-sm mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <span className="fw-bold">ID Transaksi: {trans.id}</span>
                        </div>
                        <div className="card-body">
                          <h5>Total Harga: {formatRupiah(trans.total_harga)}</h5>
                          <h5>Waktu Transaksi: {trans.waktu_transaksi}</h5>
                          <h5>Detail Barang:</h5>
                          <ul>
                            {trans.details.map((detail) => (
                              <li key={detail.id}>
                                {detail.barang.nama} - {detail.jumlah} x {formatRupiah(detail.harga)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="alert alert-danger text-center">
                    Tidak ada transaksi terbaru!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Transaksi;