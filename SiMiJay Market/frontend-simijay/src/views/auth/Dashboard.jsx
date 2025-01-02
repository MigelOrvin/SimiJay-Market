import { useEffect, useState } from "react";
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
              <div className="card border-0 rounded shadow-sm">
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
                      Selamat datang <strong>{user?.nama}</strong>, Anda login sebagai{" "}
                      <strong>{user?.role}</strong>
                    </>
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
