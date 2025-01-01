import { useEffect, useState } from "react";
import Api from "../../../services/api";
import Navbar from "../../../components/Navbar";
import SidebarMenu from "../../../components/SidebarMenu";

export default function BarangIndex() {
  const [barang, setBarang] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);
  const [warning, setWarning] = useState({});

  const fetchDataBarang = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await Api.get("/api/admin/barang");
        setBarang(response.data.data.barang);
      } catch (error) {
        console.error(
          "Terjadi error ketika fetching data barang:",
          error.response ? error.response.data : error.message
        );
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
          [id]: `Mohon maaf stok tersisa ${barang.find((item) => item.id === id).stok}`,
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

  const handleAddToCart = (id, event) => {
    event.stopPropagation();
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    cart[id] = (cart[id] || 0) + (quantities[id] || 0);
    localStorage.setItem("cart", JSON.stringify(cart));
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: 0,
    }));
    alert("Item added to cart");
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
                <span className="fw-bold">Barang</span>
                {expandedCard && (
                  <button
                    className="btn btn-secondary"
                    onClick={handleBackClick}
                  >
                    Back
                  </button>
                )}
              </div>
              <div className="card-body">
                {barang.length > 0 ? (
                  <div className="row g-3">
                    {barang.map((barangs, index) =>
                      expandedCard === null || expandedCard === barangs.id ? (
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
                              cursor: barangs.stok > 0 ? "pointer" : "not-allowed",
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
                                  backgroundColor: "rgba(255, 255, 255, 0.8)",
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
                                        ? "100%"
                                        : "200px",
                                    overflow: "hidden",
                                    filter: barangs.stok === 0 ? "grayscale(100%)" : "none",
                                  }}
                                >
                                  <img
                                    src={
                                      barangs.gambar
                                        ? `http://localhost:8000/${barangs.gambar}`
                                        : "https://img.qraved.co/v2/image/data/2016/09/22/Ayam_Betutu_Khas_Bali_2_1474542488119-x.jpg"
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
                                      {formatRupiah(barangs.harga) + " / "}
                                      <strong>{barangs.berat + " gram"}</strong>
                                    </p>
                                    <hr />
                                    <p className="card-text mb-1">
                                      {barangs.deskripsi}
                                    </p>
                                    <div className="card-text p-2 border rounded mb-1">
                                      {barangs.detail}
                                    </div>
                                    <br />
                                    <p className="card-text mb-1">
                                      <strong>Stok :</strong> {barangs.stok}
                                    </p>
                                    <div className="d-flex align-items-center">
                                      <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={(event) =>
                                          handleQuantityChange(barangs.id, -1, event)
                                        }
                                        disabled={quantities[barangs.id] <= 0}
                                      >
                                        -
                                      </button>
                                      <span className="mx-2">
                                        {quantities[barangs.id] || 0}
                                      </span>
                                      <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={(event) =>
                                          handleQuantityChange(barangs.id, 1, event)
                                        }
                                      >
                                        +
                                      </button>
                                      <button
                                        className="btn btn-primary btn-sm ms-auto"
                                        onClick={(event) =>
                                          handleAddToCart(barangs.id, event)
                                        }
                                        disabled={quantities[barangs.id] <= 0}
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
                    )}
                  </div>
                ) : (
                  <div className="alert alert-danger text-center">
                    Data belum tersedia!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
