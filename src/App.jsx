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
import Login from './auth/Login';

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path={"/user/overview"}
          element={<ProtectedRoute element={() => <MainLayout child={<Overview />} />} />}
        />
        <Route
          path={"/admin/overview"}
          element={<MainLayout child={<AdminOverview />} />}
        />
        <Route
          path={"/admin/users"}
          element={<MainLayout child={<Users />} />}
        />
        <Route
          path={"/user/profile"}
          element={<MainLayout child={<Profile />} />}
        />
        <Route
          path={"/user/deposit"}
          element={<MainLayout child={<Deposit />} />}
        />
        <Route
          path={"/user/network"}
          element={<MainLayout child={<Network />} />}
        />
        <Route
          path={"/user/register"}
          element={<MainLayout child={<Register />} />}
        />
        <Route
          path={"/user/products"}
          element={<MainLayout child={<Products />} />}
        />
        <Route path={"/user/cart"} element={<MainLayout child={<Cart />} />} />
        <Route
          path={"/admin/testimonials"}
          element={<MainLayout child={<Testimonials />} />}
        />
        <Route
          path={"/admin/product-upload"}
          element={<MainLayout child={<ProductUpload />} />}
        />
        <Route path={"/user/cart"} element={<MainLayout child={<Cart />} />} />
      </Routes>
    </>
  );
}

export default App;
