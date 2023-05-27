import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import { client } from "../client";

const Login = () => {
    const navigate = useNavigate();

    const login = useGoogleLogin({
        onSuccess: async (res) => {
            const user = await fetch(
                `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${res.access_token}`
            ).then((response) => {
                return response.json();
            });
            localStorage.setItem("user", JSON.stringify(user));
            const { name, id, picture } = user;
            const doc = {
                _id: id,
                _type: "user",
                userName: name,
                image: picture,
            };
            client.createIfNotExists(doc).then(() => {
                navigate("/", { replace: true });
            });
        },
        onError: (error) => alert("Login Failed, Try Again"),
    });

    return (
        <div className='flex flex-col items-center justify-start h-screen'>
            <div className='relative w-full h-full'>
                <video
                    src={shareVideo}
                    type='video/mp4'
                    loop
                    controls={false}
                    muted
                    autoPlay
                    className='object-cover w-full h-full'
                />

                <div className='absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center bg-blackOverlay'>
                    <div className='p-5'>
                        <img src={logo} width='130px' alt='logo' />
                    </div>
                    <div className='shadow-2xl'>
                        <button
                            type='button'
                            onClick={() => login()}
                            className='flex items-center justify-center p-3 rounded-lg outline-none cursor-pointer bg-mainColor'>
                            <FcGoogle className='mr-4' /> Sign in with google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
