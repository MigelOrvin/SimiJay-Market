import { useEffect, useState } from "react";
import Api from "../../../services/api";
import Navbar from "../../../components/Navbar";
import SidebarMenu from "../../../components/SidebarMenu";
import { useNavigate } from "react-router-dom";

export default function BarangIndex() {
  const [barang, setBarang] = useState([]);
  const [quantities, setQuantities] = useState({});
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
    // Logic to add product to cart
    console.log("Adding to cart:", product);
    navigate("/views/customer/keranjang/index.jsx");
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
              </div>
              <div className="card-body">
                {barang.length > 0 ? (
                  <div className="row g-3">
                    {barang.map((barangs, index) => (
                      <div className="col-md-4" key={index}>
                        <div className="card h-100 shadow-sm border-0">
                          <div className="card-body">
                            <h5 className="card-title fw-bold">{barangs.nama}</h5>
                            <p className="card-text mb-1">
                              <strong>Kode:</strong> {barangs.kode}
                            </p>
                            <p className="card-text mb-1">
                              <strong>Harga:</strong> Rp. {barangs.harga}
                            </p>
                            <p className="card-text mb-1">
                              <strong>Stok:</strong> {barangs.stok}
                            </p>
                            <p className="card-text mb-1">
                              <strong>Tag:</strong> {barangs.tag}
                            </p>
                            <p className="card-text mb-1">
                              <strong>Berat:</strong> {barangs.berat} gram
                            </p>
                            <p className="card-text">
                              <strong>Deskripsi:</strong> {barangs.deskripsi}
                            </p>
                            <p className="card-text">
                              <strong>Detail:</strong> {barangs.detail}
                            </p>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => handleQuantityChange(barangs.id, -1)}
                                disabled={(quantities[barangs.id] || 0) <= 0}
                              >
                                -
                              </button>
                              <span>{quantities[barangs.id] || 0}</span>
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => handleQuantityChange(barangs.id, 1)}
                              >
                                +
                              </button>
                              <button
                                className="btn btn-primary"
                                onClick={() => handleAddToCart(barangs)}
                              >
                                <i className="bi bi-cart"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
