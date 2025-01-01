import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../../../services/api";
import Navbar from "../../../components/Navbar";
import SidebarMenu from "../../../components/SidebarMenu";

export default function SupplierIndex() {
  
  const [supplier, setSupplier] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

        fetchDataSupplier();
      } catch (error) {
        console.error("Gagal menghapus data supplier", error);
      }
    } else {
      console.error("Token invalid");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSupplier = supplier.filter((suppliers) =>
    suppliers.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col-md-3">
            <SidebarMenu />
          </div>
          <div className="col-md-9">
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
                    style={{ width: "150px" }}
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
                    {filteredSupplier.length > 0 ? (
                      filteredSupplier.map((suppliers, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td>{suppliers.nama}</td>
                          <td>{suppliers.nama_barang}</td>
                          <td>{suppliers.stok}</td>
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
    </>
  );
}
