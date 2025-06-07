import toast from "react-hot-toast";

async function handleEmptyBinOnClick(setDisplayData, userDetails, setUserDetails, refreshToken, setDisplayStates)
{
    try
    {
        if(Object.keys(userDetails).length === 0)
        {
            navigate("/login");
            window.scrollTo(0, 0);
            toast.error("You must be logged in.");

            return;
        }

        setDisplayStates((prevDisplayStates) => {
            return {
                ...prevDisplayStates,
                ["isRunning"]: true,
                ["isClearing"]: true
            };
        });

        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/empty-trash`, {
            method: "DELETE",
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
            setDisplayStates((prevDisplayStates) => {
                return {
                    ...prevDisplayStates,
                    ["isRunning"]: false,
                    ["isClearing"]: false
                };
            });
            setDisplayData((prevDisplayData) => {
                return {
                    ...prevDisplayData,
                    ["files"]: []
                };
            });
            setUserDetails((prevUserDetails) => {
                return {
                    ...prevUserDetails,
                    ["spaceConsumed"]: data.newSpaceConsumed
                };
            });

            toast.success(data.message);
        }
        else
        {
            if(response.status === 401)
            {
                await refreshToken();
                setDisplayStates((prevDisplayStates) => {
                    return {
                        ...prevDisplayStates,
                        ["shouldRetry"]: true
                    };
                });
                
                return;
            }

            if(response.status !== 500)
                toast.error(data.message);
            else
                toast.error("Something went wrong with the server.");

            setDisplayStates((prevDisplayStates) => {
                return {
                    ...prevDisplayStates,
                    ["isRunning"]: false,
                    ["isClearing"]: false
                };
            });
        }
    }
    catch(error)
    {
        setDisplayStates((prevDisplayStates) => {
            return {
                ...prevDisplayStates,
                ["isRunning"]: false,
                ["isClearing"]: false
            };
        });

        if(!error?.response)
            toast.error("No response from server.");
    }
}

export default handleEmptyBinOnClick;