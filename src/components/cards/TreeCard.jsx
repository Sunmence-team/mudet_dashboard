import React from 'react';
import { Popover } from "@headlessui/react";
import { useFloating, flip, shift, autoUpdate } from "@floating-ui/react";
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6';

const TreeCard = ({ user, isExpanded, onToggle, hasChildren }) => {
    const { refs, floatingStyles } = useFloating({
        middleware: [flip(), shift()],
        whileElementsMounted: autoUpdate,
    });

    return (
        <Popover as="div" className="relative -z-10 inline-block text-left w-full">
            <Popover.Button
                as="div"
                title={`View ${user.username} info`}
                ref={refs.setReference}
                className="group bg-primary text-tetiary thiscard cursor-pointer rounded-lg transition-all duration-300 w-[180px] min-h-[90px] relative text-sm p-2 pt-6"
            >
                <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 md:w-18 w-18 md:h-18 h-18 rounded-full border-2 border-primary bg-tetiary overflow-hidden flex items-center justify-center">
                    <h3 className='text-primary text-2xl uppercase font-extrabold'>{`${user?.fullname?.split(" ")[0].charAt(0)}${user?.fullname?.split(" ")[1]?.charAt(0) || ''}`}</h3>
                </div>
                <div className="">
                    <h3 className="font-medium text-center mt-1 capitalize line-clamp-1">{user.fullname}</h3>
                    <small className="flex items-center justify-center gap-2 font-medium text-pryClr">
                        <span>Left: {user.left_count}</span>
                        <hr className='h-3 border-0 border-r-2' />
                        <span>Right: {user.right_count}</span>
                    </small>
                    {hasChildren && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggle(user.id)
                            }}
                            className={`w-12 h-4 mx-auto flex translate-y-2.5 items-center justify-center rounded-t bg-secondary cursor-pointer text-white hover:shadow-md transition-all duration-200`}
                        >
                            {isExpanded ? <FaCaretDown size={16} /> : <FaCaretUp size={16} />}
                        </button>
                    )}
                </div>
            </Popover.Button>
            {isExpanded && user.left && <div className="absolute -Z-[1] left-1/2 -translate-x-1/2 -bottom-8 h-8 w-[1px] bg-black"></div>}
            <Popover.Panel
                ref={refs.setFloating}
                style={floatingStyles}
                className="absolute z-100 w-[250px] mt-3 px-4 py-2 bg-tetiary border border-gray-200 rounded-md shadow-lg"
            >
                <div className="font-semibold text-sm mb-2">User Details</div>
                <div className="space-y-1 text-xs text-gray-800">
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Name:</strong> {user.fullname}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Personal PV:</strong> {Number(user?.personal_pv)}</p>
                    <p><strong>Package:</strong> {user.plan || "-"}</p>
                    <p><strong>Rank:</strong> {!user.rank ? "No Rank" : user.rank || "-"}</p>
                </div>

            </Popover.Panel>
        </Popover>
    )
}

export default TreeCard




 {/* <div className="flex flex-row gap-3 items-center">
                    <div className="md:w-11 w-10 md:h-11 h-10 rounded-full border-2 border-[#D9D9D9] bg-[#D9D9D9] text-primary overflow-hidden uppercase font-extrabold flex items-center justify-center">
                        <h3>{`${user?.fullname?.split(" ")[0].charAt(0)}${user?.fullname?.split(" ")[1]?.charAt(0) || ''}`}</h3>
                    </div>
                    <div className="relative pe-1">
                        <h3 className="font-semibold text-center border-b pb-1 mb-1">@{user.username}</h3>
                        <small className="flex items-center justify-between gap-2 font-semibold text-pryClr">
                            <span>Left: {user.left_count}</span>
                            <hr className='h-3 border-0 border-r-2' />
                            {hasChildren && (
                                <button
                                    onClick={() => onToggle(user.id)}
                                    className={`w-6 h-6 flex translate-y-2 items-center justify-center rounded-t bg-secondary cursor-pointer text-white hover:shadow-md transition-all duration-200`}
                                >
                                    {isExpanded ? <BsChevronDown size={16} /> : <BsChevronDown size={16} />}
                                </button>
                            )}
                            <span>Right: {user.right_count}</span>
                        </small>
                    </div>
                </div> */}