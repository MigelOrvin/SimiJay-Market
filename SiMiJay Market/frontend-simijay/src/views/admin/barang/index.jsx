import { useEffect, useState } from "react";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../../styles/customAlert.css";

export default function BarangIndex() {
  const [barang, setBarang] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const MySwal = withReactContent(Swal);

  const handleToggleSidebar = (isActive) => {
    setIsSidebarActive(isActive);
  };

  const fetchDataBarang = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await Api.get("/api/admin/barang");
        setBarang(response.data.data.barang);
        setTags([
          ...new Set(response.data.data.barang.map((item) => item.tag)),
        ]);
        setCategories(response.data.data.kategori);
      } catch (error) {
        console.error(
          "Terjadi error ketika fetching data barang:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error("Token invalid");
    }
  };

  useEffect(() => {
    fetchDataBarang();
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const formatBerat = (berat) => {
    if (berat >= 1000) {
      const beratInKg = (berat / 1000).toFixed(2);
      return `${parseFloat(beratInKg) === parseInt(beratInKg) ? parseInt(beratInKg) : beratInKg} kg`;
    }
    return `${berat} gram`;
  };  
  
  const deleteBarang = async (id) => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const barangToDelete = barang.find((barangs) => barangs.id === id);
        await Api.delete(`/api/admin/barang/${id}`);
        setAlertMessage(`${barangToDelete.nama} berhasil dihapus`);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        fetchDataBarang();
      }, 1500);
      } catch (error) {
        console.error("Gagal menghapus data barang", error);
      }
    } else {
      console.error("Token invalid");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredBarang = barang
    .filter((barangs) =>
      barangs.nama.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((barangs) => (selectedTag ? barangs.tag === selectedTag : true))
    .filter((barangs) =>
      selectedCategory
        ? barangs.id_kategori === parseInt(selectedCategory)
        : true
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
                  <span className="fw-bold">Barang</span>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control form-control-sm me-2"
                      style={{ width: "200px" }}
                      placeholder="Cari Nama Produk"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                    <select
                      className="form-select form-select-sm me-2"
                      value={selectedTag}
                      onChange={handleTagChange}
                      style={{ width: "150px" }}
                    >
                      <option value="">Semua Tag</option>
                      {tags.map((tag, index) => (
                        <option key={index} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                    <select
                      className="form-select form-select-sm me-2"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      style={{ width: "200px" }}
                    >
                      <option value="">Semua Kategori</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.nama}
                        </option>
                      ))}
                    </select>
                    <Link
                      to="/admin/barang/create"
                      className="btn btn-sm btn-success rounded shadow-sm border-0 me-2"
                    >
                      Tambah Barang
                    </Link>
                    <Link
                      to="/admin/barang/detail"
                      className="btn btn-sm btn-info text-white rounded-sm border-0"
                    >
                      Detail
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
                        style={{ minWidth: "1500px" }}
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
                              className="fw-semibold"
                              style={{ width: "2%" }}
                            >
                              Kode
                            </th>
                            <th
                              scope="col"
                              className="fw-semibold"
                              style={{ width: "8%" }}
                            >
                              Nama
                            </th>
                            <th
                              scope="col"
                              className="fw-semibold"
                              style={{ width: "7%" }}
                            >
                              Harga
                            </th>
                            <th
                              scope="col"
                              className="fw-semibold"
                              style={{ width: "2%" }}
                            >
                              Stok
                            </th>
                            <th
                              scope="col"
                              className="fw-semibold"
                              style={{ width: "4%" }}
                            >
                              Tag
                            </th>
                            <th
                              scope="col"
                              className="fw-semibold"
                              style={{ width: "6%" }}
                            >
                              Berat
                            </th>
                            <th
                              scope="col"
                              className="fw-semibold"
                              style={{ width: "20%" }}
                            >
                              Deskripsi
                            </th>
                            <th
                              scope="col"
                              className="fw-semibold"
                              style={{ width: "10%" }}
                            >
                              Detail
                            </th>
                            <th
                              scope="col"
                              className="fw-semibold"
                              style={{ width: "10%" }}
                            >
                              Gambar
                            </th>
                            <th
                              scope="col"
                              className="fw-semibold text-center"
                              style={{ width: "10%" }}
                            ></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredBarang.length > 0 ? (
                            filteredBarang.map((barangs, index) => (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td>{barangs.kode}</td>
                                <td>{barangs.nama}</td>
                                <td>{formatRupiah(barangs.harga)}</td>
                                <td>{barangs.stok}</td>
                                <td>{barangs.tag}</td>
                                <td>{formatBerat(barangs.berat)}</td>
                                <td>{barangs.deskripsi}</td>
                                <td>{barangs.detail}</td>
                                <td>
                                  <img
                                    src={
                                      barangs.gambar
                                        ? `http://localhost:8000/${barangs.gambar}`
                                        : "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg"
                                    }
                                    style={{ width: "100px", height: "auto" }}
                                  />
                                </td>
                                <td className="text-center">
                                  <Link
                                    to={`/admin/barang/edit/${barangs.id}`}
                                    className="btn btn-sm btn-warning text-white rounded-sm border-0 me-2"
                                  >
                                    Edit
                                  </Link>
                                  <button
                                    onClick={() => deleteBarang(barangs.id)}
                                    className="btn btn-sm btn-danger rounded-sm border-0"
                                  >
                                    Hapus
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="11" className="text-center">
                                <div className="alert alert-danger mb-0">
                                  {searchTerm
                                    ? `"${searchTerm}" tidak ditemukan`
                                    : "Barang belum tersedia!"}
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
