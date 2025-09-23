import { Route, Routes } from 'react-router-dom';

import { Toaster } from "sonner";
import MainLayout from './layout/MainLayout';
import Overview from "./pages/user/Overview";
import Profile from './pages/user/Profile';
import Deposit from './pages/user/Deposit';
import Network from './pages/user/Network';

function App() {
  
  return (
    <>
      <Toaster />
      <Routes>
        <Route 
          path={"/user/overview"}
          element={<MainLayout child={<Overview />} />}
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
      </Routes>
    </>
  )

}

export default App
