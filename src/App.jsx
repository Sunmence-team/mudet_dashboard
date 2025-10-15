import { Route, Routes } from "react-router-dom";

import { Toaster } from "sonner";
import MainLayout from "./layout/MainLayout";
import Overview from "./pages/user/Overview";
import AdminOverview from "./pages/admin/AdminOverview";
import Profile from "./pages/user/Profile";
import Deposit from "./pages/user/Deposit";
import Network from "./pages/user/Network";
import Register from "./pages/user/Register";
import Products from "./pages/user/Products";
import Cart from "./pages/user/Cart";
import Users from "./pages/admin/Users";
import Testimonials from "./pages/admin/Testimonials";
import ProductUpload from "./pages/admin/ProductUpload";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./utilities/ProtectRoute";
import Transactions from "./pages/user/Transactions";
import PackageUpload from "./pages/admin/PackageUpload";
import TransferFunds from "./pages/user/TransferFunds";
import EwalletTransfer from "./pages/user/EwalletTransfer";
import Contact from "./pages/admin/Contact";
import Stockist from "./pages/admin/Stockist";
import StockistUser from "./pages/StockistUser";
import Upgrade from "./pages/user/Upgrade";
import Announcements from "./pages/admin/Announcements";
import Newsletters from "./pages/admin/Newsletters";
import ManageWithdrawals from "./pages/admin/transactions/ManageWithdrawals";
import AuthRedirect from "./pages/auth/AuthRedirect";

function App() {
  return (
    <>
      <Toaster 
        richColors
        closeButton
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth-redirect" element={<AuthRedirect />} />

        <Route
          path={"/user/overview"}
          element={
            <ProtectedRoute>
              <MainLayout child={<Overview />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/admin/overview"}
          element={
            <ProtectedRoute>
              <MainLayout child={<AdminOverview />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/admin/users"}
          element={
            <ProtectedRoute>
              <MainLayout child={<Users />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/admin/announcements"}
          element={
            <ProtectedRoute>
              <MainLayout child={<Announcements />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/admin/stockist"}
          element={
            <ProtectedRoute>
              <MainLayout child={<Stockist />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/admin/contact"}
          element={
            <ProtectedRoute>
              <MainLayout child={<Contact />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/admin/announcements"}
          element={
            <ProtectedRoute>
              <MainLayout child={<Announcements />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/admin/stockist"}
          element={
            <ProtectedRoute>
              <MainLayout child={<Stockist />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/user/profile"}
          element={
            <ProtectedRoute>
              <MainLayout child={<Profile />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/user/deposit"}
          element={
            <ProtectedRoute>
              <MainLayout child={<Deposit />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/user/transfer"}
          element={
            <ProtectedRoute>
              <MainLayout child={<TransferFunds />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/user/network"}
          element={
            <ProtectedRoute>
              <MainLayout child={<Network />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/user/register"}
          element={
            <ProtectedRoute>
              <MainLayout child={<Register />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/user/ewallet-transfer"}
          element={
            <ProtectedRoute>
              <MainLayout child={<EwalletTransfer />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/user/products"}
          element={
            <ProtectedRoute>
              <MainLayout child={<Products />} />
            </ProtectedRoute>
          }
        />
        <Route  
          path={"/user/cart"} 
          element={
            <ProtectedRoute>
              <MainLayout child={<Cart />} /> 
            </ProtectedRoute>
          }
        />
        <Route 
          path={"/user/stockistuser"} 
          element={
            <ProtectedRoute>
              <MainLayout child={<StockistUser />} /> 
            </ProtectedRoute>
          }
        />
        <Route
          path={"/user/stockistuser"}
          element={
            <ProtectedRoute>
              <MainLayout child={<StockistUser />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/user/stockistuser"}
          element={
            <ProtectedRoute>
              <MainLayout child={<StockistUser />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/admin/testimonials"}
          element={
            <ProtectedRoute>
              <MainLayout child={<Testimonials />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/user/transactions"}
          element={
            <ProtectedRoute>
              <MainLayout child={<Transactions />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/admin/transactions"}
          element={
            <ProtectedRoute>
              <MainLayout child={<ManageWithdrawals />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/admin/product-upload"}
          element={
            <ProtectedRoute>
              <MainLayout child={<ProductUpload />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/admin/package-upload"}
          element={
            <ProtectedRoute>
              <MainLayout child={<PackageUpload />} />
            </ProtectedRoute>
          }
        />
        <Route 
          path={"/user/cart"} 
          element={
            <ProtectedRoute>
              <MainLayout child={<Cart />} />
            </ProtectedRoute>
          } 
        />
        <Route
          path={"/admin/users"}
          element={
            <ProtectedRoute>
              <MainLayout child={<Users />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/admin/newsletter"}
          element={
            <ProtectedRoute>
              <MainLayout child={<Newsletters />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/user/transactions"}
          element={
            <ProtectedRoute>
              <MainLayout child={<Transactions />} />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/user/upgrade-package"}
          element={
            <ProtectedRoute>
              <MainLayout child={<Upgrade />} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
