import { useEffect, useState } from "react";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../../styles/customAlert.css";

export default function UserIndex() {
  const [user, setUser] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const MySwal = withReactContent(Swal);

  const fetchDataUser = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await Api.get("/api/admin/user");
        setUser(response.data);
      } catch (error) {
        console.error("Terjadi error ketika fetching data user", error);
      } finally {
        setIsLoading(false);
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
        const userToDelete = user.find((users) => users.id === id);
        await Api.delete(`api/admin/user/${id}`);
        setAlertMessage(`${userToDelete.nama} berhasil dihapus`);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          fetchDataUser();
        }, 1500);
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUser = user.filter((users) =>
    users.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control form-control-sm me-2"
                      placeholder="Cari Nama User"
                      value={searchTerm}
                      onChange={handleSearch}
                      style={{ width: "150px" }}
                    />
                    <Link
                      to="/admin/user/create"
                      className="btn btn-sm btn-success rounded shadow-sm border-0"
                    >
                      Tambah User
                    </Link>
                  </div>
                </div>
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
                  ) : (
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
                          {filteredUser.length > 0 ? (
                            filteredUser.map((users, index) => (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td>{users.kode}</td>
                                <td>{users.nama}</td>
                                <td>{users.email}</td>
                                <td className="text-center">
                                  {users.role === "admin" ? (
                                    <div className="badge text-bg-success">
                                      Admin
                                    </div>
                                  ) : users.role === "customer" ? (
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
                                  {searchTerm
                                    ? `"${searchTerm}" tidak ditemukan`
                                    : "User belum tersedia!"}
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
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
