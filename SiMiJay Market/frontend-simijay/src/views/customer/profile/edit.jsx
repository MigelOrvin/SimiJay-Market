import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";

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
  const [isSidebarActive, setIsSidebarActive] = useState(false); 

  const fetchDetailUser = async () => {
    if (!token) {
      console.error("No token found");
      return;
    }
    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await Api.get(`/api/admin/user/${id}`).then((response) => {
      setKode(response.data.kode);
      setNama(response.data.nama);
      setEmail(response.data.email);
      setPassword(response.data.password);
      setRole(response.data.role);
      setFoto(response.data.foto);
    }).catch((error) => {
      console.error("Failed to fetch user details", error);
    });
  };

  useEffect(() => {
    fetchDetailUser();
  }, []);

  const updateUser = async (e) => {
    e.preventDefault();

    console.log({ nama, email, password, foto });
    
    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("email", email);
    if (password) {
      formData.append("password", password);
    }
    if (foto) {
      formData.append("foto", foto);
    }
  
    try {
      const response = await Api.put(`/api/admin/user/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data); 
      navigate("/customer/user");
    } catch (error) {
      console.error("Gagal edit data user", error.response ? error.response.data : error.message);
    }
  };

  const handleFotoChange = (e) => {
    setFoto(e.target.files[0]);
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
                  <form onSubmit={updateUser}>
                    <div className="row">
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
                        <div className="form-group mb-3">
                          <label className="mb-1 fw-semibold">Email :</label>
                          <input
                            type="email"
                            value={email || ""}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                          />
                        </div>
                        <div className="form-group mb-3">
                          <label className="mb-1 fw-semibold">Password :</label>
                          <input
                            type="password"
                            value={password || ""}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            placeholder="password otomatis akan terganti"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="mb-1 fw-semibold">Foto :</label>
                          <input
                            type="file"
                            onChange={handleFotoChange}
                            className="form-control"
                          />
                          {foto && (
                            <img
                              src={URL.createObjectURL(foto)}
                              alt="User Foto"
                              className="img-thumbnail mt-3"
                              style={{ width: "100%", height: "auto" }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-sm btn-primary">
                      Simpan
                    </button>
                    <Link to="/customer/user" className="mx-2 btn btn-sm btn-secondary">
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
