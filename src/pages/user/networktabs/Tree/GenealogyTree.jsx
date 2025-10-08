import React, { useState, useRef, useEffect } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { CiMaximize1, CiMinimize1 } from "react-icons/ci";
import TreeNode from './TreeNode';
import { useUser } from '../../../../context/UserContext';
import api from '../../../../utilities/api';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const GenealogyTree = () => {
  const [canvaScale, setCanvaScale] = useState(100);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  // const [referralData, setReferralData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useUser()

  const referralData ={
    address: {
      address1: null, 
      address2: null, 
      city: 'Kuje', 
      state: 'Federal Capital Territory', 
      country: 'Nigeria'
    },
    created_at:"2025-08-25T18:18:05.000000Z",
    email:"developerone@gmail.com",
    fullname:"developer one",
    left_count: 10,
    right_count: 10,
    username: "Mayorkun27",
    id:459,
    left: {
        address: {
            address1: null, 
            address2: null, 
            city: 'Kuje', 
            state: 'Federal Capital Territory', 
            country: 'Nigeria'
        },
        created_at:"2025-08-25T18:18:05.000000Z",
        email:"developerone@gmail.com",
        fullname:"developer one",
        left_count: 10,
        right_count: 10,
        username: "Mayorkun27",
        id:459,
        left: {
        address: {
            address1: null, 
            address2: null, 
            city: 'Kuje', 
            state: 'Federal Capital Territory', 
            country: 'Nigeria'
        },
        created_at:"2025-08-25T18:18:05.000000Z",
        email:"developerone@gmail.com",
        fullname:"developer one",
        left_count: 10,
        right_count: 10,
        username: "Mayorkun27",
        id:459,
    },
    right: {
      address: {
        address1: null, 
        address2: null, 
        city: 'Kuje', 
        state: 'Federal Capital Territory', 
        country: 'Nigeria'
      },
      created_at:"2025-08-25T18:18:05.000000Z",
      email:"developerone@gmail.com",
      fullname:"developer one",
      left_count: 10,
      right_count: 10,
      username: "Mayorkun27",
      id:459,
      left: {
          address: {
              address1: null, 
              address2: null, 
              city: 'Kuje', 
              state: 'Federal Capital Territory', 
              country: 'Nigeria'
          },
          created_at:"2025-08-25T18:18:05.000000Z",
          email:"developerone@gmail.com",
          fullname:"developer one",
          left_count: 10,
          right_count: 10,
          username: "Mayorkun27",
          id:459,
      },
      right: {
        address: {
          address1: null, 
          address2: null, 
          city: 'Kuje', 
          state: 'Federal Capital Territory', 
          country: 'Nigeria'
        },
        created_at:"2025-08-25T18:18:05.000000Z",
        email:"developerone@gmail.com",
        fullname:"developer one",
        left_count: 10,
        right_count: 10,
        username: "Mayorkun27",
        id:459,
        left: {
        address: {
          address1: null, 
          address2: null, 
          city: 'Kuje', 
          state: 'Federal Capital Territory', 
          country: 'Nigeria'
        },
        created_at:"2025-08-25T18:18:05.000000Z",
        email:"developerone@gmail.com",
        fullname:"developer one",
        left_count: 10,
        right_count: 10,
        username: "Mayorkun27",
        id:459,
      }
      }
    }
    },
    right: {
      address: {
        address1: null, 
        address2: null, 
        city: 'Kuje', 
        state: 'Federal Capital Territory', 
        country: 'Nigeria'
      },
      created_at:"2025-08-25T18:18:05.000000Z",
      email:"developerone@gmail.com",
      fullname:"developer one",
      left_count: 10,
      right_count: 10,
      username: "Mayorkun27",
      id:459,
      left: {
          address: {
              address1: null, 
              address2: null, 
              city: 'Kuje', 
              state: 'Federal Capital Territory', 
              country: 'Nigeria'
          },
          created_at:"2025-08-25T18:18:05.000000Z",
          email:"developerone@gmail.com",
          fullname:"developer one",
          left_count: 10,
          right_count: 10,
          username: "Mayorkun27",
          id:459,
      },
      right: {
        address: {
          address1: null, 
          address2: null, 
          city: 'Kuje', 
          state: 'Federal Capital Territory', 
          country: 'Nigeria'
        },
        created_at:"2025-08-25T18:18:05.000000Z",
        email:"developerone@gmail.com",
        fullname:"developer one",
        left_count: 10,
        right_count: 10,
        username: "Mayorkun27",
        id:459,
        left: {
        address: {
          address1: null, 
          address2: null, 
          city: 'Kuje', 
          state: 'Federal Capital Territory', 
          country: 'Nigeria'
        },
        created_at:"2025-08-25T18:18:05.000000Z",
        email:"developerone@gmail.com",
        fullname:"developer one",
        left_count: 10,
        right_count: 10,
        username: "Mayorkun27",
        id:459,
      }
      }
    }
  }

  // const fetchGenealogyTree = async () => {
  //   setIsLoading(true)
  //   try {
  //     const response = await api.get(`/api/referrals/genealogy-tree`, {
  //       headers: {
  //         "Authorization": `Bearer ${token}`,
  //       }
  //     });

  //     console.log("Genealogy response", response)

  //     if (response.status === 200) {
  //       setReferralData(response.data.data)
  //       toast.success(response.data.message || "Genealogy data fetched successfully.");
  //     } else {
  //       throw new Error(response.data.message || "Genealogy data call failed.");
  //     }
  //   } catch (error) {
  //     if (error.response?.data?.message?.includes("unauthenticated")) {
  //       logout();
  //     }
  //     console.error("An error occured fetching genealogy data:", error);
  //     toast.error(error.response?.data?.message || "An error occurred fetching genealogy data.");
  //   } finally {
  //     setTimeout(() => {
  //       setIsLoading(false)
  //     }, 2000);
  //   }
  // }

  // useEffect(() => {
  //   fetchGenealogyTree()
  // }, [token])

  const canvaRef = useRef(null);

  const handleCanvaScaleReduction = () => {
    if (canvaScale > 10) setCanvaScale(canvaScale - 10);
  };

  const handleCanvaScaleIncrement = () => {
    if (canvaScale < 200) setCanvaScale(canvaScale + 10);
  };

  const handleMaximize = () => {
    if (!document.fullscreenElement) {
      if (canvaRef.current) {
        canvaRef.current.requestFullscreen().then(() => {
          setIsFullScreen(true);
        });
      }
    } else {
      document.exitFullscreen().then(() => {
        setIsFullScreen(false);
      });
    }
  };

  const handleMouseDown = (e) => {
    if (!canvaRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - canvaRef.current.offsetLeft);
    setStartY(e.pageY - canvaRef.current.offsetTop);
    setScrollLeft(canvaRef.current.scrollLeft);
    setScrollTop(canvaRef.current.scrollTop);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging || !canvaRef.current) return;
    e.preventDefault();
    const x = e.pageX - canvaRef.current.offsetLeft;
    const y = e.pageY - canvaRef.current.offsetTop;
    const walkX = (x - startX) * 1.2; // drag speed
    const walkY = (y - startY) * 1.2;
    canvaRef.current.scrollLeft = scrollLeft - walkX;
    canvaRef.current.scrollTop = scrollTop - walkY;
  };

  const handleTouchStart = (e) => {
    if (!canvaRef.current) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setStartX(touch.pageX - canvaRef.current.offsetLeft);
    setStartY(touch.pageY - canvaRef.current.offsetTop);
    setScrollLeft(canvaRef.current.scrollLeft);
    setScrollTop(canvaRef.current.scrollTop);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !canvaRef.current) return;
    const touch = e.touches[0];
    const x = touch.pageX - canvaRef.current.offsetLeft;
    const y = touch.pageY - canvaRef.current.offsetTop;
    const walkX = (x - startX) * 1.2;
    const walkY = (y - startY) * 1.2;
    canvaRef.current.scrollLeft = scrollLeft - walkX;
    canvaRef.current.scrollTop = scrollTop - walkY;
  };

  const handleTouchEnd = () => setIsDragging(false);

  return (
    <div 
      ref={canvaRef} 
      className="canva-ref bg-white relative rounded-xl shadow-md p-20 pt-14 h-[calc(100dvh-(44px+16px+48px))] mb-2 overflow-auto no-scrollbar"
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-max mx-auto" style={{ transform: `scale(${canvaScale / 100})`, transformOrigin: 'top center' }}>
        {referralData && <TreeNode node={referralData} />}
      </div>

      <div className="absolute bottom-0 right-0 w-max right-8 md:bottom-8 bottom-4 flex bg-gray-100 border border-black/20 rounded-md overflow-hidden">
        <button
          type='button'
          className='w-10 h-10 flex items-center justify-center disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer'
          title='Decrease canva size'
          disabled={canvaScale === 30}
          onClick={handleCanvaScaleReduction}
        >
          <FaMinus />
        </button>
        <button
          type='button'
          className='w-10 h-10 text-xs flex items-center justify-center border-x border-black/20 cursor-pointer'
          title='Increase canva size'
          disabled
        >
          {canvaScale + "%"}
        </button>
        <button
          type='button'
          className='w-10 h-10 flex items-center justify-center border-x border-black/20 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer'
          title='Increase canva size'
          disabled={canvaScale === 100}
          onClick={handleCanvaScaleIncrement}
        >
          <FaPlus />
        </button>
        <button
          type='button'
          className='w-10 h-10 flex items-center justify-center disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer font-extrabold'
          title={`${isFullScreen ? "Minimize" : "Maximize"} canva`}
          onClick={handleMaximize}
        >
          {!isFullScreen ? <CiMaximize1 /> : <CiMinimize1 />}
        </button>
      </div>
    </div>
  )
}

export default GenealogyTree