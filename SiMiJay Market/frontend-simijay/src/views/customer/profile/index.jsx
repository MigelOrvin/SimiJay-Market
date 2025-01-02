import { useEffect, useState } from "react";
import Api from "../../../services/api";
import SidebarMenu from "../../../components/SidebarMenu";
import { Link } from "react-router-dom";

export default function UserIndex() {
  const [user, setUser] = useState(null);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalExpenditure, setTotalExpenditure] = useState(0);

  const fetchDataUser = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await Api.get("/api/user");
        console.log(response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Terjadi error ketika fetching data user", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error("Token invalid");
    }
  };

  const fetchTotalExpenditure = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await Api.get("/api/customer/transaksi");
        const total = response.data.transaksi.reduce(
          (sum, trans) => sum + trans.total_harga,
          0
        );
        setTotalExpenditure(total);
      } catch (error) {
        console.error("Terjadi error ketika fetching total expenditure", error);
      }
    } else {
      console.error("Token invalid");
    }
  };

  useEffect(() => {
    fetchDataUser();
    fetchTotalExpenditure();
  }, []);

  const handleToggleSidebar = (isActive) => {
    setIsSidebarActive(isActive);
  };

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
            <div className="col-md-8">
              <div className="card border-0 rounded shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Profile</span>
                  {user && (
                    <Link
                      to={`/customer/user/edit/${user.id}`}
                      className="btn btn-sm btn-warning text-white rounded-sm border-0 me-2"
                    >
                      Edit
                    </Link>
                  )}
                </div>
                <div className="card-body">
                  {isLoading ? (
                    <div className="text-center">
                      <div className="spinner-border" style={{ color: "#89CFF0" }} role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <div className="mt-2">Loading</div>
                    </div>
                  ) : user ? (
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-2">
                          <label htmlFor="nama" className="form-label">
                            <strong>username</strong>
                            <br></br>
                            {user.nama}
                          </label>
                        </div>
                        <div className="mb-2">
                          <label htmlFor="email" className="form-label">
                            <strong>email</strong>
                            <br></br>
                            {user.email}
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6 text-center">
                        <img
                          src={
                            `http://localhost:8000/${user.foto}` ||
                            "https://static.vecteezy.com/system/resources/previews/002/318/271/original/user-profile-icon-free-vector.jpg"
                          }
                          alt="User Profile"
                          className="img-fluid rounded-circle"
                          style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="alert alert-danger text-center">
                      Data belum tersedia!
                    </div>
                  )}
                </div>
              </div>
              {user && (
                <div className="mt-4">
                  <div className="card border-0 rounded shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">Total Pengeluaran Transaksi</h5>
                      <p className="card-text">{formatRupiah(totalExpenditure)}</p>
                      <Link to="/customer/transaksi" className="btn btn-primary">
                        Lihat Histori Transaksi
                      </Link>
                    </div>
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