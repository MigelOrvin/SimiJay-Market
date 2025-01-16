import { Link, useNavigate } from "react-router-dom";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../../styles/customAlert.css";

export default function BarangCreate() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [barang, setBarang] = useState([]);
  const [filteredSupplier, setFilteredSupplier] = useState([]);
  const [selectKategori, setSelectKategori] = useState("");
  const [selectSupplier, setSelectSupplier] = useState("");
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
  const [tag, setTag] = useState("");
  const [berat, setBerat] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [detail, setDetail] = useState("");
  const [gambar, setGambar] = useState(null);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [stokWarning, setStokWarning] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const MySwal = withReactContent(Swal);

  const handleToggleSidebar = (isActive) => {
    setIsSidebarActive(isActive);
  };

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

  const fetchDataBarang = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await Api.get("/api/admin/barang");
        setBarang(response.data.data.barang);
      } catch (error) {
        console.error("Terjadi error ketika fetching data barang", error);
      }
    } else {
      console.error("Token invalid");
    }
  };

  useEffect(() => {
    fetchDataKategori();
    fetchDataBarang();
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

  const handleNamaChange = (e) => {
    const value = e.target.value;
    setNama(value);
    setFilteredSupplier(
      supplier.filter(
        (s) => s.nama_barang.toLowerCase() === value.toLowerCase()
      )
    );
  };

  const handleStokChange = (e) => {
    const value = e.target.value;
    setStok(value);
    const selectedSupplierData = supplier.find(
      (s) => s.id === parseInt(selectSupplier)
    );
    if (selectedSupplierData && value > selectedSupplierData.stok) {
      setStokWarning(`Stok yang tersedia ${selectedSupplierData.stok}`);
    } else {
      setStokWarning("");
    }
  };

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
        setAlertMessage(`${nama} berhasil ditambahkan`);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          navigate("/admin/barang", "/customer/barang");
        }, 1500);
      })
      .catch((error) => {
        console.error("Gagal menambahkan barang", error);
      });
  };

  const availableProducts = supplier.filter(
    (s) =>
      !barang.some((b) => b.nama.toLowerCase() === s.nama_barang.toLowerCase())
  );

  return (
    <>
      <SidebarMenu onToggleSidebar={handleToggleSidebar} />
      <div className={`home_content ${isSidebarActive ? "active" : ""}`}>
        <div className="container mb-5 mt-5">
          <div className="row">
            <div className="col-md-12">
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
                          <select
                            className="form-select"
                            value={nama}
                            onChange={handleNamaChange}
                            required
                          >
                            <option value="" disabled>
                              Pilih Nama Barang
                            </option>
                            {availableProducts.map((suppliers) => (
                              <option
                                key={suppliers.id}
                                value={suppliers.nama_barang}
                              >
                                {suppliers.nama_barang}
                              </option>
                            ))}
                          </select>
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
                            {filteredSupplier.map((suppliers) => (
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
                            onChange={handleStokChange}
                            className="form-control"
                            required
                          />
                          {stokWarning && (
                            <p className="text-danger mt-2">{stokWarning}</p>
                          )}
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
                          <label className="mb-1 fw-semibold">
                            Deskripsi :
                          </label>
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
