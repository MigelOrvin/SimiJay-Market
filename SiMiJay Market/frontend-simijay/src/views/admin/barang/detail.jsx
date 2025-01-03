import { useEffect, useState } from "react";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu"; 
import { Link, useParams } from "react-router-dom";

export default function BarangDetail() {
  const { id } = useParams();
  const [barang, setBarang] = useState(null);
  const [isSidebarActive, setIsSidebarActive] = useState(false); 

  const fetchBarangDetail = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await Api.get(`/api/admin/barang/${id}`);
        setBarang(response.data.data.barang);
      } catch (error) {
        console.error(
          "Terjadi error ketika fetching detail barang:",
          error.response ? error.response.data : error.message
        );
      }
    } else {
      console.error("Token invalid");
    }
  };

  useEffect(() => {
    fetchBarangDetail();
  }, [id]);

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
      <div className={`home_content ${isSidebarActive ? "active" : ""}`} style={{ marginLeft: isSidebarActive ? "250px" : "0" }}>
        <div className="container mt-5 mb-5">
          <div className="row">
            <div className="col-md-12">
              <div className="card border-0 rounded shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3 p-3">
                  <h4 className="fw-bold">DETAIL BARANG</h4>
                  <Link
                    to={`/admin/barang`}
                    className="btn btn-sm btn-info text-white rounded-sm border-0"
                  >
                    Kembali
                  </Link>
                </div>
                <div className="card-body">
                  {barang ? (
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img
                          src={
                            barang.gambar
                              ? `http://localhost:8000/${barang.gambar}`
                              : "https://img.qraved.co/v2/image/data/2016/09/22/Ayam_Betutu_Khas_Bali_2_1474542488119-x.jpg"
                          }
                          className="img-fluid rounded-start h-100"
                          alt={barang.nama}
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <h5 className="card-title fw-bold d-flex justify-content-between">
                            {barang.nama}
                            <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                              Stok : {barang.stok}
                            </span>
                          </h5>
                          <p className="card-text mb-1">
                            <em>{barang.tag}</em>
                            <br />
                            {formatRupiah(barang.harga)} /{" "}
                            <strong>{barang.berat} gram</strong>
                          </p>
                          <hr />
                          <p className="card-text mb-1">
                            {barang.deskripsi}
                          </p>
                          <div className="card-text p-2 border rounded mb-1">
                            {barang.detail}
                          </div>
                        </div>
                      </div>
                    </div>
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
      </div>
    </>
  );
}
