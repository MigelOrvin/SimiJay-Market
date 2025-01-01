import { useEffect, useState } from "react";
import Api from "../../../services/api";
import Navbar from "../../../components/Navbar";
import SidebarMenu from "../../../components/SidebarMenu";
import { Link } from "react-router-dom";

export default function BarangIndex() {
  const [barang, setBarang] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDataBarang = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await Api.get("/api/admin/barang");
        setBarang(response.data.data.barang);
      } catch (error) {
        console.error(
          "Terjadi error ketika fetching data barang:",
          error.response ? error.response.data : error.message
        );
      }
    } else {
      console.error("Token invalid");
    }
  };

  useEffect(() => {
    fetchDataBarang();
  }, []);

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

  const filteredBarang = barang.filter((barangs) =>
    barangs.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col-md-3">
            <SidebarMenu />
          </div>
          <div className="col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold">DATA BARANG</h4>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control form-control-sm me-2"
                  placeholder="Cari Nama Produk"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Link
                  to={`/admin/barang`}
                  className="btn btn-sm btn-info text-white rounded-sm border-0"
                >
                  Kembali
                </Link>
              </div>
            </div>
            <div className="card border-0 rounded shadow-sm">
              <div className="card-body">
                {filteredBarang.length > 0 ? (
                  filteredBarang.map((barangs, index) => (
                    <div key={index} className="card mb-3">
                      <div className="row g-0">
                        <div className="col-md-4">
                          <img
                            src={
                              barangs.gambar
                                ? `http://localhost:8000/${barangs.gambar}`
                                : "https://img.qraved.co/v2/image/data/2016/09/22/Ayam_Betutu_Khas_Bali_2_1474542488119-x.jpg"
                            }
                            className="img-fluid rounded-start h-100"
                            alt={barangs.nama}
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div className="col-md-8">
                          <div className="card-body">
                            <h5 className="card-title fw-bold d-flex justify-content-between">
                              {barangs.nama}
                              <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                                Stok : {barangs.stok}
                              </span>
                            </h5>
                            <p className="card-text mb-1">
                              <em>{barangs.tag}</em>
                              <br />
                              {formatRupiah(barangs.harga)} /{" "}
                              <strong>{barangs.berat} gram</strong>
                            </p>
                            <hr />
                            <p className="card-text mb-1">
                              {barangs.deskripsi}
                            </p>
                            <div className="card-text p-2 border rounded mb-1">
                              {barangs.detail}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="alert alert-danger mb-0">
                    Loading ...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
