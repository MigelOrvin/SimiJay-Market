import { useEffect, useState } from "react";
import SidebarMenu from "../../components/SidebarMenu";
import Navbar from "../../components/Navbar";

export default function Dashboard() {
  const [user, setUser] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      setUser(JSON.parse(userData));
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
