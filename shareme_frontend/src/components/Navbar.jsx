import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
    const navigate = useNavigate();

    if (user) {
        return (
            <div className='flex w-full gap-2 mt-5 md:gap-5 pb-7 '>
                <div className='flex items-center justify-start w-full px-2 bg-white border-2 rounded-md focus-within:shadow-sm'>
                    <IoMdSearch fontSize={24} className='ml-1' />
                    <input
                        type='text'
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder='Search'
                        value={searchTerm}
                        onFocus={() => navigate("/search")}
                        className='w-full p-2 bg-white outline-none'
                    />
                </div>
                <div className='flex gap-3 '>
                    <Link
                        to='/create-pin'
                        title="Create Post"
                        className='flex items-center justify-center w-12 h-12 text-white bg-[#060505d0] rounded-lg md:w-14 md:h-12'>
                        <IoMdAdd />
                    </Link>
                    <Link
                        to={`user-profile/${user?._id}`}
                        title="Profile"
                        className='hidden md:block'>
                        <img
                            src={user.image}
                            alt='user-pic'
                            className='h-12 rounded-lg w-14 '
                        />
                    </Link>
                </div>
            </div>
        );
    }

    return null;
};

export default Navbar;
