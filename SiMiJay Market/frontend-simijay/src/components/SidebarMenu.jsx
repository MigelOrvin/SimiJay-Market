import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SidebarMenu() {

  const [user, setUser] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="card border-0 rounded shadow-sm">
      <div className="card-header fw-bold">Navigasi</div>
      <div className="card-body">
        {user.role === "admin" && (
          <div className="list-group">
            <Link
              to="/admin/dashboard"
              className="list-group-item list-group-item-action"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/kategori"
              className="list-group-item list-group-item-action"
            >
              Kategori
            </Link>
            <Link
              to="/admin/supplier"
              className="list-group-item list-group-item-action"
            >
              Supplier
            </Link>
            <Link
              to="/admin/barang"
              className="list-group-item list-group-item-action"
            >
              Barang
            </Link>
            <Link
              to="/admin/user"
              className="list-group-item list-group-item-action"
            >
              User
            </Link>
          </div>
        )}
        {user.role === "customer" && (
          <div className="list-group">
            <Link
              to="/customer/dashboard"
              className="list-group-item list-group-item-action"
            >
              Dashboard
            </Link>
            <Link
              to="/customer/user"
              className="list-group-item list-group-item-action"
            >
              Profile
            </Link>
            <Link
              to="/customer/barang"
              className="list-group-item list-group-item-action"
            >
              Barang
            </Link>
            <Link
              to="/customer/keranjang"
              className="list-group-item list-group-item-action"
            >
              Keranjang
            </Link>
            <Link
              to="/customer/transaksi"
              className="list-group-item list-group-item-action"
            >
              Transaksi
            </Link>
          </div>
        )}
        {user.role === "kasir" && (
          <div className="list-group">
            <Link
              to="/kasir/dashboard"
              className="list-group-item list-group-item-action"
            >
              Dashboard
            </Link>
            <Link
              to="/kasir/barang"
              className="list-group-item list-group-item-action"
            >
              Barang
            </Link>
            <Link
              to="/kasir/keranjang"
              className="list-group-item list-group-item-action"
            >
              Keranjang
            </Link>
            <Link
              to="/kasir/transaksi"
              className="list-group-item list-group-item-action"
            >
              Transaksi
            </Link>
            <Link
              to="/kasir/laporan"
              className="list-group-item list-group-item-action"
            >
              Laporan Penjualan
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
