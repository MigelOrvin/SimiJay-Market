import { useEffect, useState } from "react";
import Api from "../../services/api";
import SidebarMenu from "../../components/SidebarMenu";

export default function Dashboard() {
  const [user, setUser] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); 
  const [isSidebarActive, setIsSidebarActive] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      setUser(JSON.parse(userData));
      setSuccessMessage("Berhasil Login"); 
    }
    setIsLoading(false);
  }, []);

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
              <div className="card border-0 rounded shadow-sm mb-4">
                <div className="card-header">Dashboard</div>
                <div className="card-body">
                  {isLoading ? (
                    <div className="text-center">
                      <div className="spinner-border" style={{ color: "#89CFF0" }} role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <div className="mt-2">Loading</div>
                    </div>
                  ) : (
                    <>
                      {successMessage && (
                        <div className="alert alert-success">{successMessage}</div>
                      )}
                      <h5>Selamat datang, <strong>{user?.nama}</strong></h5>
                      <p>Anda login sebagai <strong>{user?.role}</strong></p>
                    </>
                  )}
                </div>
              </div>
              {user.role === "customer" && (
                <div className="card border-0 rounded shadow-sm mb-4">
                  <div className="card-body">
                    <h5 className="card-title">Selamat datang di SiMiJay Market</h5>
                    <p>Anda dapat melihat dan membeli barang yang tersedia.</p>
                  </div>
                </div>
              )}
              {user.role === "kasir" && (
                <div className="card border-0 rounded shadow-sm mb-4">
                  <div className="card-body">
                    <h5 className="card-title">Selamat datang di SiMiJay Market</h5>
                    <p>Anda dapat mengelola transaksi penjualan di sini.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
