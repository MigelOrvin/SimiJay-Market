import { useEffect, useState } from "react";
import Api from "../../services/api";
import SidebarMenu from "../../components/SidebarMenu";

export default function Dashboard() {
  const [user, setUser] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); 
  const [isSidebarActive, setIsSidebarActive] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);
  const [totalBarang, setTotalBarang] = useState(0);
  const [totalKategori, setTotalKategori] = useState(0);
  const [totalSupplier, setTotalSupplier] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      setUser(JSON.parse(userData));
      setSuccessMessage("Berhasil Login"); 
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const [barangRes, kategoriRes, supplierRes, activitiesRes, notificationsRes] = await Promise.all([
          Api.get("/api/admin/barang"),
          Api.get("/api/admin/kategori"),
          Api.get("/api/admin/supplier"),
          Api.get("/api/admin/activities"),
          Api.get("/api/admin/notifications")
        ]);

        setTotalBarang(barangRes.data.data.barang.length);
        setTotalKategori(kategoriRes.data.length);
        setTotalSupplier(supplierRes.data.length);
        setRecentActivities(activitiesRes.data.data.activities);
        setNotifications(notificationsRes.data.data.notifications);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
              {user.role === "admin" && (
                <>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="card border-0 rounded shadow-sm mb-4">
                        <div className="card-body text-center">
                          <h5 className="card-title">Total Barang</h5>
                          <p className="card-text display-4">{totalBarang}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card border-0 rounded shadow-sm mb-4">
                        <div className="card-body text-center">
                          <h5 className="card-title">Total Kategori</h5>
                          <p className="card-text display-4">{totalKategori}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card border-0 rounded shadow-sm mb-4">
                        <div className="card-body text-center">
                          <h5 className="card-title">Total Supplier</h5>
                          <p className="card-text display-4">{totalSupplier}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card border-0 rounded shadow-sm mb-4">
                        <div className="card-body">
                          <h5 className="card-title">Aktivitas Terbaru</h5>
                          <ul className="list-group list-group-flush">
                            {recentActivities.map((activity, index) => (
                              <li key={index} className="list-group-item">{activity}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card border-0 rounded shadow-sm mb-4">
                        <div className="card-body">
                          <h5 className="card-title">Notifikasi</h5>
                          <ul className="list-group list-group-flush">
                            {notifications.map((notification, index) => (
                              <li key={index} className="list-group-item">{notification}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
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
