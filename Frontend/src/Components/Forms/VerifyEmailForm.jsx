import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import { SyncLoader } from "react-spinners";

function VerifyEmailForm(props)
{
    const [formData, setFormData] = useState({
        code: ""
    });
    const [isRunning, setIsRunning] = useState(false);

    const {userId} = props;
    const navigate = useNavigate();
    const location = useLocation();
        
    function handleChange(event)
    {
        setFormData(function(prevFormData){
            return {
                ...prevFormData,
                [event.target.id]: event.target.value
            };
        });
    }
    
    async function handleSubmit(event)
    {
        try
        {
            setIsRunning(true);
            event.preventDefault();

            const type = (location.pathname.includes("signup") === true) ? "signup" : "reset-password";

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/verify-OTP`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({user_id: userId, OTP: formData.code, type: type})
            });

            const data = await response.json();

            if(data.success === true)
            {
                setIsRunning(false);

                if(type === "signup")
                {
                    //clearing the userId from location.state
                    navigate(location.pathname, {replace: true}); //does not take us to home as useEffect runs only on the 1st render
                    
                    navigate("/login");
                    window.scrollTo(0, 0);
                    toast.success("Account created successfully.");
                }
                else
                {
                    window.scrollTo(0, 0);
                    navigate(`/reset-password`, {state: {resetPasswordToken: data.resetPasswordToken}});
                    
                    toast.success("OTP verifed successfully.");
                }
            }
            else
            {
                setIsRunning(false);
                
                if(response.status != 500)
                    toast.error(data.message);
                else
                    toast.error("Something went wrong with the server.");
            }
        }
        catch(error)
        {
            setIsRunning(false);

            if(!error?.response)
                toast.error("No response from server.");
            else
                toast.error("OTP verification failed.");
        }
    }

    return(
        <div className="mt-[2rem] flex justify-center w-[100%]">
            <form className="w-[100%]" onSubmit={handleSubmit}>
                <div>
                    <p className="text-base text-white text-center">
                        Enter the 6-digit code we sent to your email.
                    </p>

                    <p className="text-sm text-white text-center mt-[0.5rem]">
                        (Make sure to check Spam folder too)
                    </p>

                    <input id="code" type="password" minLength="6" maxLength="6" value={formData.code} onChange={handleChange} placeholder="6-digit code" className="text-base bg-[#151b23] border-b border-white outline-none text-white mt-[2rem] mb-[1rem] w-[100%] py-[0.8rem] rounded-md indent-3"></input> <br/>
                </div>
                
                <button type="submit" className="w-[100%] bg-[#0061FE] mt-[1rem] py-[0.8rem] text-white rounded-lg cursor-pointer">
                    {(isRunning === false) ? "Submit" : <SyncLoader color="white" size="5px"></SyncLoader>}
                </button>
            </form>
        </div>
    );
}

export default VerifyEmailForm;