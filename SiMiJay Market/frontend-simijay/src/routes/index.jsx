import { Navigate, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Home from "../views/home";
import Dashboard from "../views/auth/Dashboard";
import SupplierIndex from "../views/admin/supplier";
import SupplierCreate from "../views/admin/supplier/create";
import SupplierEdit from "../views/admin/supplier/edit";
import KategoriIndex from "../views/admin/kategori";
import KategoriCreate from "../views/admin/kategori/create";
import KategoriEdit from "../views/admin/kategori/edit";
import UserIndex from "../views/admin/user";
import UserCreate from "../views/admin/user/create";
import UserEdit from "../views/admin/user/edit";
import BarangIndex from "../views/admin/barang";
import BarangCreate from "../views/admin/barang/create";
import BarangEdit from "../views/admin/barang/edit";
import BarangDetail from "../views/admin/barang/detail";
import BarangCustomerIndex  from "../views/customer/barang/customerIndex";
import KeranjangIndex  from "../views/customer/keranjang/index";
import ProfileIndex  from "../views/customer/profile/index";
import ProfileEdit  from "../views/customer/profile/edit";
import CustomerTransaksiIndex  from "../views/customer/transaksi/index";
import BarangKasirIndex  from "../views/kasir/barang/kasirIndex";
import BarangKasirDetail  from "../views/kasir/barang/kasirDetail";
import KeranjangKasirIndex  from "../views/kasir/keranjang/kasirIndex";
import TransaksiKasirIndex  from "../views/kasir/transaksi/kasirIndex";
import TransaksiLaporan  from "../views/kasir/laporan/index";
import LabaRugiIndex from "../views/admin/labarugi/index";

export default function AppRoutes() {

    const {isAuthenticated} = useContext(AuthContext);

  return (
    <Routes>
        <Route path="/" element={<Home />} />

        {/* Route Admin */}
        <Route path="/admin/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
        
        {/* Route Admin Kategori */}
        <Route path="/admin/kategori" element={isAuthenticated ? <KategoriIndex /> : <Navigate to="/login" replace />} />
        <Route path="/admin/kategori/create" element={isAuthenticated ? <KategoriCreate /> : <Navigate to="/login" replace />} />
        <Route path="/admin/kategori/edit/:id" element={isAuthenticated ? <KategoriEdit /> : <Navigate to="/login" replace />} />

        {/* Route Admin Supplier */}
        <Route path="/admin/supplier" element={isAuthenticated ? <SupplierIndex /> : <Navigate to="/login" replace />} />
        <Route path="/admin/supplier/create" element={isAuthenticated ? <SupplierCreate /> : <Navigate to="/login" replace />} />
        <Route path="/admin/supplier/edit/:id" element={isAuthenticated ? <SupplierEdit /> : <Navigate to="/login" replace />} />

        {/* Route Admin Barang */}
        <Route path="/admin/barang" element={isAuthenticated ? <BarangIndex /> : <Navigate to="/login" replace />} />
        <Route path="/admin/barang/create" element={isAuthenticated ? <BarangCreate /> : <Navigate to="/login" replace />} />
        <Route path="/admin/barang/edit/:id" element={isAuthenticated ? <BarangEdit /> : <Navigate to="/login" replace />} />
        <Route path="/admin/barang/detail" element={isAuthenticated ? <BarangDetail /> : <Navigate to="/login" replace />} />

        {/* Route Admin User */}
        <Route path="/admin/user" element={isAuthenticated ? <UserIndex /> : <Navigate to="/login" replace />} />
        <Route path="/admin/user/create" element={isAuthenticated ? <UserCreate /> : <Navigate to="/login" replace />} />
        <Route path="/admin/user/edit/:id" element={isAuthenticated ? <UserEdit /> : <Navigate to="/login" replace />} />

        {/* Route Admin Laba Rugi */}
        <Route path="/admin/labarugi" element={isAuthenticated ? <LabaRugiIndex /> : <Navigate to="/login" replace />} />

        {/* Route Customer */}
        <Route path="/customer/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
        
        {/* Route Customer Barang*/}
        <Route path="/customer/barang" element={isAuthenticated ? <BarangCustomerIndex /> : <Navigate to="/login" replace />} />

        {/* Route Customer Profile */}
        <Route path="/customer/user" element={isAuthenticated ? <ProfileIndex /> : <Navigate to="/login" replace />} />
        <Route path="/customer/user/edit/:id" element={isAuthenticated ? <ProfileEdit /> : <Navigate to="/login" replace />} />

        {/* Route Customer Keranjang */}
        <Route path="/customer/keranjang" element={isAuthenticated ? <KeranjangIndex /> : <Navigate to="/login" replace />} />

        {/* Route Customer Transaksi*/}
        <Route path="/customer/transaksi" element={isAuthenticated ? <CustomerTransaksiIndex /> : <Navigate to="/login" replace />} />

         {/* Route Kasir */}
         <Route path="/kasir/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
        
        {/* Route Kasir Barang*/}
        <Route path="/kasir/barang" element={isAuthenticated ? <BarangKasirIndex /> : <Navigate to="/login" replace />} />
        <Route path="/kasir/barang/detail" element={isAuthenticated ? <BarangKasirDetail /> : <Navigate to="/login" replace />} />

        {/* Route Kasir Keranjang */}
        <Route path="/kasir/keranjang" element={isAuthenticated ? <KeranjangKasirIndex /> : <Navigate to="/login" replace />} />

        {/* Route Kasir Transaksi*/}
        <Route path="/kasir/transaksi" element={isAuthenticated ? <TransaksiKasirIndex /> : <Navigate to="/login" replace />} />\

        {/* Route Kasir Laporan*/}
        <Route path="/kasir/laporan" element={isAuthenticated ? <TransaksiLaporan /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}
