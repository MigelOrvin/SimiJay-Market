import { useEffect, useState } from "react";
import Api from "../../../services/api";
import Navbar from "../../../components/Navbar";
import SidebarMenu from "../../../components/SidebarMenu";
import { useNavigate } from "react-router-dom";

export default function BarangIndex() {
  const [barang, setBarang] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);
  const navigate = useNavigate();

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

  const handleQuantityChange = (id, delta) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: (prevQuantities[id] || 0) + delta,
    }));
  };

  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
    navigate("/customer/keranjang");
  };

  const handleCardClick = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
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
                            }`}
                            onClick={() => handleCardClick(barangs.id)}
                            style={{ cursor: "pointer" }}
                          >
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
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleQuantityChange(barangs.id, -1);
                                        }}
                                        disabled={quantities[barangs.id] <= 0}
                                      >
                                        -
                                      </button>
                                      <span className="mx-2">
                                        {quantities[barangs.id] || 0}
                                      </span>
                                      <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleQuantityChange(barangs.id, 1);
                                        }}
                                      >
                                        +
                                      </button>
                                      <button
                                        className="btn btn-primary btn-sm ms-auto"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAddToCart(barangs);
                                        }}
                                      >
                                        Add to Cart
                                      </button>
                                    </div>
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
