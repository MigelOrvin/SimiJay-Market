import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";

export default function KategoriCreate() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Add success message state
  const [isSidebarActive, setIsSidebarActive] = useState(false); // Add sidebar state

  const storeKategori = async (e) => {
    e.preventDefault();

    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    await Api.post("/api/admin/kategori/store", {
      nama: nama,
    })
      .then(() => {
        setSuccessMessage("Kategori berhasil ditambahkan"); // Set success message on create
        navigate("/admin/kategori");
      })
      .catch((error) => {
        console.error("Gagal menambahkan kategori", error);
      });
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
            <div className="col-md-12">
              <div className="card border-0 rounded shadow-sm">
                <div className="card-header fw-bold">Tambah Kategori</div>
                <div className="card-body">
                  {successMessage && (
                    <div className="alert alert-success">{successMessage}</div>
                  )} {/* Display success message */}
                  <form onSubmit={storeKategori}>
                    <div className="form-group mb-3">
                      <label className="mb-1 fw-semibold">Nama Kategori</label>
                      <input
                        type="text"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <button type="submit" className="btn btn-sm btn-primary">
                      Simpan
                    </button>
                    <Link to="/admin/kategori" className="mx-2 btn btn-sm btn-secondary">
                      Kembali
                    </Link>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
