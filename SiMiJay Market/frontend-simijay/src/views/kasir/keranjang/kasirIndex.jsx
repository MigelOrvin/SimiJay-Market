import { useEffect, useState } from "react";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";
import { useNavigate } from "react-router-dom";

function KeranjangIndex() {
  const [barang, setBarang] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [warnings, setWarnings] = useState({});
  const [isSidebarActive, setIsSidebarActive] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);
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
      } finally {
        setIsLoading(false);
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

  useEffect(() => {
    checkStockWarnings(quantities);
  }, [barang, quantities]);

  const handleToggleSidebar = (isActive) => {
    setIsSidebarActive(isActive);
  };

  const checkStockWarnings = (cart) => {
    const newWarnings = {};
    for (const id in cart) {
      const item = barang.find((item) => item.id === parseInt(id));
      if (item && cart[id] > item.stok) {
        newWarnings[id] = `${item.nama} tersisa ${item.stok}`;
      }
    }
    setWarnings(newWarnings);
  };

  const handleQuantityChange = (id, delta) => {
    setQuantities((prevQuantities) => {
      const newQuantities = {
        ...prevQuantities,
        [id]: (prevQuantities[id] || 0) + delta,
      };
      const item = barang.find((item) => item.id === id);
      if (newQuantities[id] > item.stok) {
        setWarnings((prevWarnings) => ({
          ...prevWarnings,
          [id]: `${item.nama} tersisa ${item.stok}`,
        }));
      } else {
        setWarnings((prevWarnings) => ({
          ...prevWarnings,
          [id]: null,
        }));
      }
      localStorage.setItem("cart", JSON.stringify(newQuantities));
      return newQuantities;
    });
  };

  const handleDeleteItem = (id) => {
    setQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      delete newQuantities[id];
      localStorage.setItem("cart", JSON.stringify(newQuantities));
      return newQuantities;
    });
    setWarnings((prevWarnings) => {
      const newWarnings = { ...prevWarnings };
      delete newWarnings[id];
      return newWarnings;
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

      const items = Object.keys(quantities)
        .filter((id) => quantities[id] > 0)
        .map((id) => ({
          barang_id: id,
          jumlah: quantities[id],
        }));

      await Api.post("/api/kasir/transaksi", {
        user_id: userId,
        items,
      });
      localStorage.removeItem("cart");
      navigate("/kasir/transaksi");
    } catch (error) {
      console.error("Gagal melakukan transaksi:", error.response ? error.response.data : error.message);
    }
  };

  const totalHarga = barang.reduce((total, item) => {
    const quantity = quantities[item.id] || 0;
    return total + item.harga * quantity;
  }, 0);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
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
                {isLoading ? (
                    <div className="text-center">
                      <div className="spinner-border" style={{ color: "#89CFF0" }} role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <div className="mt-2">Loading</div>
                    </div>
                  ) : Object.keys(quantities).length > 0 ? (
                    <div className="row g-3">
                      {barang.map((item) => {
                        const quantity = quantities[item.id] || 0;
                        if (quantity > 0) {
                          return (
                            <div className="col-md-12" key={item.id}>
                              <div className="row align-items-center">
                                <div className="col-md-3">
                                  <span>{item.nama}</span>
                                </div>
                                <div className="col-md-3">
                                  <div className="d-flex align-items-center">
                                    <button
                                      className="btn btn-outline-secondary btn-sm"
                                      onClick={() =>
                                        handleQuantityChange(item.id, -1)
                                      }
                                      disabled={quantity <= 0}
                                    >
                                      -
                                    </button>
                                    <span className="mx-2">{quantity}</span>
                                    <button
                                      className="btn btn-outline-secondary btn-sm"
                                      onClick={() =>
                                        handleQuantityChange(item.id, 1)
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <span>{formatRupiah(item.harga * quantity)}</span>
                                </div>
                                <div className="col-md-3">
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteItem(item.id)}
                                  >
                                    Hapus
                                  </button>
                                </div>
                              </div>
                              {warnings[item.id] && (
                                <p className="text-danger mt-2">
                                  {warnings[item.id]}
                                </p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      })}
                      <div className="col-md-12 mt-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold">Total Harga</span>
                          <span className="fw-bold">
                            {formatRupiah(totalHarga)}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-12 mt-3 text-end">
                        <button
                          className="btn btn-primary"
                          onClick={handleCheckout}
                        >
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