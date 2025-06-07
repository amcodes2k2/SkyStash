import toast from "react-hot-toast";

async function handleDeleteOnClick(file, displayData, setDisplayData, userDetails, setUserDetails, refreshToken, setDisplayStates, setFileStatus)
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
                ["isRunning"]: true
            };
        });
        setFileStatus((prevFileStatus) => {
            return {
                ...prevFileStatus,
                ["isDeleting"]: true
            };
        });

        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/delete-file/${file._id}`, {
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
            const newFiles = displayData.files.filter(function(f){
                return f._id !== file._id;
            });

            setDisplayStates((prevDisplayStates) => {
                return {
                    ...prevDisplayStates,
                    ["isRunning"]: false
                };
            });
            setDisplayData((prevDisplayData) => {
                return {
                    ...prevDisplayData,
                    ["files"]: newFiles
                };
            });
            setFileStatus((prevFileStatus) => {
                return {
                    ...prevFileStatus,
                    ["isDeleting"]: false
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
                setFileStatus((prevFileStatus) => {
                    return {
                        ...prevFileStatus,
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
                    ["isRunning"]: false
                };
            });
            setFileStatus((prevFileStatus) => {
                return {
                    ...prevFileStatus,
                    ["isDeleting"]: false
                };
            });
        }
    }
    catch(error)
    {
        setDisplayStates((prevDisplayStates) => {
            return {
                ...prevDisplayStates,
                ["isRunning"]: false
            };
        });
        setFileStatus((prevFileStatus) => {
            return {
                ...prevFileStatus,
                ["isDeleting"]: false
            };
        });

        if(!error?.response)
            toast.error("No response from server.");
    }
}

export default handleDeleteOnClick;