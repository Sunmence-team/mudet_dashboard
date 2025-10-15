import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { decryptToken } from "../../helpers/tokenHelper";
import { motion, AnimatePresence } from 'framer-motion';
import assets from "../../assets/assets";
import LazyLoader from "../../components/loaders/LazyLoader";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const AuthRedirect = () => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(useLocation().search);
  const { setToken, setUser } = useUser();

  const [loadingMessage, setLoadingMessage] = useState("Verifying token...");

  useEffect(() => {
    const encryptedToken = urlParams.get("token");

    const verifyAndRedirect = async () => {
      if (!encryptedToken) {
        window.location.href = "https://mudetrealsolution.com/#/login";
        return;
      }

      const token = decryptToken(decodeURIComponent(encryptedToken));
      if (!token) {
        window.location.href = "https://mudetrealsolution.com/#/login";
        return;
      }

      try {
        // Save token early
        localStorage.setItem("token", token);

        // Get user
        const res = await axios.get(`${API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("res on auth", res)
        console.log("token on auth", token)

        const user = res.data.data.user;

        // Save to localStorage & context
        localStorage.setItem("user", JSON.stringify(user));
        setToken(token);
        setUser(user);

        // Redirect
        // setLoadingMessage("Login successful, redirecting...");
        setTimeout(() => {
          navigate(user?.role === "admin" ? "/admin/overview" : "/user/overview");
        }, 1000);
      } catch (error) {
        console.error("Verification failed", error);
        window.location.href = "https://mudetrealsolution.com/#/login";
      }
    };

    verifyAndRedirect();
  }, []);

  const Dot = ({ delayOffset }) => (
    <motion.span
      style={{ display: 'inline-block', lineHeight: 1 }}
      variants={{
        hidden: { opacity: 0, y: 5 },
        visible: { opacity: 1, y: 0 },
        fade: { opacity: 0, y: 5 }
      }}
      initial="hidden"
      animate="visible"
      transition={{
        delay: 0.5 + delayOffset,
        duration: 0.2,
        ease: 'easeOut',
        repeat: Infinity,
        repeatDelay: 1,
        repeatType: 'loop',
      }}
    >
      <div className="w-1 h-1 rounded-full bg-primary"></div>
    </motion.span>
  );


  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-tetiary p-6">
      <div className="relative z-1">
        <div className="bg-primary w-40 h-40 backdrop-blur-lg rounded-full p-4 text-center">
          <img src={assets.biglogo} alt="Mudet Real Solution logo" className="w-full object-cover mx-auto" />
        </div>
        <motion.div
          className="absolute p-4 bg-primary/20 rounded-full"
          style={{
              width: 'calc(160px + 16px * 2)',
              height: 'calc(160px + 16px * 2)',
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-50%',
              zIndex: -1
          }}
          initial={{ opacity: 0.5, scale: 0.2 }}
          animate={{ scale: [1, 1.05], opacity: 1 }}
          transition={{
            duration: 1,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        ></motion.div>
      </div>
      <motion.h1
        className="text-2xl md:text-4xl font-bold text-primary my-4 flex items-end"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 0.2,
          duration: 0.5,
        }}
      >
        Redirecting
        
        <span className="flex gap-1 ms-1 mb-2">
          {['.', '.', '.'].map((_dot, index) => (
            <Dot key={index} delayOffset={index * 0.2} /> 
          ))}
        </span>
      </motion.h1>
    </div>
  );
};

export default AuthRedirect;