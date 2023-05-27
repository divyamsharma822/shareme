import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

import { client, urlFor } from "../client";

const Pin = ({ pin }) => {
    const [postHovered, setPostHovered] = useState(false);
    const [savingPost, setSavingPost] = useState(false);

    const navigate = useNavigate();

    const { postedBy, image, _id, destination } = pin;

    const user =
        localStorage.getItem("user") !== "undefined"
            ? JSON.parse(localStorage.getItem("user"))
            : localStorage.clear();

    const deletePin = (id) => {
        client.delete(id).then(() => {
            window.location.reload();
        });
    };

    let alreadySaved = pin?.save?.filter(
        (item) => item?.postedBy?._id === user?.id
    );

    alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

    const savePin = (id) => {
        if (alreadySaved?.length === 0) {
            setSavingPost(true);

            client
                .patch(id)
                .setIfMissing({ save: [] })
                .insert("after", "save[-1]", [
                    {
                        _key: uuidv4(),
                        userId: user?.id,
                        postedBy: {
                            _type: "postedBy",
                            _ref: user?.id,
                        },
                    },
                ])
                .commit()
                .then(() => {
                    window.location.reload();
                    setSavingPost(false);
                });
        }
    };

    return (
        <div className='m-2'>
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className='relative w-auto overflow-hidden transition-all duration-500 ease-in-out rounded-lg cursor-zoom-in hover:shadow-lg'>
                {image && (
                    <img
                        className='w-full rounded-lg '
                        src={urlFor(image).width(250).url()}
                        alt='user-post'
                        loading="lazy"
                    />
                )}
                {postHovered && (
                    <div
                        className='absolute top-0 z-50 flex flex-col justify-between w-full h-full p-1 pt-2 pb-2 pr-2'
                        style={{ height: "100%" }}>
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-2'>
                                <a
                                    href={`${image?.asset?.url}?dl=`}
                                    download
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    className='flex items-center justify-center p-2 text-xl bg-white rounded-full outline-none opacity-75 w-9 h-9 text-dark hover:opacity-100 hover:shadow-md'>
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                            {alreadySaved?.length !== 0 ? (
                                <button
                                    type='button'
                                    className='px-5 py-1 text-base font-bold text-white bg-red-500 outline-none opacity-70 hover:opacity-100 rounded-3xl hover:shadow-md'>
                                    {pin?.save?.length} Saved
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        savePin(_id);
                                    }}
                                    type='button'
                                    className='px-5 py-1 text-base font-bold text-white bg-red-500 outline-none opacity-70 hover:opacity-100 rounded-3xl hover:shadow-md'>
                                    {pin?.save?.length}{" "}
                                    {savingPost ? "Saving" : "Save"}
                                </button>
                            )}
                        </div>
                        <div className='flex items-center justify-between w-full gap-2 '>
                            {destination?.slice(8).length > 0 ? (
                                <a
                                    href={destination}
                                    target='_blank'
                                    className='flex items-center gap-2 p-2 pl-4 pr-4 font-bold text-black bg-white rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
                                    rel='noreferrer'>
                                    {" "}
                                    <BsFillArrowUpRightCircleFill />
                                    {destination?.slice(8, 17)}...
                                </a>
                            ) : undefined}
                            {postedBy?._id === user?.googleId && (
                                <button
                                    type='button'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deletePin(_id);
                                    }}
                                    className='flex items-center justify-center w-8 h-8 p-2 bg-white rounded-full outline-none opacity-75 text-dark hover:opacity-100'>
                                    <AiTwotoneDelete />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Link
                to={`/user-profile/${postedBy?._id}`}
                className='flex items-center gap-2 mt-2'>
                <img
                    className='object-cover w-8 h-8 rounded-full'
                    src={postedBy?.image}
                    alt='user-profile'
                />
                <p className='font-semibold capitalize'>{postedBy?.userName}</p>
            </Link>
        </div>
    );
};

export default Pin;
