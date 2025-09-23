import React, { useState, useRef } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { CiMaximize1, CiMinimize1 } from "react-icons/ci";
import TreeNode from './TreeNode';

const GenealogyTree = () => {
  const [canvaScale, setCanvaScale] = useState(100);
  const [isFullScreen, setIsFullScreen] = useState(false);

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

  const canvaRef = useRef(null);

  const handleCanvaScaleReduction = () => {
    if (canvaScale > 10) {
      setCanvaScale(canvaScale - 10);
    }
  };

  const handleCanvaScaleIncrement = () => {
    if (canvaScale < 100) {
      setCanvaScale(canvaScale + 10);
    }
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

  return (
    <div ref={canvaRef} className='bg-white relative rounded-xl shadow-md p-8 h-[calc(100dvh-(44px+16px+48px))] mb-2 overflow-auto no-scrollbar'>
      {referralData && <TreeNode node={referralData} />}
      <div className="absolute w-max right-5 bottom-5 flex bg-gray-100 border border-black/20 rounded-md overflow-hidden">
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