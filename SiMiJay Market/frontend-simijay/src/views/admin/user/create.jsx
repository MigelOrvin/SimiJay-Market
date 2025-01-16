import { Link, useNavigate } from "react-router-dom";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../../styles/customAlert.css";

export default function UserCreate() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [foto, setFoto] = useState(null);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const MySwal = withReactContent(Swal);

  const storeUser = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("kode", kode);
    formData.append("nama", nama);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    if (foto) {
      formData.append("foto", foto);
    }

    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      await Api.post("/api/admin/user/store", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAlertMessage(`${nama} berhasil ditambahkan`);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        navigate("/admin/user");
      }, 1500);
    } catch (error) {
      console.error("Gagal menambahkan user", error);
    }
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
                <div className="card-header fw-bold">Tambah User</div>
                <div className="card-body">
                  <form onSubmit={storeUser}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="mb-1 fw-semibold">Nama :</label>
                          <input
                            type="text"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="mb-1 fw-semibold">Email :</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="mb-1 fw-semibold">Password :</label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="mb-1 fw-semibold">Role :</label>
                          <select
                            className="form-select"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                          >
                            <option value="" disabled>
                              Pilih Role...
                            </option>
                            <option value="admin">Admin</option>
                            <option value="customer">Customer</option>
                            <option value="kasir">Kasir</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group mb-3">
                          <label className="mb-1 fw-semibold">Foto :</label>
                          <input
                            type="file"
                            onChange={(e) => setFoto(e.target.files[0])}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-sm btn-primary">
                      Simpan
                    </button>
                    <Link
                      to="/admin/user"
                      className="mx-2 btn btn-sm btn-secondary"
                    >
                      Kembali
                    </Link>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAlert && (
        <div className="custom-alert">
          <div className="custom-alert-content">
            <span>{alertMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}
