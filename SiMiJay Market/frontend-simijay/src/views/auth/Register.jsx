import { useState } from "react";
import Api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  // const [validation, setValidation] = useState([]);

  const register = async (e) => {
    e.preventDefault();

    await Api.post("/api/register", {
      nama: nama,
      email: email,
      password: password,
      role: role,
    })
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        // setValidation(error.response.data);
        console.error("Gagal register", error.response ? error.response.data : error);
      });
  };

  return (
    <div className="row justify-content-center mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card border-0 rounded shadow-sm">
            <div className="card-body">
              <h4 className="fw-bold">Register</h4>
              <hr />
              {/* {validation.errors && (
                <div className="alert alert-danger mt-2 pb-0">
                  {validation.errors.map((error, index) => (
                    <p key={index}>
                      {error.path} : {error.msg}
                    </p>
                  ))}
                </div>
              )} */}
              <form onSubmit={register}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="form-group">
                      <label className="mb-1 fw-semibold">Nama :</label>
                      <input
                        type="text"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form-group">
                      <label className="mb-1 fw-semibold">Role :</label>
                      <select
                        className="form-select"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="" disabled>
                          Pilih Role...
                        </option>
                        <option value="admin">Admin</option>
                        <option value="supplier">Customer</option>
                        <option value="kasir">Kasir</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="form-group">
                      <label className="mb-1 fw-semibold">Email :</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form-group">
                      <label className="mb-1 fw-semibold">Password :</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <p>
                  Sudah punya akun? <Link to="/login">Login</Link>
                </p>
                <button type="submit" className="btn btn-primary w-100">
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
