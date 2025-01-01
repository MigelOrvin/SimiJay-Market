import { Link, useNavigate } from "react-router-dom";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";
import Navbar from "../../../components/Navbar";
import { useEffect, useState } from "react";

export default function BarangCreate() {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [selectKategori, setSelectKategori] = useState("");
  const [selectSupplier, setSelectSupplier] = useState("");
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
  const [tag, setTag] = useState("");
  const [berat, setBerat] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [detail, setDetail] = useState("");
  const [gambar, setGambar] = useState(null);

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

  const storeBarang = async (e) => {
    e.preventDefault();

    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const formData = new FormData();
    formData.append("kode", kode);
    formData.append("nama", nama);
    formData.append("id_kategori", selectKategori);
    formData.append("id_supplier", selectSupplier);
    formData.append("harga", harga);
    formData.append("stok", stok);
    formData.append("tag", tag);
    formData.append("berat", berat);
    formData.append("deskripsi", deskripsi);
    formData.append("detail", detail);
    formData.append("gambar", gambar);

    await Api.post("/api/admin/barang/store", formData)
      .then(() => {
        navigate("/admin/barang", "/customer/barang");
      })
      .catch((error) => {
        console.error("Gagal menambahkan barang", error);
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
              <div className="card-header fw-bold">Tambah Barang</div>
              <div className="card-body">
                <form onSubmit={storeBarang}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">
                          Nama Barang :
                        </label>
                        <input
                          type="text"
                          value={nama}
                          onChange={(e) => setNama(e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Kategori :</label>
                        <select
                          className="form-select"
                          value={selectKategori}
                          onChange={(e) => setSelectKategori(e.target.value)}
                          required
                        >
                          <option value="" disabled>
                            Pilih Kategori
                          </option>
                          {kategori.map((kategoris) => (
                            <option key={kategoris.id} value={kategoris.id}>
                              {kategoris.nama}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Supplier :</label>
                        <select
                          className="form-select"
                          value={selectSupplier}
                          onChange={(e) => setSelectSupplier(e.target.value)}
                          required
                        >
                          <option value="" disabled>
                            Pilih Suplier
                          </option>
                          {supplier.map((suppliers) => (
                            <option key={suppliers.id} value={suppliers.id}>
                              {suppliers.nama}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Harga :</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={harga}
                          onChange={(e) => setHarga(e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Stok :</label>
                        <input
                          type="number"
                          value={stok}
                          onChange={(e) => setStok(e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Tag :</label>
                        <select
                          className="form-select"
                          value={tag}
                          onChange={(e) => setTag(e.target.value)}
                          required
                        >
                          <option value="" disabled>
                            Pilih Tag
                          </option>
                          <option value="expensive">Expensive</option>
                          <option value="cheap">Cheap</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Berat :</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={berat}
                          onChange={(e) => setBerat(e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Deskripsi :</label>
                        <input
                          type="text"
                          value={deskripsi}
                          onChange={(e) => setDeskripsi(e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Detail :</label>
                        <input
                          type="text"
                          value={detail}
                          onChange={(e) => setDetail(e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="mb-1 fw-semibold">Gambar :</label>
                        <input
                          type="file"
                          onChange={(e) => setGambar(e.target.files[0])}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-sm btn-primary">
                    Simpan
                  </button>
                  <Link
                    to="/admin/barang"
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
