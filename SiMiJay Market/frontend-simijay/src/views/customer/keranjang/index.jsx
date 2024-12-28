import { useEffect, useState } from "react";
import Api from "../../../services/api";
import Navbar from "../../../components/Navbar";
import SidebarMenu from "../../../components/SidebarMenu";
import { useNavigate } from "react-router-dom";

function KeranjangIndex() {
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

    const handleCheckout = () => {
        // Logic to handle checkout
        console.log("Checkout with items:", quantities);
        navigate("/views/customer/transaksi/index.jsx");
    };

    const totalHarga = barang.reduce((total, item) => {
        const quantity = quantities[item.id] || 0;
        return total + item.harga * quantity;
    }, 0);

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
        </>
    );
}

export default KeranjangIndex;