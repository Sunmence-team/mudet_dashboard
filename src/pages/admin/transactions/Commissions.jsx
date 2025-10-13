// import React, { useEffect, useState } from 'react'
// import api from '../../../utilities/api'
// import { useUser } from '../../../context/UserContext';
// import CommisionCard from "../../../components/cards/CommisionCard"

// const Commissions = () => {
//     const { user, token } = useUser();
//     const [commissionDetails, setCommissionDetails] = useState([])
//     const [isFetchingCommissions, setIsFetchingCommissions] = useState(false)

//     const fetchCommissions = async () => {
//         setIsFetchingCommissions(true)
//         try {
//           const response = await api.get(`/api/bottle_commission`, {
//             headers: {
//               "Authorization": `Bearer ${token}`
//             }
//           })
    
//           console.log("commission response", response)
    
//           if (response.status === 200) {
//             setCommissionDetails(response.data.commissions.data)
//           } else {
//             throw new Error(response.data.message || "Failed to get overview data.");
//           }
          
//         } catch (error) {
//           console.error("An error occured fetching overview data", error)
//           toast.error("An error occured fetching overview data")
//         } finally {
//           setIsFetchingCommissions(false)
//         }
//     }

//     useEffect(() => {
//         fetchCommissions()
//     }, [token])

//     const commissions = [
//         {
//             user: commissionDetails[0]?.user, 
//             total_amount: commissionDetails[0]?.total_amount, 
//             total_transactions: commissionDetails[0]?.total_transactions
//         },
//         {
//             user: commissionDetails[1]?.user, 
//             total_amount: commissionDetails[1]?.total_amount, 
//             total_transactions: commissionDetails[1]?.total_transactions
//         },
//         {
//             user: commissionDetails[2]?.user, 
//             total_amount: commissionDetails[2]?.total_amount, 
//             total_transactions: commissionDetails[2]?.total_transactions
//         },
//         {
//             user: commissionDetails[3]?.user, 
//             total_amount: commissionDetails[3]?.total_amount, 
//             total_transactions: commissionDetails[3]?.total_transactions
//         },
//     ]

//     return (
//         <>
//             <h3 className="text-3xl font-semibold tracking-tight">Commisions Summary</h3>
//             <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
//                 {commissions.map((commission, index) => (
//                     <CommisionCard details={commission} index={index} key={index} isLoading={isFetchingCommissions} />
//                 ))}
//             </div>
//         </>
//     )
// }

// export default Commissions


import React, { useEffect, useState, useCallback } from 'react';
import api from '../../../utilities/api';
import { useUser } from '../../../context/UserContext';
import CommisionCard from '../../../components/cards/CommisionCard';
import ViewCommissionHistoryModal from '../../../components/modals/ViewCommissionHistoryModal';
import { toast } from 'sonner';

const Commissions = () => {
    const { token } = useUser();
    // Use the actual data type for commissionDetails
    const [commissionDetails, setCommissionDetails] = useState([]);
    const [isFetchingCommissions, setIsFetchingCommissions] = useState(false);

    // 2. State for Modal and Selected History
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState(null);

    const fetchCommissions = useCallback(async () => {
        if (!token) return;
        
        setIsFetchingCommissions(true);
        try {
            const response = await api.get(`/api/bottle_commission`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
    
            console.log("commission response", response);
    
            if (response.status === 200 && response.data.commissions.data) {
                setCommissionDetails(response.data.commissions.data);
            } else {
                throw new Error(response.data.message || "Failed to get commission data.");
            }
            
        } catch (error) {
            console.error("An error occured fetching commission data", error);
            toast.error("An error occurred fetching commission data"); 
        } finally {
            setIsFetchingCommissions(false);
        }
    }, [token]);


    useEffect(() => {
        fetchCommissions();
    }, [fetchCommissions]);

    const handleViewHistory = (commissionEntry) => {
        setSelectedHistory(commissionEntry);
        setShowHistoryModal(true);
    };

    return (
        <>
            <h3 className="text-3xl font-semibold tracking-tight">Commissions Summary</h3>
            <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
                {isFetchingCommissions ? (
                    [...Array(4)].map((_, index) => (
                        <CommisionCard key={index} index={index} isLoading={true} />
                    ))
                ) : commissionDetails.length > 0 ? (
                    commissionDetails.map((commission, index) => (
                        <CommisionCard 
                            key={commission.user_id} 
                            details={commission} 
                            index={index} 
                            isLoading={false}
                            onViewHistory={() => handleViewHistory(commission)} 
                        />
                    ))
                ) : (
                    <p className="col-span-4 text-center p-4">No commission data available.</p>
                )}
            </div>

            {/* 5. Render the Modal */}
            {showHistoryModal && selectedHistory && (
                <ViewCommissionHistoryModal
                    isOpen={showHistoryModal}
                    onClose={() => setShowHistoryModal(false)}
                    historyData={selectedHistory.bottle_commission}
                    username={selectedHistory.user.username}
                />
            )}
        </>
    );
}

export default Commissions;