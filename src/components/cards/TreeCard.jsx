import React from 'react';
import { Popover } from "@headlessui/react";
import { useFloating, flip, shift, autoUpdate } from "@floating-ui/react";

const TreeCard = ({ user, isExpanded, onToggle, hasChildren }) => {
    const { refs, floatingStyles } = useFloating({
        middleware: [flip(), shift()],
        whileElementsMounted: autoUpdate,
    });

    console.log("user in card", user)

    return (
        <Popover as="div" className="relative z-1 inline-block text-left w-full">
            <Popover.Button
                as="div"
                title={`View ${user.username} info`}
                ref={refs.setReference}
                className="group bg-primary text-tetiary cursor-pointer thiscard rounded-full transition-all duration-300 w-[200px] relative text-sm p-2"
            >
                <div className="flex flex-row gap-3 items-center">
                    <div className="md:w-11 w-10 md:h-11 h-10 rounded-full border-2 border-[#D9D9D9] bg-[#D9D9D9] text-primary overflow-hidden uppercase font-extrabold flex items-center justify-center">
                        <h3>{`${user?.fullname?.split(" ")[0].charAt(0)}${user?.fullname?.split(" ")[1]?.charAt(0) || ''}`}</h3>
                    </div>
                    <div className="">
                        <h3 className="font-semibold text-center border-b mb-0.5">@{user.username}</h3>
                        <small className="flex items-center gap-2 font-semibold text-pryClr">
                            <span>Left: {user.left_count}</span>
                            <hr className='h-3 border-0 border-r-2' />
                            <span>Right: {user.right_count}</span>
                        </small>
                    </div>
                </div>
                {hasChildren && (
                    <div className="flex justify-center absolute top-0">
                        <button
                            onClick={() => onToggle(user.id)}
                            className={`p-2 rounded-lg bg-pryClr cursor-pointer text-white hover:shadow-md transition-all duration-200`}
                        >
                            click
                            {/* {isExpanded ? <BsChevronDown size={16} /> : <BsChevronRight size={16} />} */}
                        </button>
                    </div>
                )}
            </Popover.Button>
            {isExpanded && user.left && <div className="absolute left-[49%] -translate-x-1/2 -bottom-7 w-[1px] h-8 bg-black -z-1"></div>}
            {isExpanded && user.right && <div className="absolute left-[59%] -translate-x-1/2 -bottom-7 w-[1px] h-8 bg-black -z-1"></div>}

            <Popover.Panel
                ref={refs.setFloating}
                style={floatingStyles}
                className="absolute z-1000 w-[250px] mt-3 px-4 py-2 bg-white border border-gray-200 rounded-md shadow-lg"
            >
                {/* Popover content */}
                <div className="font-semibold text-sm mb-2">User Details</div>
                <div className="space-y-1 text-xs text-gray-700">
                    <p><strong>Name:</strong> {user.fullname}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Personal PV:</strong> {Number(user?.personal_pv)}</p>
                    {/* <p><strong>Group PV:</strong> {Number(user.total_pv_left) + Number(user.total_pv_right)} &#40;left:{user.total_pv_left} right:{user.total_pv_right}&#41;</p> */}
                    <p><strong>Package:</strong> {user.plan || "-"}</p>
                    <p><strong>Rank:</strong> {!user.rank ? "No Rank" : user.rank || "-"}</p>
                </div>

            </Popover.Panel>
        </Popover>
    )
}

export default TreeCard