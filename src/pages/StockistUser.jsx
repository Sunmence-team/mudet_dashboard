import React from 'react'

const StockistUser = () => {
    return (
        <div className="w-full flex flex-col gap-4 items-cente justify-center">
            <p className="text-lg font-semibold">Stockist</p>
            <div className='w-full flex flex-col gap-8'>
                <div className="w-full rounded-lg border border-black/10 bg-white p-8 flex flex-col gap-4">
                    <p className='text-lg md:text-2xl font-semibold'>MAX STORE ( STOCKIST )</p>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className='flex flex-col gap-2'>
                            <p className='text-xl font-semibold'>Requirements</p>
                            <div className='flex flex-col'>
                                <p className='text-primary font-semibold'>a. Office & Facilities</p>
                                <p>An office space with storage capacity.
                                    A seminar/training hall that can seat at least 20 people comfortably.
                                    Decent convenience facilities for visitors and members.</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-primary font-semibold'>b.Branding & Exclusivity</p>
                                <p>Office must be fully branded in Mudet Real Solution identity (at the cost of the MAX Store).
                                    Only Mudet Real Solution products are permitted to be displayed and sold</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-primary font-semibold'>c. Package Level</p>
                                <p>
                                    Must be subscribed to the Highest Package (LEGEND).</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-primary font-semibold'>d. Application & Approval</p>
                                <p>Submit an application for inspection and consideration by Mudet Real Solution.
                                    Upon approval, proceed to payment.</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-primary font-semibold'>e. Registration Fee</p>
                                <p>Pay a non-refundable MAX STORE fee of ₦10,000,000.00 only.
                                    What a MAX STORE Owner Receives After Payment
                                    600 bottles of 750ml Cinnamon Herbal Extract; OR
                                    200 bottles of 500ml Armor Herbal Extract; OR
                                    800 bottles (mix of Cinnamon & Armor Herbal Extracts), depending on company discretion and product availability.
                                    Marketing & Branding Materials: Flyers, brochures, branded nylon bags.
                                    Point Value (PV) Allocation: 12,000 PV automatically credited to the distributor’s reorder end (Auto-ship).
                                    1,800 PV (15%) goes to the Binary End.
                                    10,200 PV remains in the Unilevel End</p>
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <p className='text-xl font-semibold'>Benefits of Being a MAX STORE Owner</p>
                            <div className='flex flex-col'>
                                <p className='text-primary font-semibold'>a. Personal Repurchase Bonus (PRB)</p>
                                <p>Earn 15% of the Unilevel PV from the initial purchase.
                                    Example: 15% of 10,200 PV = ₦918,000 paid directly to the MAX STORE</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-primary font-semibold'>b. Store Clearance Commission</p>
                                <p>Earn 10% of every product cleared by distributors from your store.
                                    Example: You earn ₦1,400 per bottle of 750ml Cinnamon/Armor Herbal Extract sold.</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-primary font-semibold'>c. Mini Store (MIS) Override</p>
                                <p>
                                    Earn 20% commission on every product released by a Mini Store under your MAX STORE.</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-primary font-semibold'>d. A fixed and one time  150 000 commission for office maintenance for MAX store</p>

                            </div>
                            <div className='flex flex-col'>
                                <p className='text-primary font-semibold'>e. Service Center Override</p>
                                <p>Earn 10% equivalent of what Mini Stores under you earn as fixed and one time MNI store   commissions/ Bonus
                                    Benefits for the Upline of a MAX STORE
                                    The direct upline of the MAX STORE earns up to 6% of the Unilevel PV generated.
                                    The indirect uplines earn 5%, with commissions continuing up to the 15th generation, in line with the Unilevel Commission structure.
                                    Additional Advantage: The entire 12,000 PV generated will count upwards towards Awards Qualification for everyone in the genealogy.</p>
                            </div>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <button className='bg-primary text-white py-2 rounded-4xl w-full'>Become a MAX STORE OWNER</button>
                    </div>
                </div>

                <div className="w-full rounded-lg border border-black/10 bg-white p-8 flex flex-col gap-4">
                    <p className='text-lg md:text-2xl font-semibold'>MINI STORE ( STOCKIST )</p>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className='flex flex-col gap-2'>
                            <p className='text-xl font-semibold'>Requirements</p>
                            <div className='flex flex-col'>
                                <p>1. An office space with storage capacity, hall for seminars/trainings that can seat at least 20 people comfortably.</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-primary font-semibold'>b.Branding & Exclusivity</p>
                                <p>Office must be fully branded in Mudet Real Solution identity (at the cost of the MAX Store).
                                    Only Mudet Real Solution products are permitted to be displayed and sold</p>
                            </div>
                            <div className='flex flex-col'>
                                <p>
                                    2. Office must be fully branded for MUDET REAL SOLUTION (by the MAX STORE)and must have EXCLUSIVELY MUDET REAL SOLUTION products.</p>
                            </div>
                            <div className='flex flex-col'>
                                <p>3. Must be on the Highest package ( LEGEND )</p>
                            </div>
                            <div className='flex flex-col'>
                                <p>4. Apply to MUDET REAL SOLUTION for inspection & consideration</p>
                            </div>
                            <div className='flex flex-col'>
                                <p>5. If application is successful, pay the non-refundable MAX STORE fee of N2,500,000.00 only</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-primary font-semibold'>Note:</p>
                                <div className='flex flex-col'>
                                    <p>After payment, the MINI STORE may receive the following:</p>
                                </div>
                                <div className='flex flex-col'>
                                    <p>A. 150 bottles of 750ml CINNAMON herbal extracts</p>
                                </div>
                                <div className='flex flex-col'>
                                    <p>B.  50 bottles of 500ml ARMOR herbal extracts.</p>
                                </div>
                                <div className='flex flex-col'>
                                    <p>C. OR 200 bottles of CINNAMON/ ARMOR HERBAL EXTRACT, though Company has the right to use her discretion depends on the availability of the products.</p>
                                </div>
                                <div className='flex flex-col'>
                                    <p>D.Flyers, Brochures and branded Nylon bags.</p>
                                </div>
                                <div className='flex flex-col'>
                                    <p>E. A total of 2500PV will be keyed in to the distributor's reorder end ( AUTO SHIP).
                                        10% of that (2500PV) will go to the binary end(250) & 2,250 PV will remain in the Unilevel end</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <p className='text-xl font-semibold'>Benefits of Being a MAX STORE Owner</p>
                            <div className='flex flex-col'>
                                <p>a. 10% of the UNILEVEL point from that purchase, i.e 10% of 2250PV = 10÷100×2250=225×600=135000 will be paid to the MINI STORE as PRB (Personal Repurchase Bonus).</p>
                            </div>
                            <div className='flex flex-col'>
                                <p>b.  In Addition, the MINI Store owner will earn 8% of every product cleared from his/her Store to distributors.
                                    That is, you will earn N1120 from every bottle of 750ml CINNAMON/ ARMOR herbal extracts  cleared in your MINI store</p>
                            </div>
                            <div className='flex flex-col'>
                                <p>c. The direct upline of the MINI STORE (depending on your package) may earn up to 7% of the PV that goes into UNILEVEL.
                                    that is; 7% of 2250PV </p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-primary font-semibold'>d. The indirect upline will earn 5% of the earnings, as prescribed in the UNILEVEL COMMISSION, continues up till  15 generations upward*</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-primary font-semibold'>e. Service Center Override</p>
                                <p>Earn 10% equivalent of what Mini Stores under you earn as fixed and one time MNI store   commissions/ Bonus
                                    Benefits for the Upline of a MAX STORE
                                    The direct upline of the MAX STORE earns up to 6% of the Unilevel PV generated.
                                    The indirect uplines earn 5%, with commissions continuing up to the 15th generation, in line with the Unilevel Commission structure.
                                    Additional Advantage: The entire 12,000 PV generated will count upwards towards Awards Qualification for everyone in the genealogy.</p>
                            </div>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <button className='bg-primary text-white py-2 rounded-4xl w-full'>Become a MINI STORE OWNER</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StockistUser
