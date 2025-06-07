import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import { SyncLoader } from "react-spinners";

function ResetPasswordForm(props)
{
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [isRunning, setIsRunning] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const {resetPasswordToken} = props;
        
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

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/reset-password`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    newPassword: formData.newPassword, 
                    confirmPassword: formData.confirmPassword,
                    resetPasswordToken: resetPasswordToken
                })
            });

            const data = await response.json();

            if(data.success === true)
            {
                setIsRunning(false);
                //clearing the token from location.state
                navigate(location.pathname, {replace: true}); //does not take us to home as useEffect runs only on the 1st render

                navigate("/login");
                window.scrollTo(0, 0);
                toast.success("Password changed successfully.");
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
                toast.error("Failed to reset password.");
        }
    }

    return(
        <div className="mt-[3rem] flex justify-center w-[100%]">
            <form className="w-[100%]" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="newPassword" className="text-base text-white">New Password</label> <br/>
                    <input id="newPassword" type="password" minLength="8" maxLength="64" value={formData.newPassword} onChange={handleChange} placeholder="Enter new password" className="text-base bg-[#151b23] border-b border-white outline-none text-white mt-[0.5rem] mb-[1rem] w-[100%] py-[0.8rem] rounded-md indent-3"></input> <br/>

                    <label htmlFor="confirmPassword" className="text-base text-white">Confirm Password</label> <br/>
                    <input id="confirmPassword" type="password" minLength="8" maxLength="64" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter new password" className="text-base bg-[#151b23] border-b border-white outline-none text-white mt-[0.5rem] w-[100%] py-[0.8rem] rounded-md indent-3"></input>
                </div>
                
                <button type="submit" className="w-[100%] bg-[#0061FE] border-[#b1e50e] mt-[2rem] py-[0.8rem] font-semibold text-base text-white rounded-lg cursor-pointer">
                    {(isRunning === false) ? "Reset Password" : <SyncLoader color="white" size="5px"></SyncLoader>}
                </button>
            </form>
        </div>
    );
}

export default ResetPasswordForm;