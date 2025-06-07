import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { FaArrowLeftLong } from "react-icons/fa6";
import ResetPasswordForm from "../Components/Forms/ResetPasswordForm.jsx";

function ResetPassword()
{
    const location = useLocation();
    const navigate = useNavigate();

    const resetPasswordToken = location?.state?.resetPasswordToken || null;

    useEffect(function(){
        if(resetPasswordToken === null)
            navigate("/");
    }, []);
    
    return(
        <div className="min-h-[calc(100dvh-4.5rem)] px-[2rem] py-[2rem] mt-[4.5rem] flex justify-center items-center">
            <div className="flex-col justify-items-center max-w-[350px] w-[350px] sm:max-w-[300px]">
                <h2 className="font-semibold text-2xl text-white text-center">
                    Choose new password
                </h2>

                <ResetPasswordForm resetPasswordToken={resetPasswordToken}></ResetPasswordForm>

                <div className="text-white text-base mt-[1.5rem] w-[100%]">
                    <Link to="/login" onClick={() => window.scrollTo(0, 0)}>
                        <button className="cursor-pointer flex items-center gap-2">
                            <FaArrowLeftLong className="cursor-pointer"></FaArrowLeftLong> 
                            Back to login 
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;