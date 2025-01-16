import React, { useEffect, useState } from "react";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";

const Transaksi = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransaksi = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token invalid");
        return;
      }

      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await Api.get("/api/customer/transaksi");
        setTransaksi(response.data.transaksi);
        const total = response.data.transaksi.reduce(
          (sum, trans) => sum + trans.total_harga,
          0
        );
        setTotalPengeluaran(total);
      } catch (error) {
        console.error(
          "Gagal mengambil data transaksi:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaksi();
  }, []);

  useEffect(() => {
    const filteredTransaksi = transaksi.filter((trans) =>
      selectedDate
        ? new Date(trans.waktu_transaksi).toLocaleDateString() ===
          new Date(selectedDate).toLocaleDateString()
        : true
    );
    const total = filteredTransaksi.reduce(
      (sum, trans) => sum + trans.total_harga,
      0
    );
    setTotalPengeluaran(total);
  }, [selectedDate, transaksi]);

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
                <div className="col-md-12">
                  <div className="card border-0 rounded shadow-sm mb-4">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div>
                        <h4>Total Pengeluaran</h4>
                        <h5>{formatRupiah(totalPengeluaran)}</h5>
                      </div>
                      <div>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="form-control mb-2"
                        />
                        <button
                          onClick={() => setSelectedDate("")}
                          className="btn btn-primary w-100"
                        >
                          Tampilkan Semua
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {isLoading ? (
                  <div className="text-center">
                    <div
                      className="spinner-border"
                      style={{ color: "#89CFF0" }}
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="mt-2">Loading</div>
                  </div>
                ) : transaksi.length === 0 ? (
                  <div className="col-md-12">
                    <div className="card border-0 rounded shadow-sm mb-4">
                      <div className="card-body text-center">
                        Belum ada transaksi!
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="col-md-12">
                    <div className="list-group">
                      {transaksi
                        .filter((trans) =>
                          selectedDate
                            ? new Date(
                                trans.waktu_transaksi
                              ).toLocaleDateString() ===
                              new Date(selectedDate).toLocaleDateString()
                            : true
                        )
                        .map((trans) => (
                          <div key={trans.id} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-bold">
                                ID Transaksi : {trans.id}
                              </span>
                              <span>
                                Waktu Transaksi : {trans.waktu_transaksi}
                              </span>
                              <span>
                                Total Harga : {formatRupiah(trans.total_harga)}
                              </span>
                            </div>
                            <div>
                              <h5>Detail Barang :</h5>
                              <ul>
                                {trans.details.map((detail) => (
                                  <li key={detail.id}>
                                    {detail.barang.nama} - {detail.jumlah} x{" "}
                                    {formatRupiah(detail.harga)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                {selectedDate &&
                  transaksi.filter(
                    (trans) =>
                      new Date(trans.waktu_transaksi).toLocaleDateString() ===
                      new Date(selectedDate).toLocaleDateString()
                  ).length === 0 && (
                    <div className="col-md-12">
                      <div className="card border-0 rounded shadow-sm mb-4">
                        <div className="card-body text-center">
                          Tidak ada transaksi pada tanggal{" "}
                          {new Date(selectedDate).toLocaleDateString("id-ID")}
                        </div>
                      </div>
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
