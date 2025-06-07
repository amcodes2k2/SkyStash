import { useState, useEffect, createContext } from "react";

import toast from "react-hot-toast";
export const AppContext = createContext({});

function AppContextProvider({children})
{
    const [isLoading, setIsLoading] = useState(false);
    const [userDetails, setUserDetails] = useState({});

    async function sendOTP(user_id, email, type)
    {
        try
        {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/send-OTP`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({user_id: user_id, email: email, type: type})
            });

            const data = await response.json();

            if(data.success === true)
            {
                toast.success("Verify your email to continue.");
                return data;
            }
            else
            {
                if(response.status != 500)
                    toast.error(data.message);
                else
                    toast.error("Something went wrong with the server.")
            }
        }
        catch(error)
        {
            if(!error?.response)
                toast.error("No response from server.");
            else
                toast.error("Failed to send OTP.");
        }
    }

    async function refreshToken()
    {
        try
        {
            setIsLoading(true);

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/refresh-access-token`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if(data.success === true)
            {
                setIsLoading(false);
                setUserDetails(data.user);
            }
            else
            {
                setUserDetails({});
                setIsLoading(false);
                
                if(response.status === 500)
                    toast.error("Something went wrong with the server.");
            }
        }
        catch(error)
        {
            if(!error?.response)
                toast.error("No response from server.");
            
            setUserDetails({});
            setIsLoading(false);
        }
    }

    useEffect(function(){
        refreshToken();
    }, []);

    return(
        <AppContext.Provider 
            value={{isLoading, setIsLoading, userDetails, setUserDetails, refreshToken, sendOTP}}>
            {children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;