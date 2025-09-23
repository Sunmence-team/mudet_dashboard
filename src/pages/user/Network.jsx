import React, { useState } from 'react'
import GenealogyTree from './networktabs/Tree/GenealogyTree'
import DirectRefsList from './networktabs/DirectRefsList'

const Network = () => {
    const [selectedTab, setSelectedTab] = useState("tree")

    return (
        <div>
            <div className='space-y-8'>
            <div className="flex md:flex-row flex-col gap-4 md:items-center items-start justify-between">
                <h3 className='font-semibold md:text-2xl text-xl'>Networks</h3>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => setSelectedTab('tree')}
                        className={`px-6 md:py-2 py-3 font-medium rounded-full cursor-pointer md:text-base text-sm ${
                            selectedTab === 'tree' ? 'bg-primary text-white' : 'bg-secondary text-white'
                        }`}
                    >
                        Genealogy Tree
                    </button>
                    <button
                        onClick={() => setSelectedTab('direct')}
                        className={`px-6 md:py-2 py-3 font-medium rounded-full cursor-pointer md:text-base text-sm ${
                            selectedTab === 'direct' ? 'bg-primary text-white' : 'bg-secondary text-white'
                        }`}
                    >
                        Referral List
                    </button>
                </div>
            </div>
            {selectedTab === "tree" && <GenealogyTree />}
            {selectedTab === "direct" && <DirectRefsList />}
        </div>
        </div>
    )
}

export default Network