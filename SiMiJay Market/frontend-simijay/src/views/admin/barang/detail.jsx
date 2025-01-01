import { useEffect, useState } from "react";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu"; // Ensure this path is correct
import { Link, useParams } from "react-router-dom";

export default function BarangDetail() {
  const { id } = useParams();

  const [barang, setBarang] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [isSidebarActive, setIsSidebarActive] = useState(false); // Add sidebar state

  const fetchDetailBarang = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await Api.get(`/api/admin/barang/${id}`);

        setBarang(response.data.data.barang);
        setKategori(response.data.data.kategori);
        setSupplier(response.data.data.supplier);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchDetailBarang();
  }, [id]);

  const getKategoriName = (id_kategori) => {
    const kat = kategori.find((k) => k.id === id_kategori);
    return kat ? kat.nama : "Null";
  };

  const getSupplierName = (id_supplier) => {
    const sup = supplier.find((s) => s.id === id_supplier);
    return sup ? sup.nama : "Null";
  };

  const handleToggleSidebar = (isActive) => {
    setIsSidebarActive(isActive);
  };

  return (
    <>
      <SidebarMenu onToggleSidebar={handleToggleSidebar} />
      <div className={`home_content ${isSidebarActive ? "active" : ""}`}>
        <div className="container mb-5 mt-5">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <div className="card border-0 rounded shadow-sm">
                <div className="card-header fw-bold">Detail Barang</div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 d-flex align-items-center justify-content-center">
                      <img
                        src={barang.gambar}
                        alt="Barang"
                        className="img-fluid rounded-circle"
                        style={{
                          width: "200px",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Kode :</label>
                        <input
                          type="text"
                          value={barang.kode}
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Nama Barang :</label>
                        <input
                          type="text"
                          value={barang.nama}
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Kategori :</label>
                        <input
                          type="text"
                          value={getKategoriName(barang.id_kategori)}
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Supplier :</label>
                        <input
                          type="text"
                          value={getSupplierName(barang.id_supplier)}
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Harga :</label>
                        <input
                          type="text"
                          value={barang.harga}
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Stok :</label>
                        <input
                          type="text"
                          value={barang.stok}
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Tag :</label>
                        <input
                          type="text"
                          value={barang.tag}
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Berat :</label>
                        <input
                          type="text"
                          value={barang.berat}
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">
                          Deskripsi Barang :
                        </label>
                        <input
                          type="text"
                          value={barang.deskripsi}
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">
                          Detail Barang :
                        </label>
                        <input
                          type="text"
                          value={barang.detail}
                          className="form-control"
                          disabled
                        />
                      </div>
                      <div className="col-md-12">
                        <Link
                          to="/admin/barang"
                          className="btn btn-sm btn-secondary"
                        >
                          Kembali
                        </Link>
                      </div>
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
}
