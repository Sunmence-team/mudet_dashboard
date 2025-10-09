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
import AllUsers from "./pages/admin/AllUsers";
import Transactions from "./pages/user/Transactions";
import PackageUpload from "./pages/admin/PackageUpload";
import TransferFunds from "./pages/user/TransferFunds";
import EwalletTransfer from "./pages/user/EwalletTransfer";
import Contact from "./pages/admin/Contact";
import Stockist from "./pages/admin/Stockist";
import StockistUser from "./pages/StockistUser";
import Upgrade from "./pages/user/Upgrade";
import Announcements from "./pages/admin/Announcements";

function App() {
  return (
    <>
      <Toaster richColors />
      <Routes>
        <Route path="/login" element={<Login />} />

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
          element={<MainLayout child={<AdminOverview />} />}
        />
        <Route
          path={"/admin/users"}
          element={<MainLayout child={<Users />} />}
        />
        <Route
          path={"/admin/contact"}
          element={<MainLayout child={<Contact />} />}
        />
        <Route
          path={"/admin/announcements"}
          element={<MainLayout child={<Announcements />} />}
        />
        <Route
          path={"/admin/stockist"}
          element={<MainLayout child={<Stockist />} />}
        />
        
        <Route
          path={"/admin/contact"}
          element={<MainLayout child={<Contact />} />}
        />
        <Route
          path={"/admin/announcements"}
          element={<MainLayout child={<Announcements />} />}
        />
        <Route
          path={"/admin/stockist"}
          element={<MainLayout child={<Stockist />} />}
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
          path={"/user/transfer"}
          element={<MainLayout child={<TransferFunds />} />}
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
          path={"/user/ewallet-transfer"}
          element={<MainLayout child={<EwalletTransfer />} />}
        />
        <Route
          path={"/user/products"}
          element={<MainLayout child={<Products />} />}
        />
        <Route path={"/user/cart"} element={<MainLayout child={<Cart />} />} />
        <Route path={"/user/stockistuser"} element={<MainLayout child={<StockistUser />} />} />
        <Route
          path={"/user/stockistuser"}
          element={<MainLayout child={<StockistUser />} />}
        />
        <Route
          path={"/user/stockistuser"}
          element={<MainLayout child={<StockistUser />} />}
        />
        <Route
          path={"/admin/testimonials"}
          element={<MainLayout child={<Testimonials />} />}
        />
        <Route
          path={"/user/transactions"}
          element={<MainLayout child={<Transactions />} />}
        />
        <Route
          path={"/admin/product-upload"}
          element={<MainLayout child={<ProductUpload />} />}
        />
        <Route
          path={"/admin/package-upload"}
          element={<MainLayout child={<PackageUpload />} />}
        />
        <Route path={"/user/cart"} element={<MainLayout child={<Cart />} />} />
        <Route
          path={"/admin/users"}
          element={<MainLayout child={<AllUsers />} />}
        />
        <Route
          path={"/user/upgrade-package"}
          element={<MainLayout child={<Upgrade />} />}
        />
      </Routes>
    </>
  );
}

export default App;
