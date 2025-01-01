import { useEffect, useState } from "react";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";
import { Link } from "react-router-dom";

export default function UserIndex() {
  const [user, setUser] = useState(null);
  const [isSidebarActive, setIsSidebarActive] = useState(false); // Add sidebar state

  const fetchDataUser = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await Api.get("/api/user");
        console.log(response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Terjadi error ketika fetching data user", error);
      }
    } else {
      console.error("Token invalid");
    }
  };

  useEffect(() => {
    fetchDataUser();
  }, []);

  const handleToggleSidebar = (isActive) => {
    setIsSidebarActive(isActive);
  };

  return (
    <>
      <SidebarMenu onToggleSidebar={handleToggleSidebar} />
      <div className={`home_content ${isSidebarActive ? "active" : ""}`}>
        <div className="container mt-5 mb-5">
          <div className="row">
            <div className="col-md-12">
              <div className="card border-0 rounded shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Profile</span>
                  {user && (
                    <Link
                      to={`/customer/user/edit/${user.id}`}
                      className="btn btn-sm btn-warning text-white rounded-sm border-0 me-2"
                    >
                      Edit
                    </Link>
                  )}
                </div>
                <div className="card-body">
                  {user ? (
                    <div className="row">
                      <div className="col-md-8">
                        <form>
                          <div className="mb-3">
                            <label htmlFor="nama" className="form-label">
                              Nama User
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="nama"
                              value={user.nama}
                              readOnly
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                              Email
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              value={user.email}
                              readOnly
                            />
                          </div>
                        </form>
                      </div>
                      <div className="col-md-4 text-center">
                        <img
                          src={
                            user.foto ||
                            "https://static.vecteezy.com/system/resources/previews/002/318/271/original/user-profile-icon-free-vector.jpg"
                          }
                          alt="User Profile"
                          className="img-fluid rounded-circle"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="alert alert-danger text-center">
                      Data belum tersedia!
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
