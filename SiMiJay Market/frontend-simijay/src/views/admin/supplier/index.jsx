import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../../styles/customAlert.css";

export default function SupplierIndex() {
  const [supplier, setSupplier] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const MySwal = withReactContent(Swal);

  const fetchDataSupplier = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await Api.get("/api/admin/supplier");
        setSupplier(response.data);
      } catch (error) {
        console.error("Terjadi error ketika fetching data supplier", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error("Token invalid");
    }
  };

  useEffect(() => {
    fetchDataSupplier();
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const deleteSupplier = async (id) => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const supplierToDelete = supplier.find((suppliers) => suppliers.id === id);
        await Api.delete(`/api/admin/supplier/${id}`);
        setAlertMessage(`${supplierToDelete.nama} berhasil dihapus`);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          fetchDataSupplier();
        }, 1500);
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSupplier = supplier.filter((suppliers) =>
    suppliers.nama.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <span className="fw-bold">Supplier</span>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control form-control-sm me-2"
                      placeholder="Cari Nama Supplier"
                      value={searchTerm}
                      onChange={handleSearch}
                      style={{ width: "160px" }}
                    />
                    <Link
                      to="/admin/supplier/create"
                      className="btn btn-sm btn-success rounded shadow-sm border-0"
                    >
                      Tambah Supplier
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  {successMessage && (
                    <div className="alert alert-success">{successMessage}</div>
                  )}
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
                    <table className="table table-bordered">
                      <thead className="bg-primary text-white">
                        <tr>
                          <th
                            scope="col"
                            className="text-center fw-semibold"
                            style={{ width: "5%" }}
                          >
                            No
                          </th>
                          <th scope="col" className="fw-semibold">
                            Nama Supplier
                          </th>
                          <th scope="col" className="fw-semibold">
                            Nama Barang
                          </th>
                          <th scope="col" className="fw-semibold">
                            Stok
                          </th>
                          <th scope="col" className="fw-semibold">
                            Harga
                          </th>
                          <th
                            scope="col"
                            style={{ width: "17%" }}
                            className="fw-semibold"
                          ></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSupplier.length > 0 ? (
                          filteredSupplier.map((suppliers, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>{suppliers.nama}</td>
                              <td>{suppliers.nama_barang}</td>
                              <td>{suppliers.stok}</td>
                              <td>{formatRupiah(suppliers.harga)}</td>
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
                                {searchTerm
                                  ? `"${searchTerm}" tidak ditemukan`
                                  : "Supplier belum tersedia!"}
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
