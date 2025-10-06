import React from 'react'

const StockistUser = () => {
    return (
        <div className="w-full flex flex-col gap-4 items-cente justify-center">
            <p className="text-lg font-semibold">Stockist</p>
            <div className="w-full rounded-lg border border-black/10 bg-white p-8 flex flex-col gap-4">
                <p className='text-lg md:text-2xl font-semibold'>MAX STORE ( STOCKIST )</p>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">Store 2</div>
                </div>
            </div>
        </div>
    )
}

export default StockistUser