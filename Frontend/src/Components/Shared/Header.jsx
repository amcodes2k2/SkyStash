import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

import toast from "react-hot-toast";
import logo from "../../Assets/Images/Logo_Full_Dark.png";
import { AppContext } from "../../Context/AppContext.jsx";

function Header()
{
    const navigate = useNavigate();

    const [isRunning, setIsRunning] = useState(false);
    const [shouldRetry, setShouldRetry] = useState(false);

    const {userDetails, setUserDetails, refreshToken} = useContext(AppContext);

    async function logOut()
    {
        try
        {
            setIsRunning(true);
            
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/logout`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userDetails.accessToken}`
                }
            });

            const data = await response.json();
            
            if(data.success === true)
            {
                setUserDetails({});
                setIsRunning(false);

                navigate("/");
                window.scrollTo(0, 0);
                toast.success("Logged out successfully.");
            }
            else
            {
                setIsRunning(false);

                if(response.status === 401)
                {
                    if(Object.keys(userDetails).length === 0)
                    {
                        setShouldRetry(false);
                        setIsHamburgerMenuOpen(false);

                        navigate("/");
                        window.scrollTo(0, 0);
                        toast.success("Logged out successfully.");
                    }
                    else
                    {
                        await refreshToken();
                        setShouldRetry(true);
                        return;
                    }
                }
                    
                if(response.status !== 500)
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
        }
    }

    useEffect(function(){
        if(shouldRetry === true)
           logOut();
    }, [shouldRetry]);

    return(
        <div className="w-[100%] fixed top-0">
            <header className="w-[100%] bg-white flex-col">
                <div className="w-[100%] flex items-center justify-between px-[5rem] sm:px-[1rem]">
                    <Link to="/" onClick={() => window.scrollTo(0, 0)}><img src={logo} className="h-[45px] cursor-pointer"></img></Link>

                    <div className="flex gap-2 sm:gap-0 py-[0.8rem] md:py-[0.76rem]">
                        <Link to={`${(Object.keys(userDetails).length > 0) ? "/dashboard" : "/login"}`} 
                            onClick={() => window.scrollTo(0, 0)}>
                            <button className="flex font-semibold text-base px-[0.5rem] py-[0.7rem] cursor-pointer">
                                {
                                    (Object.keys(userDetails).length > 0) ? "Dashboard" : "Log in"
                                }
                            </button>
                        </Link>

                        {
                            (Object.keys(userDetails).length === 0) ?
                            <Link to="/signup" 
                                onClick={() => window.scrollTo(0, 0)}>
                                <button className="flex font-semibold text-base px-[0.5rem] py-[0.7rem] cursor-pointer">
                                    Sign up
                                </button>
                            </Link>
                            :
                            <button 
                                onClick={logOut}
                                disabled={isRunning}
                                className="flex font-semibold text-base px-[0.5rem] py-[0.7rem] cursor-pointer">
                                Log out
                            </button>
                        }
                    </div>
                </div>
            </header>
        </div>
    );
}

export default Header;