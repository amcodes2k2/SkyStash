import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import toast from "react-hot-toast";
import { SyncLoader } from "react-spinners";
import { AppContext } from "../../Context/AppContext.jsx";

function LoginForm()
{
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [isRunning, setIsRunning] = useState(false);

    const navigate = useNavigate();
    const {setUserDetails, sendOTP} = useContext(AppContext);

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

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/login`, {
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
                setIsRunning(false);
                setUserDetails(data.user);
                
                window.scrollTo(0, 0);
                navigate("/dashboard");
                toast.success("Logged in successfully.");
            }
            else
            {
                setUserDetails({});

                if(response.status === 403)
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
        }
        catch(error)
        {
            setUserDetails({});
            setIsRunning(false);

            if(!error?.response)
                toast.error("No response from server.");
            else
                toast.error("Login failed.");
        }
    }

    return(
        <div className="mt-[3rem] flex justify-center w-[100%]">
            <form className="w-[100%]" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="text-base text-white">Email</label> <br/>
                    <input id="email" type="email" minLength="3" maxLength="254" value={formData.email} onChange={handleChange} placeholder="Enter email address" className="text-base bg-[#151b23] border-b border-white outline-none text-white mt-[0.5rem] mb-[1rem] w-[100%] py-[0.8rem] rounded-md indent-3"></input> <br/>

                    <label htmlFor="password" className="text-base text-white">Password</label> <br/>
                    <input id="password" type="password" minLength="8" maxLength="64" value={formData.password} onChange={handleChange} placeholder="Enter password" className="text-base bg-[#151b23] border-b border-white outline-none text-white mt-[0.5rem] w-[100%] py-[0.8rem] rounded-md indent-3"></input>
                </div>

                <div className="flex justify-end mt-[0.5rem]">
                    <Link to="/forgot-password" onClick={() => window.scrollTo(0, 0)}>
                        <button type="button" className="text-base text-white">
                            Forgot password
                        </button>
                    </Link>
                </div>

                <button 
                    type="submit" 
                    disabled={isRunning}
                    className="w-[100%] bg-[#0061FE] mt-[2rem] py-[0.8rem] font-semibold text-base text-white rounded-lg cursor-pointer">
                    {(isRunning === false) ? "Log in" : <SyncLoader color="white" size="5px"></SyncLoader>}
                </button>
            </form>
        </div>
    );
}

export default LoginForm;