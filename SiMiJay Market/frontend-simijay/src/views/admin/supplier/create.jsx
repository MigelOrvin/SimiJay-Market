import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../../services/api";
import Navbar from "../../../components/Navbar";
import SidebarMenu from "../../../components/SidebarMenu";

export default function SupplierCreate() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [namaBarang, setNamaBarang] = useState("");
  const [stok, setStok] = useState("");
  const [harga, setHarga] = useState("");

  const storeSupplier = async (e) => {
    e.preventDefault();

    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await Api.post("/api/admin/supplier/store", {
      nama: nama,
      nama_barang: namaBarang,
      stok: stok,
      harga: harga,
    })
      .then(() => {
        navigate("/admin/supplier");
      })
      .catch((error) => {
        console.error("Gagal menambahkan supplier", error);
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
              <div className="card-header fw-bold">Tambah Supplier</div>
              <div className="card-body">
                <form onSubmit={storeSupplier}>
                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold">Nama Supplier</label>
                    <input
                      type="text"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold">Nama Barang</label>
                    <input
                      type="text"
                      value={namaBarang}
                      onChange={(e) => setNamaBarang(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold">Stok</label>
                    <input
                      type="number"
                      value={stok}
                      onChange={(e) => setStok(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold">Harga</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={harga}
                      onChange={(e) => setHarga(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <button type="submit" className="btn btn-sm btn-primary">
                    Simpan
                  </button>
                  <Link
                    to="/admin/supplier"
                    className="mx-2 btn btn-sm btn-secondary"
                  >
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
