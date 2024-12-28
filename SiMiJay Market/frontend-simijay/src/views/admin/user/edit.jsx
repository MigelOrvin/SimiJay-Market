import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";
import Navbar from "../../../components/Navbar";

export default function UserEdit() {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const { id } = useParams();

  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [foto, setFoto] = useState(null);

  const fetchDetailUser = async () => {
    await Api.get(`/api/admin/user/${id}`).then((response) => {
      setKode(response.data.kode);
      setNama(response.data.nama);
      setEmail(response.data.email);
      setPassword(response.data.password);
      setRole(response.data.role);
    });
  };

  useEffect(() => {
    fetchDetailUser();
  }, []);

  const updateUser = async (e) => {
    e.preventDefault();

    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const formData = new FormData();
    formData.append("kode", kode);
    formData.append("nama", nama);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    if (foto) {
      formData.append("foto", foto);
    }

    await Api.put(`/api/admin/user/${id}`, formData)
      .then(() => {
        navigate("/admin/user");
      })
      .catch((error) => {
        console.error("Gagal edit data user", error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="container mb-5 mt-5">
        <div className="row">
          <div className="col-md-3">
            <SidebarMenu />
          </div>
          <div className="col-md-9">
            <div className="card border-0 rounded shadow-sm">
              <div className="card-header fw-bold">Edit User</div>
              <div className="card-body">
                <form onSubmit={updateUser}>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Kode :</label>
                        <input
                          type="text"
                          value={kode || ""}
                          onChange={(e) => setKode(e.target.value)}
                          className="form-control"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Nama :</label>
                        <input
                          type="text"
                          value={nama || ""}
                          onChange={(e) => setNama(e.target.value)}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Role :</label>
                        <select
                          className="form-select"
                          value={role || ""}
                          onChange={(e) => setRole(e.target.value)}
                          disabled
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
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Email :</label>
                        <input
                          type="email"
                          value={email || ""}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Password :</label>
                        <input
                          type="password"
                          value={password || ""}
                          onChange={(e) => setPassword(e.target.value)}
                          className="form-control"
                          placeholder=""
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
    </>
  );
}
