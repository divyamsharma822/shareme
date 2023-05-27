import React, { useEffect, useState } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";

const PinDetail = ({ user }) => {
    const { pinId } = useParams();
    const [pins, setPins] = useState();
    const [pinDetail, setPinDetail] = useState();
    const [comment, setComment] = useState("");
    const [addingComment, setAddingComment] = useState(false);

    const fetchPinDetails = () => {
        const query = pinDetailQuery(pinId);

        if (query) {
            client.fetch(`${query}`).then((data) => {
                setPinDetail(data[0]);
                console.log(data);
                if (data[0]) {
                    const query1 = pinDetailMorePinQuery(data[0]);
                    client.fetch(query1).then((res) => {
                        setPins(res);
                    });
                }
            });
        }
    };

    useEffect(() => {
        fetchPinDetails();
    }, [pinId]);

    const addComment = () => {
        if (comment) {
            setAddingComment(true);

            client
                .patch(pinId)
                .setIfMissing({ comments: [] })
                .insert("after", "comments[-1]", [
                    {
                        comment,
                        _key: uuidv4(),
                        postedBy: { _type: "postedBy", _ref: user._id },
                    },
                ])
                .commit()
                .then(() => {
                    fetchPinDetails();
                    setComment("");
                    setAddingComment(false);
                });
        }
    };

    if (!pinDetail) {
        return <Spinner message='Showing pin' />;
    }

    return (
        <>
            {pinDetail && (
                <div
                    className='flex flex-col m-auto bg-white xl:flex-row'
                    style={{ maxWidth: "1500px", borderRadius: "32px" }}>
                    <div className='flex items-center justify-center flex-initial md:items-start'>
                        <img
                            className='rounded-b-lg rounded-t-3xl'
                            src={
                                pinDetail?.image &&
                                urlFor(pinDetail?.image).url()
                            }
                            alt='user-post'
                        />
                    </div>
                    <div className='flex-1 w-full p-5 xl:min-w-620'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <a
                                    href={`${pinDetail.image.asset.url}?dl=`}
                                    title="Download"
                                    download
                                    className='flex items-center justify-center p-2 text-xl rounded-full opacity-75 bg-secondaryColor text-dark hover:opacity-100'>
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                            <a
                                href={pinDetail.destination}
                                target='_blank'
                                rel='noreferrer'>
                                {pinDetail.destination?.slice(8)}
                            </a>
                        </div>
                        <div>
                            <h1 className='mt-3 text-4xl font-bold break-words'>
                                {pinDetail.title}
                            </h1>
                            <p className='mt-3'>{pinDetail.about}</p>
                        </div>
                        <Link
                            to={`/user-profile/${pinDetail?.postedBy._id}`}
                            className='flex items-center gap-2 mt-5 bg-white rounded-lg '>
                            <img
                                src={pinDetail?.postedBy.image}
                                className='w-10 h-10 rounded-full'
                                alt='user-profile'
                            />
                            <p className='font-bold'>
                                {pinDetail?.postedBy.userName}
                            </p>
                        </Link>
                        <h2 className='mt-5 text-2xl'>Comments</h2>
                        <div className='overflow-y-auto max-h-370'>
                            {pinDetail?.comments?.map((item) => (
                                <div
                                    className='flex items-center gap-2 mt-5 bg-white rounded-lg'
                                    key={item.comment}>
                                    <img
                                        src={item.postedBy?.image}
                                        className='w-10 h-10 rounded-full cursor-pointer'
                                        alt='user-profile'
                                    />
                                    <div className='flex flex-col'>
                                        <p className='font-bold'>
                                            {item.postedBy?.userName}
                                        </p>
                                        <p>{item.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='flex flex-wrap gap-3 mt-6'>
                            <Link to={`/user-profile/${user._id}`}>
                                <img
                                    src={user.image}
                                    className='w-10 h-10 rounded-full cursor-pointer'
                                    alt='user-profile'
                                />
                            </Link>
                            <input
                                className='flex-1 p-2 border-2 border-gray-100 outline-none rounded-2xl focus:border-gray-300'
                                type='text'
                                placeholder='Add a comment'
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <button
                                type='button'
                                className='px-6 py-2 text-base font-semibold text-white bg-red-500 rounded-full outline-none'
                                onClick={addComment}>
                                {addingComment ? "Doing..." : "Done"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {pins?.length > 0 && (
                <h2 className='mt-8 mb-4 text-2xl font-bold text-center'>
                    More like this
                </h2>
            )}
            {pins ? (
                <MasonryLayout pins={pins} />
            ) : (
                <Spinner message='Loading more pins' />
            )}
        </>
    );
};

export default PinDetail;
