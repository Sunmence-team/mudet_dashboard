import React from 'react';
import { formatDateToStyle, formatterUtility } from '../../utilities/formatterutility';
// import Modal from '../modals/Modal';

const ViewCommissionHistoryModal = ({ isOpen, onClose, historyData, username }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-xs bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-[90%] max-w-2xl rounded-2xl shadow-lg ps-4 pe-2 py-6 relative">
                <h3 className="text-xl font-bold mb-4 md:text-start text-center">Commission History for <span className='uppercase'>{username}</span></h3>
                <div className="max-h-86 overflow-auto pe-2 styled-scrollbar">
                    {historyData.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Ref No.</th>
                                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {historyData.map((item, index) => (
                                    <tr key={index} className='bg-tetiary text-center text-xs'>
                                        <td className="p-3 text-start rounded-s-lg border-y border-s-1 border-black/10">
                                            {formatDateToStyle(item.date)}
                                        </td>
                                        <td className="p-4 border-y border-black/10">{item.ref_no}</td>
                                        <td className="p-4 border-y border-black/10 whitespace-pre">
                                            {item?.products
                                                ?.map((product) => `${product.product_name.trim()} (Qty: ${product.quantity})`)
                                                .join(", \n") || "-"}
                                        </td>
                                        <td className="p-3 rounded-e-lg border-y border-e-1 border-black/10 text-end">
                                            {formatterUtility(item.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center p-4 text-gray-700">No transaction history found.</p>
                    )}
                </div>

                <div className="mt-6">
                    <button
                        onClick={onClose}
                        className="w-full bg-primary cursor-pointer text-white font-bold py-2 px-4 rounded-md shadow-md"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewCommissionHistoryModal;