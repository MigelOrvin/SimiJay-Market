import { useEffect, useState } from "react";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";

export default function LabaRugiIndex() {
  const [labarugi, setLabaRugi] = useState([]);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
      } finally {
        setIsLoading(false);
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredLabaRugi = labarugi.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    style={{ width: "200px" }}
                    placeholder="Cari Produk"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <div className="card-body">
                  {isLoading ? (
                    <div className="text-center">
                      <div className="spinner-border" style={{ color: "#89CFF0" }} role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <div className="mt-2">Loading</div>
                    </div>
                  ) : (
                    <div className="row">
                      {filteredLabaRugi.length > 0 ? (
                        filteredLabaRugi.map((item, index) => (
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
                            {searchTerm ? `"${searchTerm}" tidak ditemukan` : "Data belum tersedia, silahkan lakukan transaksi terlebih dahulu!"}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
