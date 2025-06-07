import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import { SyncLoader } from "react-spinners";
import { AppContext } from "../Context/AppContext.jsx";
import VerifyEmailForm from "../Components/Forms/VerifyEmailForm.jsx";

function VerifyEmail()
{
    const location = useLocation();
    const navigate = useNavigate();
    const {sendOTP} = useContext(AppContext);

    const [isRunning, setIsRunning] = useState(false);

    const userId = location?.state?.userId || null;

    useEffect(function(){
        if(userId === null)
            navigate("/");
    }, []);

    async function handleClick()
    {
        try
        {
            setIsRunning(true);

            await sendOTP(userId, undefined, "reset-password")
            .then((res) => {
                if(res.success === true)
                {
                    setIsRunning(false);
                    toast.success("OTP was resent successfully.");
                }
            });

            setIsRunning(false);
        }
        catch
        {
            setIsRunning(false);
            return;
        }
    }

    return(
        <div className="min-h-[calc(100dvh-4.5rem)] px-[2rem] py-[2rem] mt-[4.5rem] flex justify-center items-center">
            <div className="flex-col justify-items-center max-w-[350px] w-[350px] sm:max-w-[300px]">
                <h2 className="font-semibold text-2xl text-white text-center">
                    Verify email 
                </h2>
                
                <VerifyEmailForm userId={userId}></VerifyEmailForm>

                <div className="text-white text-center text-base mt-[2rem]">
                    Didn't receive the code? <br/>

                    <button disabled={isRunning} onClick={handleClick} className="text-white underline cursor-pointer">
                        {(isRunning === false) ? "Resend Code" : <SyncLoader color="white" size="5px"></SyncLoader>}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;