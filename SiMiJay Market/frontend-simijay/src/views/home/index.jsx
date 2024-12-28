import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import * as Components from "./Components";
import Api from "../../services/api";

function App() {
  const [signIn, setSignIn] = useState(true);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Initialize useNavigate
  const { setIsAuthenticated } = useContext(AuthContext); // Use AuthContext

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateLoginForm = () => {
    const newErrors = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email tidak valid.";
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password harus memiliki setidaknya 8 karakter.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors = {};
    if (!formData.nama || formData.nama.length < 3) {
      newErrors.nama = "Nama harus memiliki setidaknya 3 karakter.";
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email tidak valid.";
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password harus memiliki setidaknya 8 karakter.";
    }
    if (!formData.role) {
      newErrors.role = "Role harus dipilih.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;
    
    try {
      const response = await Api.post("/api/register", {
        nama: formData.nama,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      const { access_token, user } = response.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      setIsAuthenticated(true); // Menambahkan state untuk menandakan user sudah login
  
      // Redirect berdasarkan role pengguna
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "customer") {
        navigate("/customer/dashboard", { replace: true });
      } else if (user.role === "kasir") {
        navigate("/kasir/dashboard", { replace: true });
      }
      alert("Registrasi berhasil!");
    } catch (error) {
      console.error("Registrasi gagal", error.response ? error.response.data : error);
      alert("Registrasi gagal: " + (error.response ? error.response.data.errors : error.message));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    try {
      const response = await Api.post("/api/login", {
        email: formData.email,
        password: formData.password,
      });
      const { access_token, user } = response.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      setIsAuthenticated(true); // Menambahkan state untuk menandakan user sudah login
  
      // Redirect berdasarkan role pengguna
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "customer") {
        navigate("/customer/dashboard", { replace: true });
      } else if (user.role === "kasir") {
        navigate("/kasir/dashboard", { replace: true });
      }
      alert("Login berhasil!");
    } catch (error) {
      // Menambahkan penanganan error lebih lanjut jika diperlukan
      console.error("Login gagal", error);
      alert("Login gagal: " + (error.response ? error.response.data.errors : error.message));
    }
  };  

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Components.Container>
        {/* Register Form */}
        <Components.SignUpContainer signinIn={signIn}>
          <Components.Form onSubmit={handleRegister}>
            <Components.Title>Register</Components.Title>
            <Components.Input
              type="text"
              name="nama"
              placeholder="Name"
              value={formData.nama}
              onChange={handleInputChange}
              required
              style={{ borderRadius: '30px', marginTop: '20px' }}
            />
            <Components.Error>{errors.nama}</Components.Error>
            <Components.Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{ borderRadius: '30px' }}
            />
            <Components.Error>{errors.email}</Components.Error>
            <Components.Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={{ borderRadius: '30px' }}
            />
            <Components.Error>{errors.password}</Components.Error>
            <Components.Input
              as="select"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              style={{ borderRadius: '30px', marginBottom: '20px', paddingLeft: '10px' }}
            >
              <option value="" disabled>
                Pilih Role...
              </option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
              <option value="kasir">Kasir</option>
            </Components.Input>
            <Components.Error>{errors.role}</Components.Error>
            <Components.Button type="submit">Register</Components.Button>
          </Components.Form>
        </Components.SignUpContainer>

        {/* Login Form */}
        <Components.SignInContainer signinIn={signIn}>
          <Components.Form onSubmit={handleLogin}>
            <Components.Title>Login</Components.Title>
            <Components.Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{ borderRadius: '30px', marginTop: '20px' }}
            />
            <Components.Error>{errors.email}</Components.Error>
            <Components.Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={{ borderRadius: '30px', marginBottom: '20px' }}
            />
            <Components.Error>{errors.password}</Components.Error>
            <Components.Error>{errors.api}</Components.Error>
            <Components.Button type="submit">Login</Components.Button>
          </Components.Form>
        </Components.SignInContainer>

        {/* Overlay */}
        <Components.OverlayContainer signinIn={signIn}>
          <Components.Overlay signinIn={signIn}>
            <Components.LeftOverlayPanel signinIn={signIn}>
              <Components.Title>Welcome Back!</Components.Title>
              <Components.Paragraph>
                To keep connected with us please login with your personal info
              </Components.Paragraph>
              <Components.GhostButton onClick={() => setSignIn(true)}>
                Login
              </Components.GhostButton>
            </Components.LeftOverlayPanel>

            <Components.RightOverlayPanel signinIn={signIn}>
              <Components.Title>Hello, Friend!</Components.Title>
              <Components.Paragraph>
                Enter your personal details and start your journey with us
              </Components.Paragraph>
              <Components.GhostButton onClick={() => setSignIn(false)}>
                Register
              </Components.GhostButton>
            </Components.RightOverlayPanel>
          </Components.Overlay>
        </Components.OverlayContainer>
      </Components.Container>
    </div>
  );
}

export default App;
