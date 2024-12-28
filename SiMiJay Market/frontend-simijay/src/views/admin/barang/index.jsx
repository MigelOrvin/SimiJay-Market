import { useEffect, useState } from "react";
import Api from "../../../services/api";
import Navbar from "../../../components/Navbar";
import SidebarMenu from "../../../components/SidebarMenu";
import { Link } from "react-router-dom";

export default function BarangIndex() {
  const [barang, setBarang] = useState([]);

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

  const deleteBarang = async (id) => {
    const token = localStorage.getItem("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        await Api.delete(`/api/admin/barang/${id}`);
        fetchDataBarang();
      } catch (error) {
        console.error("Gagal menghapus data barang", error);
      }
    } else {
      console.error("Token invalid");
    }
  };

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
                <span className="fw-bold">Barang</span>
                <Link
                  to="/admin/barang/create"
                  className="btn btn-sm btn-success rounded shadow-sm border-0"
                >
                  Tambah Barang
                </Link>
              </div>
              <div className="card-body">
                <div
                  className="table-wrapper"
                  style={{
                    overflowX: "auto",
                    maxWidth: "100%",
                    paddingBottom: "10px",
                  }}
                >
                  <table
                    className="table table-bordered"
                    style={{ minWidth: "1500px" }}
                  >
                    <thead className="bg-primary text-white">
                      <tr>
                        <th
                          scope="col"
                          className="text-center fw-semibold"
                          style={{ width: "1%" }}
                        >
                          No
                        </th>
                        <th
                          scope="col"
                          className="fw-semibold"
                          style={{ width: "2%" }}
                        >
                          Kode
                        </th>
                        <th
                          scope="col"
                          className="fw-semibold"
                          style={{ width: "8%" }}
                        >
                          Nama
                        </th>
                        <th
                          scope="col"
                          className="fw-semibold"
                          style={{ width: "7%" }}
                        >
                          Harga
                        </th>
                        <th
                          scope="col"
                          className="fw-semibold"
                          style={{ width: "2%" }}
                        >
                          Stok
                        </th>
                        <th
                          scope="col"
                          className="fw-semibold"
                          style={{ width: "4%" }}
                        >
                          Tag
                        </th>
                        <th
                          scope="col"
                          className="fw-semibold"
                          style={{ width: "6%" }}
                        >
                          Berat
                        </th>
                        <th
                          scope="col"
                          className="fw-semibold"
                          style={{ width: "20%" }}
                        >
                          Deskripsi
                        </th>
                        <th
                          scope="col"
                          className="fw-semibold"
                          style={{ width: "10%" }}
                        >
                          Detail
                        </th>
                        <th
                          scope="col"
                          className="fw-semibold"
                          style={{ width: "10%" }}
                        >
                          Gambar
                        </th>
                        <th
                          scope="col"
                          className="fw-semibold text-center"
                          style={{ width: "10%" }}
                        ></th>
                      </tr>
                    </thead>
                    <tbody>
                      {barang.length > 0 ? (
                        barang.map((barangs, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td>{barangs.kode}</td>
                            <td>{barangs.nama}</td>
                            <td>Rp. {barangs.harga}</td>
                            <td>{barangs.stok}</td>
                            <td>{barangs.tag}</td>
                            <td>{barangs.berat} gram</td>
                            <td>{barangs.deskripsi}</td>
                            <td>{barangs.detail}</td>
                            <td>
                              <img
                                src={
                                  barangs.gambar
                                    ? `http://localhost:8000/${barangs.gambar}`
                                    : "https://img.qraved.co/v2/image/data/2016/09/22/Ayam_Betutu_Khas_Bali_2_1474542488119-x.jpg"
                                }
                                style={{ width: "100px", height: "auto" }}
                              />
                            </td>
                            <td className="text-center">
                              <Link
                                to={`/admin/barang/detail/${barangs.id}`}
                                className="btn btn-sm btn-info text-white rounded-sm border-0 me-2"
                              >
                                Detail
                              </Link>
                              <Link
                                to={`/admin/barang/edit/${barangs.id}`}
                                className="btn btn-sm btn-warning text-white rounded-sm border-0 me-2"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => deleteBarang(barangs.id)}
                                className="btn btn-sm btn-danger rounded-sm border-0"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="11" className="text-center">
                            <div className="alert alert-danger mb-0">
                              Data belum tersedia!
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
