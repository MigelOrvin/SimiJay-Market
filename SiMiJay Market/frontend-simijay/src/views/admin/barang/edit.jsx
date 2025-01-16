import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu"; // Ensure this path is correct

export default function EditBarang() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams();

  const [barang, setBarang] = useState({
    kode: "",
    nama: "",
    id_kategori: "",
    id_supplier: "",
    harga: "",
    stok: "",
    tag: "",
    berat: "",
    deskripsi: "",
    detail: "",
    gambar: null,
  });

  const [kategori, setKategori] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [isSidebarActive, setIsSidebarActive] = useState(false); // Add sidebar state

  const handleToggleSidebar = (isActive) => {
    setIsSidebarActive(isActive);
  };

  const fetchDetailBarang = async () => {
    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await Api.get(`/api/admin/barang/${id}`);
      setBarang(response.data.data.barang);
      setKategori(response.data.data.kategori || []);
      setSupplier(response.data.data.supplier || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDetailBarang();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "gambar" && files.length > 0) {
      setBarang({ ...barang, gambar: files[0] });
    } else {
      setBarang({ ...barang, [name]: value });
    }
  };

  const updateBarang = async (e) => {
    e.preventDefault();
    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const formData = new FormData();
    for (const key in barang) {
      formData.append(key, barang[key]);
    }
    try {
      await Api.put(`/api/admin/barang/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/admin/barang");
    } catch (error) {
      console.error("Gagal edit data barang", error);
    }
  };

  return (
    <>
      <SidebarMenu onToggleSidebar={handleToggleSidebar} />
      <div className={`home_content ${isSidebarActive ? "active" : ""}`}>
        <div className="container mb-5 mt-5">
          <div className="row">
            <div className="col-md-12">
              <div className="card border-0 rounded shadow-sm">
                <div className="card-header fw-bold">Edit Barang</div>
                <div className="card-body">
                  <form onSubmit={updateBarang}>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group mb-3">
                          <label className="mb-1 fw-semibold">Kode :</label>
                          <input
                            type="text"
                            name="kode"
                            value={barang.kode}
                            onChange={handleChange}
                            className="form-control"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="mb-1 fw-semibold">
                            Nama Barang :
                          </label>
                          <input
                            type="text"
                            name="nama"
                            value={barang.nama}
                            onChange={handleChange}
                            className="form-control"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="mb-1 fw-semibold">Kategori :</label>
                          <select
                            name="id_kategori"
                            value={barang.id_kategori}
                            onChange={handleChange}
                            className="form-select"
                          >
                            {kategori.map((k) => (
                              <option key={k.id} value={k.id}>
                                {k.nama}
                              </option>
                            ))}
                            disabled
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="mb-1 fw-semibold">Supplier :</label>
                          <select
                            name="id_supplier"
                            value={barang.id_supplier}
                            onChange={handleChange}
                            className="form-select"
                            disabled
                          >
                            {supplier.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.nama}
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
                            name="harga"
                            value={barang.harga}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="mb-1 fw-semibold">Stok :</label>
                          <input
                            type="text"
                            name="stok"
                            value={barang.stok}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="mb-1 fw-semibold">Tag :</label>
                          <select
                            name="tag"
                            value={barang.tag} 
                            onChange={handleChange} 
                            className="form-control"
                          >
                            <option value="" disabled>
                              Select Tag
                            </option>
                            <option value="Expensive">Expensive</option>
                            <option value="Cheap">Cheap</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="mb-1 fw-semibold">Berat :</label>
                          <input
                            type="text"
                            name="berat"
                            value={barang.berat}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="mb-1 fw-semibold">
                            Deskripsi Barang :
                          </label>
                          <input
                            type="text"
                            name="deskripsi"
                            value={barang.deskripsi}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="mb-1 fw-semibold">
                            Detail Barang :
                          </label>
                          <input
                            type="text"
                            name="detail"
                            value={barang.detail}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="mb-1 fw-semibold">Gambar :</label>
                          <input
                            type="file"
                            name="gambar"
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <button type="submit" className="btn btn-sm btn-primary">
                          Update
                        </button>
                        <Link
                          to="/admin/barang"
                          className="mx-2 btn btn-sm btn-secondary"
                        >
                          Kembali
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
