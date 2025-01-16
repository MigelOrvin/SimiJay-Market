import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";

export default function UserEdit() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [foto, setFoto] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); 
  const [isSidebarActive, setIsSidebarActive] = useState(false); 

  const fetchDetailUser = async () => {
    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await Api.get(`/api/admin/user/${id}`);
      const user = response.data;
      setNama(user.nama || "");
      setEmail(user.email || "");
    } catch (error) {
      console.error("Gagal mengambil data user", error);
    }
  };

  useEffect(() => {
    fetchDetailUser();
  }, [id, token]);

  const updateUser = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("email", email);
    if (password) {
      formData.append("password", password);
    }
    if (foto) {
      formData.append("foto", foto);
    }

    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      await Api.put(`/api/admin/user/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccessMessage("User berhasil diupdate"); // Set success message on update
      navigate("/admin/user");
    } catch (error) {
      console.error("Gagal edit data user", error);
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
                <div className="card-header fw-bold">Edit User</div>
                <div className="card-body">
                  {successMessage && (
                    <div className="alert alert-success">{successMessage}</div>
                  )} {/* Display success message */}
                  <form onSubmit={updateUser}>
                    <div className="row">
                      <div className="col-md-12">
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
                      <div className="col-md-12">
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
                      <div className="col-md-12">
                        <div className="form-group mb-3">
                          <label className="mb-1 fw-semibold">Password :</label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                          />
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
                    <Link to="/admin/user" className="mx-2 btn btn-sm btn-secondary">
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