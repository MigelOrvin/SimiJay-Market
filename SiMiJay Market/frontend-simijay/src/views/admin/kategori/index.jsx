import { useEffect, useState } from "react";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";
import { Link } from "react-router-dom";

export default function KategoriIndex() {
  const [kategori, setKategori] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); // Add success message state
  const [isSidebarActive, setIsSidebarActive] = useState(false); // Add sidebar state

  const fetchDataKategori = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await Api.get("/api/admin/kategori");

        setKategori(response.data);
      } catch (error) {
        console.error("Terjadi error ketika fetching data kategori", error);
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
        await Api.delete(`api/admin/kategori/${id}`);
        setSuccessMessage("Kategori berhasil dihapus"); // Set success message on delete
        fetchDataKategori();
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
        <div className="container mt-5 mb-5">
          <div className="row">
            <div className="col-md-12">
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
                  {successMessage && (
                    <div className="alert alert-success">{successMessage}</div>
                  )} {/* Display success message */}
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
                          <td colSpan="4" className="text-center">
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
    </>
  );
}
