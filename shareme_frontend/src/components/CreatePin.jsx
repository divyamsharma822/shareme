import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";

import { categories } from "../utils/data";
import { client } from "../client";
import Spinner from "./Spinner";

const CreatePin = ({ user }) => {
    const [title, setTitle] = useState("");
    const [about, setAbout] = useState("");
    const [loading, setLoading] = useState(false);
    const [destination, setDestination] = useState();
    const [fields, setFields] = useState();
    const [category, setCategory] = useState();
    const [imageAsset, setImageAsset] = useState();
    const [wrongImageType, setWrongImageType] = useState(false);

    const navigate = useNavigate();

    const uploadImage = (e) => {
        const selectedFile = e.target.files[0];
        // uploading asset to sanity
        if (
            selectedFile.type === "image/png" ||
            selectedFile.type === "image/svg" ||
            selectedFile.type === "image/jpeg" ||
            selectedFile.type === "image/gif" ||
            selectedFile.type === "image/tiff"
        ) {
            setWrongImageType(false);
            setLoading(true);
            client.assets
                .upload("image", selectedFile, {
                    contentType: selectedFile.type,
                    filename: selectedFile.name,
                })
                .then((document) => {
                    setImageAsset(document);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log("Upload failed:", error.message);
                });
        } else {
            setLoading(false);
            setWrongImageType(true);
        }
    };

    const savePin = () => {
        if (title && about && destination && imageAsset?._id && category) {
            const doc = {
                _type: "pin",
                title,
                about,
                destination,
                image: {
                    _type: "image",
                    asset: {
                        _type: "reference",
                        _ref: imageAsset?._id,
                    },
                },
                userId: user._id,
                postedBy: {
                    _type: "postedBy",
                    _ref: user._id,
                },
                category,
            };
            client.create(doc).then(() => {
                navigate("/");
            });
        } else {
            setFields(true);

            setTimeout(() => {
                setFields(false);
            }, 2000);
        }
    };
    return (
        <div className='flex flex-col items-center justify-center mt-5 lg:h-4/5'>
            {fields && (
                <p className='mb-5 text-xl text-red-500 transition-all duration-150 ease-in '>
                    Please add all fields.
                </p>
            )}
            <div className='flex flex-col items-center justify-center w-full p-3 bg-white lg:flex-row lg:p-5 lg:w-4/5'>
                <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
                    <div className='flex flex-col items-center justify-center w-full p-3 border-2 border-gray-300 border-dotted h-420'>
                        {loading && <Spinner />}
                        {wrongImageType && <p>It&apos;s wrong file type.</p>}
                        {!imageAsset ? (
                            // eslint-disable-next-line jsx-a11y/label-has-associated-control
                            <label>
                                <div className='flex flex-col items-center justify-center h-full'>
                                    <div className='flex flex-col items-center justify-center'>
                                        <p className='text-2xl font-bold'>
                                            <AiOutlineCloudUpload />
                                        </p>
                                        <p className='text-lg'>
                                            Click to upload
                                        </p>
                                    </div>

                                    <p className='mt-32 text-center text-gray-400'>
                                        Recommendation: Use high-quality JPG,
                                        JPEG, SVG, PNG, GIF or TIFF less than
                                        20MB
                                    </p>
                                </div>
                                <input
                                    type='file'
                                    name='upload-image'
                                    onChange={uploadImage}
                                    className='w-0 h-0'
                                />
                            </label>
                        ) : (
                            <div className='relative h-full'>
                                <img
                                    src={imageAsset?.url}
                                    alt='uploaded-pic'
                                    className='w-full h-full'
                                />
                                <button
                                    type='button'
                                    className='absolute p-3 text-xl transition-all duration-500 ease-in-out bg-white rounded-full outline-none cursor-pointer bottom-3 right-3 hover:shadow-md'
                                    onClick={() => setImageAsset(null)}>
                                    <MdDelete />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className='flex flex-col flex-1 w-full gap-6 mt-5 lg:pl-5'>
                    <input
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Add your title'
                        className='p-2 text-2xl font-bold border-b-2 border-gray-200 outline-none sm:text-3xl'
                    />
                    {user && (
                        <div className='flex items-center gap-2 mt-2 mb-2 bg-white rounded-lg '>
                            <img
                                src={user.image}
                                className='w-10 h-10 rounded-full'
                                alt='user-profile'
                            />
                            <p className='font-bold'>{user.userName}</p>
                        </div>
                    )}
                    <input
                        type='text'
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder='Tell everyone what your Pin is about'
                        className='p-2 text-base border-b-2 border-gray-200 outline-none sm:text-lg'
                    />
                    <input
                        type='url'
                        vlaue={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder='Add a destination link'
                        className='p-2 text-base border-b-2 border-gray-200 outline-none sm:text-lg'
                    />

                    <div className='flex flex-col'>
                        <div>
                            <p className='mb-2 font-semibold text:lg sm:text-xl'>
                                Choose Pin Category
                            </p>
                            <select
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                }}
                                className='w-4/5 p-2 text-base border-b-2 border-gray-200 rounded-md outline-none cursor-pointer'>
                                <option
                                    value='others'
                                    className='bg-white sm:text-bg'>
                                    Select Category
                                </option>
                                {categories.map((item,index) => (
                                    <option
                                        key={index}
                                        className='text-base text-black capitalize bg-white border-0 outline-none '
                                        value={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='flex items-end justify-end mt-5'>
                            <button
                                type='button'
                                onClick={savePin}
                                className='p-2 font-bold text-white bg-red-500 rounded-full outline-none w-28'>
                                Save Pin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePin;
