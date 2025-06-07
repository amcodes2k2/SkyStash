import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import { SyncLoader } from "react-spinners";
import { AppContext } from "../../Context/AppContext.jsx";

function SignupForm()
{
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [isRunning, setIsRunning] = useState(false);

    const navigate = useNavigate();
    const {sendOTP} = useContext(AppContext);
    
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

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/signup`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if(data.success === true)
            {
                await sendOTP(data.user_id, undefined, "signup")
                .then((res) => {
                    if(res.success === true)
                    {
                        setIsRunning(false);

                        window.scrollTo(0, 0);
                        navigate(`/verify-email/signup`, {state: {userId: res.user_id}});
                    }
                });

                setIsRunning(false);
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
                toast.error("Signup failed.");
        }
    }

    return(
        <div className="mt-[3rem] flex justify-center w-[100%]">
            <form className="w-[100%]" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className="text-base text-white">Full name</label> <br/>
                    <input id="name" type="text" minLength="1" maxLength="71" value={formData.name} onChange={handleChange} placeholder="Enter full name" className="text-base bg-[#151b23] border-b border-white outline-none text-white mt-[0.5rem] mb-[1rem] w-[100%] py-[0.8rem] rounded-md indent-3"></input> <br/>

                    <label htmlFor="email" className="text-base text-white">Email address</label> <br/>
                    <input id="email" type="email" value={formData.email} minLength="3" maxLength="254" onChange={handleChange} placeholder="Enter email address" className="text-base bg-[#151b23] border-b border-white outline-none text-white mt-[0.5rem] mb-[1rem] w-[100%] py-[0.8rem] rounded-md indent-3"></input> <br/>

                    <label htmlFor="password" className="text-base text-white">Password</label> <br/>
                    <input id="password" type="password" minLength="8" maxLength="64" value={formData.password} onChange={handleChange} placeholder="Enter password" className="text-base bg-[#151b23] border-b border-white outline-none text-white mt-[0.5rem] w-[100%] py-[0.8rem] rounded-md indent-3"></input>
                </div>
                
                <button type="submit" disabled={isRunning} className="w-[100%] bg-[#0061FE] text-white mt-[2rem] py-[0.7rem] font-semibold rounded-lg cursor-pointer">
                    {(isRunning === false) ? "Create Account" : <SyncLoader color="white" size="5px"></SyncLoader>}
                </button>
            </form>
        </div>
    );
}

export default SignupForm;