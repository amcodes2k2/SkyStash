import { Link } from "react-router-dom";

import { FaArrowLeftLong } from "react-icons/fa6";
import ForgotPasswordForm from "../Components/Forms/ForgotPasswordForm.jsx";

function ForgotPassword()
{
    return(
        <div className="min-h-[calc(100dvh-4.5rem)] px-[2rem] py-[2rem] mt-[4.5rem] flex justify-center items-center">
            <div className="flex-col justify-items-center max-w-[350px] w-[350px] sm:max-w-[300px]">
                <h2 className="font-semibold text-2xl text-white text-center">
                    Reset your password 
                </h2>
                
                <ForgotPasswordForm></ForgotPasswordForm>

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

export default ForgotPassword;