import { useEffect, useState } from "react";
import Api from "../../../services/api";

import SidebarMenu from "../../../components/SidebarMenu";
import { useNavigate } from "react-router-dom";

function KeranjangIndex() {
  const [barang, setBarang] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isSidebarActive, setIsSidebarActive] = useState(false); // Add sidebar state
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
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    setQuantities(cart);
  }, []);

  const handleQuantityChange = (id, delta) => {
    setQuantities((prevQuantities) => {
      const newQuantities = {
        ...prevQuantities,
        [id]: (prevQuantities[id] || 0) + delta,
      };
      localStorage.setItem("cart", JSON.stringify(newQuantities));
      return newQuantities;
    });
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token invalid");
      return;
    }

    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      const userResponse = await Api.get("/api/user");
      const userId = userResponse.data.id;

      const items = Object.keys(quantities).map((id) => ({
        barang_id: id,
        jumlah: quantities[id],
      }));

      await Api.post("/api/customer/transaksi", {
        user_id: userId,
        items,
      });
      localStorage.removeItem("cart");
      navigate("/customer/transaksi");
    } catch (error) {
      console.error("Gagal melakukan transaksi:", error.response ? error.response.data : error.message);
    }
  };

  const totalHarga = barang.reduce((total, item) => {
    const quantity = quantities[item.id] || 0;
    return total + item.harga * quantity;
  }, 0);

  const handleToggleSidebar = (isActive) => {
    setIsSidebarActive(isActive);
  };

  return (
    <>
      <SidebarMenu onToggleSidebar={handleToggleSidebar} />
      <div className={`home_content ${isSidebarActive ? "active" : ""}`}>
        <div className="container mt-5 mb-5">
          <div className="row">
            <div className="col-md-12">
              <div className="card border-0 rounded shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Keranjang</span>
                </div>
                <div className="card-body">
                  {Object.keys(quantities).length > 0 ? (
                    <div className="row g-3">
                      {barang.map((item) => {
                        const quantity = quantities[item.id] || 0;
                        if (quantity > 0) {
                          return (
                            <div className="col-md-12" key={item.id}>
                              <div className="d-flex justify-content-between align-items-center">
                                <span>{item.nama}</span>
                                <span>{quantity}</span>
                                <span>Rp. {item.harga * quantity}</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                      <div className="col-md-12 mt-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold">Total Harga</span>
                          <span className="fw-bold">Rp. {totalHarga}</span>
                        </div>
                      </div>
                      <div className="col-md-12 mt-3 text-end">
                        <button className="btn btn-primary" onClick={handleCheckout}>
                          Beli
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="alert alert-danger text-center">
                      Keranjang kosong!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default KeranjangIndex;