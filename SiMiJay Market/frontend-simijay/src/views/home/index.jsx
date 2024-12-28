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
  const [successMessage, setSuccessMessage] = useState(""); // Add success message state
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
      if (user && user.role) {
        switch (user.role) {
          case "admin":
            navigate("/admin/dashboard", { replace: true });
            break;
          case "customer":
            navigate("/customer/dashboard", { replace: true });
            break;
          case "kasir":
            navigate("/kasir/dashboard", { replace: true });
            break;
          default:
            setSignIn(true); // Switch to sign-in form after successful registration
            setSuccessMessage("Berhasil Terdaftar, Silahkan Login"); // Set success message
        }
      } else {
        setSignIn(true); // Switch to sign-in form after successful registration
        setSuccessMessage("Berhasil Terdaftar, Silahkan Login"); // Set success message
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setErrors({ api: "Email sudah digunakan." });
        } else if (error.response.status === 422) {
          const errors = error.response.data.errors;
          if (errors.email) {
            setErrors({ api: errors.email[0] });
          } else if (errors.password) {
            setErrors({ api: errors.password[0] });
          } else if (errors.role) {
            setErrors({ api: errors.role[0] });
          } else {
            setErrors({ api: "Registrasi gagal: " + JSON.stringify(errors) });
          }
        } else {
          setErrors({ api: "Registrasi gagal: " + (error.response.data.message || error.message) });
        }
      } else {
        setErrors({ api: "Registrasi gagal: " + error.message });
      }
      console.error("Registrasi gagal", error);
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
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrors({ api: "Email tidak ditemukan." });
      } else if (error.response && error.response.status === 401) {
        setErrors({ api: "Email ditemukan, tetapi password salah." });
      } else if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        if (errors.email) {
          setErrors({ api: errors.email[0] });
        } else if (errors.password) {
          setErrors({ api: errors.password[0] });
        } else {
          setErrors({ api: "Login gagal: " + JSON.stringify(errors) });
        }
      } else {
        setErrors({ api: "Login gagal: " + (error.response ? error.response.data.message : error.message) });
      }
      console.error("Login gagal", error);
    }
  };  

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: 'url(/src/assets/bg.gif) no-repeat center center fixed', 
        backgroundSize: 'cover',
        filter: 'blur(20px)',
        zIndex: -1
      }}></div>
      <Components.Container>
        {/* Register Form */}
        <Components.SignUpContainer signinin={signIn}>
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

            
            <Components.Error>{errors.api}</Components.Error>
            <Components.Button type="submit">Register</Components.Button>
           
          </Components.Form>
        </Components.SignUpContainer>

        {/* Login Form */}
        <Components.SignInContainer signinin={signIn}>
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
        <Components.OverlayContainer signinin={signIn}>
          <Components.Overlay signinin={signIn}>
            <Components.LeftOverlayPanel signinin={signIn}>
              <Components.Title>Welcome Back!</Components.Title>
              <Components.Paragraph>
                To keep connected with us please login with your personal info
              </Components.Paragraph>
              <Components.GhostButton onClick={() => setSignIn(true)}>
                Login
              </Components.GhostButton>
            </Components.LeftOverlayPanel>

            <Components.RightOverlayPanel signinin={signIn}>
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

export default App;
