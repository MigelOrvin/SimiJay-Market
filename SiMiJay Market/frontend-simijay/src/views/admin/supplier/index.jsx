import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";

export default function SupplierIndex() {
  const [supplier, setSupplier] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); // Add success message state
  const [isSidebarActive, setIsSidebarActive] = useState(false); // Add sidebar state

  const fetchDataSupplier = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await Api.get("/api/admin/supplier");

        setSupplier(response.data);
      } catch (error) {
        console.error("Terjadi error ketika fetching data supplier", error);
      }
    } else {
      console.error("Token invalid");
    }
  };

  useEffect(() => {
    fetchDataSupplier();
  }, []);

  const deleteSupplier = async (id) => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        await Api.delete(`/api/admin/supplier/${id}`);
        setSuccessMessage("Supplier berhasil dihapus"); // Set success message on delete
        fetchDataSupplier();
      } catch (error) {
        console.error("Gagal menghapus data supplier", error);
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
                  <span className="fw-bold">Supplier</span>
                  <Link
                    to="/admin/supplier/create"
                    className="btn btn-sm btn-success rounded shadow-sm border-0"
                  >
                    Tambah Supplier
                  </Link>
                </div>
                <div className="card-body">
                  {successMessage && (
                    <div className="alert alert-success">{successMessage}</div>
                  )} {/* Display success message */}
                  <table className="table table-bordered">
                    <thead className="bg-primary text-white">
                      <tr>
                        <th scope="col" className="text-center fw-semibold" style={{width: "5%"}}>No</th>
                        <th scope="col" className="fw-semibold">Nama Supplier</th>
                        <th scope="col" className="fw-semibold">Nama Barang</th>
                        <th scope="col" className="fw-semibold">Stok</th>
                        <th scope="col" className="fw-semibold">Harga</th>
                        <th scope="col" style={{ width: "17%" }} className="fw-semibold"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplier.length > 0 ? (
                        supplier.map((suppliers, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td>{suppliers.nama}</td>
                            <td>{suppliers.nama_barang}</td>
                            <td>{suppliers.stok} kg</td>
                            <td>Rp. {suppliers.harga}</td>
                            <td className="text-center">
                              <Link
                                to={`/admin/supplier/edit/${suppliers.id}`}
                                className="btn btn-sm btn-warning text-white rounded-sm border-0 me-2"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => deleteSupplier(suppliers.id)}
                                className="btn btn-sm btn-danger rounded-sm border-0"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
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
