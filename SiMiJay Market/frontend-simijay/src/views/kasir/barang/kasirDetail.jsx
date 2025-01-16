import { useEffect, useState } from "react";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";
import { Link, useParams } from "react-router-dom";

export default function BarangIndex() {
  const [barang, setBarang] = useState([]);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error("Token invalid");
    }
  };

  useEffect(() => {
    fetchDataBarang();
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBarang = barang.filter((barangs) =>
    barangs.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <SidebarMenu onToggleSidebar={handleToggleSidebar} />
      <div
        className={`home_content ${isSidebarActive ? "active" : ""}`}
        style={{ marginLeft: isSidebarActive ? "250px" : "0" }}
      >
        <div className="container mt-5 mb-5">
          <div className="row">
            <div className="col-md-12">
              <div className="card border-0 rounded shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3 p-3">
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
                      to={`/kasir/barang`}
                      className="btn btn-sm btn-info text-white rounded-sm border-0"
                    >
                      Kembali
                    </Link>
                  </div>
                </div>
                <div className="card border-0 rounded shadow-sm">
                  <div className="card-body">
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
                    ) : filteredBarang.length > 0 ? (
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
                                  <span
                                    className="text-muted"
                                    style={{ fontSize: "0.8rem" }}
                                  >
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
                                  <ul>
                                    {barangs.detail
                                      .split(",")
                                      .map((item, index) => (
                                        <li key={index}>{item.trim()}</li>
                                      ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="alert alert-danger mb-0">
                        {searchTerm
                          ? `"${searchTerm}" tidak ditemukan`
                          : "Barang belum tersedia!"}
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
