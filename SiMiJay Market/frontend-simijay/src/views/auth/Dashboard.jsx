import { useEffect, useState } from "react";
import SidebarMenu from "../../components/SidebarMenu";
import Navbar from "../../components/Navbar";

export default function Dashboard() {
  const [user, setUser] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); // Add success message state

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      setUser(JSON.parse(userData));
      setSuccessMessage("Berhasil Login"); // Set success message on login
    }
  }, []);

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
              <div className="card-header">Dashboard</div>
              <div className="card-body">
                {successMessage && <div className="alert alert-success">{successMessage}</div>} {/* Display success message */}
                Selamat datang <strong>{user?.nama}</strong>, Anda login sebagai{" "}
                <strong>{user?.role}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
