import { useEffect, useState } from "react";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../../styles/customAlert.css";

export default function KategoriIndex() {
  const [kategori, setKategori] = useState([]);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const MySwal = withReactContent(Swal);

  const fetchDataKategori = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await Api.get("/api/admin/kategori");
        setKategori(response.data);
      } catch (error) {
        console.error("Terjadi error ketika fetching data kategori", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error("Token invalid");
    }
  };

  useEffect(() => {
    fetchDataKategori();
  }, []);

  const deleteKategori = async (id) => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const kategoriToDelete = kategori.find((kategoris) => kategoris.id === id);
        await Api.delete(`api/admin/kategori/${id}`);
        setAlertMessage(`${kategoriToDelete.nama} berhasil dihapus`);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          fetchDataKategori();
        }, 1500);
      } catch (error) {
        console.error("Gagal menghapus data kategori", error);
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
        <div className="container mb-5 mt-5">
          <div className="row">
            <div className="col-md-7">
              <div className="card border-0 rounded shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Kategori</span>
                  <Link
                    to="/admin/kategori/create"
                    className="btn btn-sm btn-success rounded shadow-sm border-0"
                  >
                    Tambah Kategori
                  </Link>
                </div>
                <div className="card-body">
                  {isLoading ? (
                    <div className="text-center">
                      <div className="spinner-border" style={{ color: "#89CFF0" }} role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <div className="mt-2">Loading</div>
                    </div>
                  ) : (
                    <table className="table table-bordered" style={{ maxWidth: "500px" }}>
                      <thead className="bg-primary text-white">
                        <tr>
                          <th
                            scope="col"
                            className="text-center fw-semibold"
                            style={{width: "1%"}}
                          >
                            No
                          </th>
                          <th scope="col" className="fw-semibold" style={{width: "7%"}}>Nama Kategori</th>
                          <th style={{width: "10%"}} className="text-center fw-semibold"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {kategori.length > 0 ? (
                          kategori.map((kategoris, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>{kategoris.nama}</td>
                              <td className="text-center">
                                <Link
                                  to={`/admin/kategori/edit/${kategoris.id}`}
                                  className="btn btn-sm btn-warning text-white rounded-sm border-0 me-2"
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={() => deleteKategori(kategoris.id)}
                                  className="btn btn-sm btn-danger rounded-sm border-0"
                                >
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="text-center">
                              <div className="alert alert-danger mb-0">
                                Kategori belum tersedia!
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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
