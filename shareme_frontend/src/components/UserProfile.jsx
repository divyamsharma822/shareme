import React, { useEffect, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";

import {
    userCreatedPinsQuery,
    userQuery,
    userSavedPinsQuery,
} from "../utils/data";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const activeBtnStyles =
    "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
    "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = () => {
    const [user, setUser] = useState();
    const [pins, setPins] = useState();
    const [text, setText] = useState("Created");
    const [activeBtn, setActiveBtn] = useState("created");
    const navigate = useNavigate();
    const { userId } = useParams();

    const User =
        localStorage.getItem("user") !== "undefined"
            ? JSON.parse(localStorage.getItem("user"))
            : localStorage.clear();

    useEffect(() => {
        const query = userQuery(userId);
        client.fetch(query).then((data) => {
            setUser(data[0]);
        });
    }, [userId]);

    useEffect(() => {
        if (text === "Created") {
            const createdPinsQuery = userCreatedPinsQuery(userId);

            client.fetch(createdPinsQuery).then((data) => {
                setPins(data);
            });
        } else {
            const savedPinsQuery = userSavedPinsQuery(userId);

            client.fetch(savedPinsQuery).then((data) => {
                setPins(data);
            });
        }
    }, [text, userId]);

    const logout = () => {
        googleLogout();
        localStorage.clear();
        navigate("/login");
    };

    if (!user) return <Spinner message='Loading profile' />;

    return (
        <div className='relative items-center justify-center h-full pb-2'>
            <div className='flex flex-col pb-5'>
                <div className='relative flex flex-col mb-7'>
                    <div className='flex flex-col items-center justify-center'>
                        <img
                            className='object-cover w-full shadow-lg h-370 2xl:h-510'
                            src='https://source.unsplash.com/1600x900/?nature,photography,technology'
                            alt='user-pic'
                        />
                        <img
                            className='object-cover w-20 h-20 -mt-10 rounded-full shadow-xl'
                            src={user.image}
                            alt='user-pic'
                        />
                    </div>
                    <h1 className='mt-3 text-3xl font-bold text-center'>
                        {user.userName}
                    </h1>
                    <div className='absolute top-0 right-0 p-2 z-1'>
                        {userId === User.id && (
                            <button
                                type='button'
                                className='p-2 bg-white rounded-full shadow-md outline-none cursor-pointer'
                                onClick={logout}>
                                <AiOutlineLogout color='red' fontSize={21} />
                            </button>
                        )}
                    </div>
                </div>
                <div className='text-center mb-7'>
                    <button
                        type='button'
                        onClick={(e) => {
                            setText(e.target.textContent);
                            setActiveBtn("created");
                        }}
                        className={`${
                            activeBtn === "created"
                                ? activeBtnStyles
                                : notActiveBtnStyles
                        }`}>
                        Created
                    </button>
                    <button
                        type='button'
                        onClick={(e) => {
                            setText(e.target.textContent);
                            setActiveBtn("saved");
                        }}
                        className={`${
                            activeBtn === "saved"
                                ? activeBtnStyles
                                : notActiveBtnStyles
                        }`}>
                        Saved
                    </button>
                </div>

                <div className='px-2'>
                    <MasonryLayout pins={pins} />
                </div>

                {pins?.length === 0 && (
                    <div className='flex items-center justify-center w-full mt-2 font-bold text-1xl'>
                        No Pins Found!
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
