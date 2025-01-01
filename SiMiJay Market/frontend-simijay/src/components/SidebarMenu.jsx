import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./SidebarMenu.css"; // Use the custom styles
import { IonIcon } from "@ionic/react";
import { speedometerOutline, listOutline, peopleOutline, cubeOutline, personOutline, cartOutline, swapHorizontalOutline, documentTextOutline, logOutOutline, menuOutline, cashOutline } from "ionicons/icons";

export default function SidebarMenu({ onToggleSidebar }) {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsAuthenticated(false);

    navigate("/", { replace: true });
  };

  const toggleSidebar = () => {
    setIsActive(!isActive);
    onToggleSidebar(!isActive); // Notify parent component about the sidebar state
  };

  return (
    <>
      <div className={`sidebar ${isActive ? "active" : ""}`}>
        <div className="logo_content">
          <div className="logo">
            <div className="logo_name">SiMiJay Market</div>
          </div>
          <i className="bx bx-menu" id="btn" onClick={toggleSidebar}>
            <IonIcon icon={menuOutline} />
          </i>
        </div>
        <ul>
          {user.role === "admin" && (
            <>
              <li>
                <Link to="/admin/dashboard">
                  <i className="bx bx-grid-alt">
                    <IonIcon icon={speedometerOutline} />
                  </i>
                  <span className="links_name">Dashboard</span>
                </Link>
                <span className="tooltip">Dashboard</span>
              </li>
              <li>
                <Link to="/admin/kategori">
                  <i className="bx bx-list-ul">
                    <IonIcon icon={listOutline} />
                  </i>
                  <span className="links_name">Kategori</span>
                </Link>
                <span className="tooltip">Kategori</span>
              </li>
              <li>
                <Link to="/admin/labarugi">
                  <i className="bx bx-list-ul">
                    <IonIcon icon={cashOutline} />
                  </i>
                  <span className="links_name">Laba Rugi</span>
                </Link>
                <span className="tooltip">Laba Rugi</span>
              </li>
              <li>
                <Link to="/admin/supplier">
                  <i className="bx bx-user">
                    <IonIcon icon={peopleOutline} />
                  </i>
                  <span className="links_name">Supplier</span>
                </Link>
                <span className="tooltip">Supplier</span>
              </li>
              <li>
                <Link to="/admin/barang">
                  <i className="bx bx-box">
                    <IonIcon icon={cubeOutline} />
                  </i>
                  <span className="links_name">Barang</span>
                </Link>
                <span className="tooltip">Barang</span>
              </li>
              <li>
                <Link to="/admin/user">
                  <i className="bx bx-user">
                    <IonIcon icon={personOutline} />
                  </i>
                  <span className="links_name">User</span>
                </Link>
                <span className="tooltip">User</span>
              </li>
            </>
          )}
          {user.role === "customer" && (
            <>
              <li>
                <Link to="/customer/dashboard">
                  <i className="bx bx-grid-alt">
                    <IonIcon icon={speedometerOutline} />
                  </i>
                  <span className="links_name">Dashboard</span>
                </Link>
                <span className="tooltip">Dashboard</span>
              </li>
              <li>
                <Link to="/customer/user">
                  <i className="bx bx-user">
                    <IonIcon icon={personOutline} />
                  </i>
                  <span className="links_name">Profile</span>
                </Link>
                <span className="tooltip">Profile</span>
              </li>
              <li>
                <Link to="/customer/barang">
                  <i className="bx bx-box">
                    <IonIcon icon={cubeOutline} />
                  </i>
                  <span className="links_name">Barang</span>
                </Link>
                <span className="tooltip">Barang</span>
              </li>
              <li>
                <Link to="/customer/keranjang">
                  <i className="bx bx-cart">
                    <IonIcon icon={cartOutline} />
                  </i>
                  <span className="links_name">Keranjang</span>
                </Link>
                <span className="tooltip">Keranjang</span>
              </li>
              <li>
                <Link to="/customer/transaksi">
                  <i className="bx bx-transfer">
                    <IonIcon icon={swapHorizontalOutline} />
                  </i>
                  <span className="links_name">Transaksi</span>
                </Link>
                <span className="tooltip">Transaksi</span>
              </li>
            </>
          )}
          {user.role === "kasir" && (
            <>
              <li>
                <Link to="/kasir/dashboard">
                  <i className="bx bx-grid-alt">
                    <IonIcon icon={speedometerOutline} />
                  </i>
                  <span className="links_name">Dashboard</span>
                </Link>
                <span className="tooltip">Dashboard</span>
              </li>
              <li>
                <Link to="/kasir/barang">
                  <i className="bx bx-box">
                    <IonIcon icon={cubeOutline} />
                  </i>
                  <span className="links_name">Barang</span>
                </Link>
                <span className="tooltip">Barang</span>
              </li>
              <li>
                <Link to="/kasir/keranjang">
                  <i className="bx bx-cart">
                    <IonIcon icon={cartOutline} />
                  </i>
                  <span className="links_name">Keranjang</span>
                </Link>
                <span className="tooltip">Keranjang</span>
              </li>
              <li>
                <Link to="/kasir/transaksi">
                  <i className="bx bx-transfer">
                    <IonIcon icon={swapHorizontalOutline} />
                  </i>
                  <span className="links_name">Transaksi</span>
                </Link>
                <span className="tooltip">Transaksi</span>
              </li>
              <li>
                <Link to="/kasir/laporan">
                  <i className="bx bx-file">
                    <IonIcon icon={documentTextOutline} />
                  </i>
                  <span className="links_name">Laporan Penjualan</span>
                </Link>
                <span className="tooltip">Laporan Penjualan</span>
              </li>
            </>
          )}
          <li>
            <a onClick={logout} style={{ cursor: "pointer" }} className="logout">
              <i className="bx bx-log-out">
                <IonIcon icon={logOutOutline} />
              </i>
              <span className="links_name">Logout</span>
            </a>
            <span className="tooltip">Logout</span>
          </li>
        </ul>
      </div>
    </>
  );
}
