import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Api from "../../services/api";

export default function Login() {
  const navigate = useNavigate();

  const { setIsAuthenticated } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//   const [validation, setValidation] = useState([]);
//   const [loginFailed, setLoginFailed] = useState([]);

  const login = async (e) => {
    e.preventDefault();

    await Api.post("/api/login", {
      email: email,
      password: password,
    })
      .then((response) => {
        const { access_token, user } = response.data;
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));

        setIsAuthenticated(true);

        if (user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (user.role === "customer") {
          navigate("/customer/dashboard", { replace: true });
        } else {
          navigate("/kasir/dashboard", { replace: true });
        }
      })
      .catch((error) => {
        // setValidation(error.response.data);
        // setLoginFailed(error.response.data);
        console.error('Login gagal', error)
      });
  };

  return (
    <div className="row justify-content-center mt-5 pt-5">
      <div className="col-md-4">
        <div className="card border-0 rounded shadow-sm">
          <div className="card-body">
            <h4 className="fw-bold">Login</h4>
            <hr />
            {/* {validation.errors && (
              <div className="alert alert-danger mt-2 pb-0">
                {validation.errors.map((error, index) => (
                  <p key={index}>
                    {error.path} : {error.msg}
                  </p>
                ))}
              </div>
            )}
            {loginFailed.message && (
              <div className="alert alert-danger mt-2">
                {loginFailed.message}
              </div>
            )} */}
            <form onSubmit={login}>
              <div className="form-group mb-3">
                <label className="mb-1 fw-semibold">Alamat Email :</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label className="mb-1 fw-semibold">Password :</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <p>Belum punya akun? <Link to='/register'>Register</Link></p>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
