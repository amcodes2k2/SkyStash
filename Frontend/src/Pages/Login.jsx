import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import toast from "react-hot-toast";
import LoginForm from "../Components/Forms/LoginForm";


function Login()
{
    const {state} = useLocation();

    useEffect(function(){
        if(state && state.requireLogin === true)
            toast.error("You must be logged in to access the Dashboard.");
    }, []);

    return(
        <div className="min-h-[calc(100dvh-4.5rem)] px-[2rem] py-[2rem] mt-[4.5rem] flex justify-center items-center">
            <div className="flex-col justify-items-center max-w-[350px] w-[350px] sm:max-w-[300px]">
                <h2 className="font-semibold text-2xl text-white text-center">
                    Log in to continue your journey with us
                </h2>

                <LoginForm></LoginForm>

                <div className="text-white text-base mt-[2rem]">
                    Don't have an account? <Link to="/signup" onClick={() => window.scrollTo(0, 0)}><button className="text-white underline cursor-pointer">
                        Sign up
                    </button></Link>
                </div>
            </div>
        </div>
    );
}

export default Login;