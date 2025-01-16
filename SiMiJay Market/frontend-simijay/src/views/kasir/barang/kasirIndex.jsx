import { useEffect, useState } from "react";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../../styles/customAlert.css";
import { Link, useParams } from "react-router-dom";

export default function BarangIndex() {
  const [barang, setBarang] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [warning, setWarning] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const fetchDataBarang = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await Api.get("/api/admin/barang");
        setBarang(response.data.data.barang);
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

  const handleQuantityChange = (id, delta, event) => {
    event.stopPropagation();
    setQuantities((prevQuantities) => {
      const newQuantity = (prevQuantities[id] || 0) + delta;
      if (newQuantity > barang.find((item) => item.id === id).stok) {
        setWarning((prevWarning) => ({
          ...prevWarning,
          [id]: `Mohon maaf stok tersisa ${
            barang.find((item) => item.id === id).stok
          }`,
        }));
        setTimeout(() => {
          setWarning((prevWarning) => ({
            ...prevWarning,
            [id]: null,
          }));
        }, 1000);
        return prevQuantities;
      }
      if (newQuantity < 0) {
        return prevQuantities;
      }
      return {
        ...prevQuantities,
        [id]: newQuantity,
      };
    });
  };

  const MySwal = withReactContent(Swal);

  const handleAddToCart = (id, event) => {
    event.stopPropagation();
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    cart[id] = (cart[id] || 0) + (quantities[id] || 0);
    localStorage.setItem("cart", JSON.stringify(cart));
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: 0,
    }));
    const itemName = barang.find((item) => item.id === id).nama;
    setAlertMessage(`${itemName} berhasil masuk keranjang`);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };

  const handleCardClick = (id) => {
    if (barang.find((item) => item.id === id).stok > 0) {
      setExpandedCard(expandedCard === id ? null : id);
    }
  };

  const handleBackClick = () => {
    setExpandedCard(null);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const handleToggleSidebar = (isActive) => {
    setIsSidebarActive(isActive);
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

  const uniqueTags = [...new Set(barang.map((barangs) => barangs.tag))];

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
                  {expandedCard ? (
                    <button
                      className="btn btn-secondary"
                      onClick={handleBackClick}
                    >
                      Back
                    </button>
                  ) : (
                    <div className="d-flex">
                      <input
                        type="text"
                        className="form-control form-control-sm me-2"
                        placeholder="Cari Nama Produk"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: "150px" }}
                      />
                      <select
                        className="form-select form-select-sm me-2"
                        value={selectedTag}
                        onChange={handleTagChange}
                        style={{ width: "150px" }}
                      >
                        <option value="">Semua Tag</option>
                        {uniqueTags.map((tag, index) => (
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
                        to="/kasir/barang/detail"
                        className="btn btn-sm btn-info text-white rounded-sm border-0"
                      >
                        Detail
                      </Link>
                    </div>
                  )}
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
                  ) : barang.length > 0 ? (
                    <div className="row g-3">
                      {filteredBarang.length > 0 ? (
                        filteredBarang.map((barangs, index) =>
                          expandedCard === null ||
                          expandedCard === barangs.id ? (
                            <div
                              className={`col-md-${
                                expandedCard === barangs.id ? "12" : "4"
                              }`}
                              key={index}
                            >
                              <div
                                className={`card h-100 shadow-sm border-0 ${
                                  expandedCard === barangs.id ? "expanded" : ""
                                } ${barangs.stok === 0 ? "text-muted" : ""}`}
                                onClick={() => handleCardClick(barangs.id)}
                                style={{
                                  cursor:
                                    barangs.stok > 0
                                      ? "pointer"
                                      : "not-allowed",
                                  position: "relative",
                                }}
                              >
                                {barangs.stok === 0 && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      transform: "translate(-50%, -50%)",
                                      backgroundColor:
                                        "rgba(255, 255, 255, 0.8)",
                                      padding: "10px",
                                      borderRadius: "5px",
                                      zIndex: 1,
                                    }}
                                  >
                                    <strong>Produk Habis</strong>
                                  </div>
                                )}
                                <div className="row g-0">
                                  <div
                                    className={`col-md-${
                                      expandedCard === barangs.id ? "6" : "12"
                                    }`}
                                  >
                                    <div
                                      className="card-img-top"
                                      style={{
                                        height:
                                          expandedCard === barangs.id
                                            ? "400px"
                                            : "200px",
                                        overflow: "hidden",
                                        filter:
                                          barangs.stok === 0
                                            ? "grayscale(100%)"
                                            : "none",
                                      }}
                                    >
                                      <img
                                        src={
                                          barangs.gambar
                                            ? `http://localhost:8000/${barangs.gambar}`
                                            : "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg"
                                        }
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                        }}
                                        alt={barangs.nama}
                                      />
                                    </div>
                                  </div>
                                  {expandedCard === barangs.id && (
                                    <div className="col-md-6">
                                      <div className="card-body">
                                        <h5 className="card-title fw-bold">
                                          {barangs.nama}
                                        </h5>
                                        <p className="card-text mb-1">
                                          <em>{barangs.tag}</em>
                                          <br />
                                          {formatRupiah(barangs.harga)}
                                          <sub>
                                            {" "}
                                            /{" "}
                                            <strong>
                                              {barangs.berat + " gram"}
                                            </strong>
                                          </sub>
                                        </p>
                                        <hr />
                                        <p className="card-text mb-1">
                                          {barangs.deskripsi}
                                        </p>
                                        <div className="card-text p-2 border rounded mb-1">
                                          <ul>
                                            {barangs.detail
                                              .split(",")
                                              .map((item, index) => (
                                                <li key={index}>
                                                  {item.trim()}
                                                </li>
                                              ))}
                                          </ul>
                                        </div>
                                        <br />
                                        <p className="card-text mb-1">
                                          <strong>Stok :</strong> {barangs.stok}
                                        </p>
                                        <div className="d-flex align-items-center">
                                          <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={(event) =>
                                              handleQuantityChange(
                                                barangs.id,
                                                -1,
                                                event
                                              )
                                            }
                                            disabled={
                                              quantities[barangs.id] <= 0
                                            }
                                          >
                                            -
                                          </button>
                                          <span className="mx-2">
                                            {quantities[barangs.id] || 0}
                                          </span>
                                          <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={(event) =>
                                              handleQuantityChange(
                                                barangs.id,
                                                1,
                                                event
                                              )
                                            }
                                          >
                                            +
                                          </button>
                                          <button
                                            className="btn btn-primary btn-sm ms-auto"
                                            onClick={(event) =>
                                              handleAddToCart(barangs.id, event)
                                            }
                                            disabled={
                                              quantities[barangs.id] <= 0
                                            }
                                          >
                                            Add to Cart
                                          </button>
                                        </div>
                                        {warning[barangs.id] && (
                                          <p className="text-danger mt-2">
                                            {warning[barangs.id]}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  {!expandedCard && (
                                    <div className="card-body">
                                      <h5 className="card-title fw-bold">
                                        {barangs.nama}
                                      </h5>
                                      <p className="card-text mb-1">
                                        {formatRupiah(barangs.harga)}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : null
                        )
                      ) : (
                        <div className="alert alert-danger text-center">
                          {searchTerm
                            ? `"${searchTerm}" tidak ditemukan`
                            : "Barang belum tersedia!"}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="alert alert-danger text-center">
                      Barang belum tersedia!
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
