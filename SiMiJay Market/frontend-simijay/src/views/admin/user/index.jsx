import { useEffect, useState } from "react";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu"; // Ensure this path is correct
import { Link } from "react-router-dom";

export default function UserIndex() {
  const [user, setUser] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); // Add success message state
  const [isSidebarActive, setIsSidebarActive] = useState(false); // Add sidebar state

  const fetchDataUser = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await Api.get("/api/admin/user");

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

  const deleteUser = async (id) => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        await Api.delete(`api/admin/user/${id}`);
        setSuccessMessage("User berhasil dihapus"); // Set success message on delete
        fetchDataUser();
      } catch (error) {
        console.error("Gagal menghapus data user");
      }
    } else {
      console.error("Token invalid");
    }
  };

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
                  <span className="fw-bold">User</span>
                  <Link
                    to="/admin/user/create"
                    className="btn btn-sm btn-success rounded shadow-sm border-0"
                  >
                    Tambah User
                  </Link>
                </div>
                <div className="card-body">
                  {successMessage && (
                    <div className="alert alert-success">{successMessage}</div>
                  )} {/* Display success message */}
                  <div
                    className="table-wrapper"
                    style={{
                      overflowX: "auto",
                      maxWidth: "100%",
                      paddingBottom: "10px",
                    }}
                  >
                    <table
                      className="table table-bordered"
                      style={{ minWidth: "900px" }}
                    >
                      <thead className="bg-primary text-white">
                        <tr>
                          <th
                            scope="col"
                            className="text-center fw-semibold"
                            style={{ width: "1%" }}
                          >
                            No
                          </th>
                          <th
                            scope="col"
                            style={{ width: "2%" }}
                            className="fw-semibold"
                          >
                            Kode
                          </th>
                          <th
                            scope="col"
                            style={{ width: "11%" }}
                            className="fw-semibold"
                          >
                            Nama User
                          </th>
                          <th
                            scope="col"
                            style={{ width: "13%" }}
                            className="fw-semibold"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            style={{ width: "5%" }}
                            className="text-center fw-semibold"
                          >
                            Role
                          </th>
                          <th
                            scope="col"
                            style={{ width: "6%" }}
                            className="text-center fw-semibold"
                          >
                            Foto
                          </th>
                          <th
                            scope="col"
                            style={{ width: "10%" }}
                            className="text-center fw-semibold"
                          ></th>
                        </tr>
                      </thead>
                      <tbody>
                        {user.length > 0 ? (
                          user.map((users, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>{users.kode}</td>
                              <td>{users.nama}</td>
                              <td>{users.email}</td>
                              <td className="text-center">
                                {users.role == "admin" ? (
                                  <div className="badge text-bg-success">
                                    Admin
                                  </div>
                                ) : users.role == "customer" ? (
                                  <div className="badge text-bg-danger">
                                    Customer
                                  </div>
                                ) : (
                                  <div className="badge text-bg-primary">
                                    Kasir
                                  </div>
                                )}
                              </td>
                              <td className="text-center">
                                <img
                                  src={
                                    users.foto
                                      ? `http://localhost:8000/${users.foto}`
                                      : "https://static.vecteezy.com/system/resources/previews/002/318/271/original/user-profile-icon-free-vector.jpg"
                                  }
                                  // alt="User Profile"
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                  }}
                                />
                              </td>
                              <td className="text-center">
                                <Link
                                  to={`/admin/user/edit/${users.id}`}
                                  className="btn btn-sm btn-warning text-white rounded-sm border-0 me-2"
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={() => deleteUser(users.id)}
                                  className="btn btn-sm btn-danger rounded-sm border-0"
                                >
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center">
                              <div className="alert alert-danger mb-0">
                                Data belum tersedia!
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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