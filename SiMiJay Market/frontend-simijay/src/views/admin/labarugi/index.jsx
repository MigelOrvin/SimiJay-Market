import { useEffect, useState } from "react";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";

export default function LabaRugiIndex() {
  const [labarugi, setLabaRugi] = useState([]);
  const [isSidebarActive, setIsSidebarActive] = useState(false); // Add sidebar state

  const fetchDataLabaRugi = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await Api.get("/api/admin/labarugi");
        setLabaRugi(response.data.data);
      } catch (error) {
        console.error(
          "Terjadi error ketika fetching data laba rugi:",
          error.response ? error.response.data : error.message
        );
      }
    } else {
      console.error("Token invalid");
    }
  };

  useEffect(() => {
    fetchDataLabaRugi();
  }, []);

  const handleToggleSidebar = (isActive) => {
    setIsSidebarActive(isActive);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  return (
    <>
      <SidebarMenu onToggleSidebar={handleToggleSidebar} />
      <div className={`home_content ${isSidebarActive ? "active" : ""}`}>
        <div className="container mt-5 mb-5">
          <div className="row">

            <div className="col-md-12">
              <div className="card border-0 rounded shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Laporan Laba Rugi</span>
                </div>
                <div className="card-body">
                  <div className="row">
                    {labarugi.length > 0 ? (
                      labarugi.map((item, index) => (
                        <div key={index} className="col-md-4 mb-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <h5 className="card-title d-flex justify-content-between">
                                {item.nama}
                                <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                                  Terjual : {item.stok_terjual}
                                </span>
                              </h5>
                              <div className="row">
                                <div className="col-6">
                                  <p className="card-text mb-1"><strong>Harga Beli</strong></p>
                                  <p className="card-text mb-1"><strong>Harga Jual</strong></p>
                                  <p className="card-text mb-1"><strong>Laba<sub>/produk</sub></strong></p>
                                </div>
                                <div className="col-6 text-end">
                                  <p className="card-text mb-1"><span className="float-start">Rp</span>{formatRupiah(item.harga_supplier).replace('Rp', '')}</p>
                                  <p className="card-text mb-1"><span className="float-start">Rp</span>{formatRupiah(item.harga_barang).replace('Rp', '')}</p>
                                  <p className="card-text mb-1"><span className="float-start">Rp</span>{formatRupiah(item.laba_per_produk).replace('Rp', '')}</p>
                                </div>
                                <div className="col-12">
                                  <hr />
                                </div>
                                <div className="col-6">
                                  <p className="card-text mb-1"><strong>Total Harga</strong></p>
                                  <p className="card-text mb-1"><strong>Total Laba</strong></p>
                                  <p className="card-text mb-1"><strong>Modal</strong></p>
                                </div>
                                <div className="col-6 text-end">
                                  <p className="card-text mb-1"><span className="float-start">Rp</span>{formatRupiah(item.total_harga).replace('Rp', '')}</p>
                                  <p className="card-text mb-1"><span className="float-start">Rp</span>{formatRupiah(item.total_laba).replace('Rp', '')}</p>
                                  <p className="card-text mb-1"><span className="float-start">Rp</span>{formatRupiah(item.modal).replace('Rp', '')}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-12">
                        <div className="alert alert-danger mb-0">
                          Data belum tersedia!
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
