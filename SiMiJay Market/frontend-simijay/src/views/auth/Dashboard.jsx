import { useEffect, useState } from "react";
import SidebarMenu from "../../components/SidebarMenu";

export default function Dashboard() {
  const [user, setUser] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); // Add success message state
  const [isSidebarActive, setIsSidebarActive] = useState(false); // Add sidebar state

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      setUser(JSON.parse(userData));
      setSuccessMessage("Berhasil Login"); // Set success message on login
    }
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
                  {successMessage && (
                    <div className="alert alert-success">{successMessage}</div>
                  )} {/* Display success message */}
                  Selamat datang <strong>{user?.nama}</strong>, Anda login sebagai{" "}
                  <strong>{user?.role}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
