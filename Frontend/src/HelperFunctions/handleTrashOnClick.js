import toast from "react-hot-toast";

async function handleTrashOnClick(type, file, displayData, setDisplayData, userDetails, refreshToken, setDisplayStates, setFileStatus)
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
        if(type === "trash")
        {
            setFileStatus((prevFileStatus) => {
                return {
                    ...prevFileStatus,
                    ["isTrashing"]: true
                };
            });
        }
        else if(type === "restore")
        {
            setFileStatus((prevFileStatus) => {
                return {
                    ...prevFileStatus,
                    ["isRestoring"]: true
                };
            });
        }

        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/trash-file/${file._id}`, {
            method: "PATCH",
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
            if(type === "trash")
            {
                setFileStatus((prevFileStatus) => {
                    return {
                        ...prevFileStatus,
                        ["isTrashing"]: false
                    };
                });
            }
            else if(type === "restore")
            {
                setFileStatus((prevFileStatus) => {
                    return {
                        ...prevFileStatus,
                        ["isRestoring"]: false
                    };
                });
            }

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
            if(type === "trash")
            {
                setFileStatus((prevFileStatus) => {
                    return {
                        ...prevFileStatus,
                        ["isTrashing"]: false
                    };
                });
            }
            else if(type === "restore")
            {
                setFileStatus((prevFileStatus) => {
                    return {
                        ...prevFileStatus,
                        ["isRestoring"]: false
                    };
                });
            }
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
        
        if(type === "trash")
        {
            setFileStatus((prevFileStatus) => {
                return {
                    ...prevFileStatus,
                    ["isTrashing"]: false
                };
            });
        }
        else if(type === "restore")
        {
            setFileStatus((prevFileStatus) => {
                return {
                    ...prevFileStatus,
                    ["isRestoring"]: false
                };
            });
        }

        if(!error?.response)
            toast.error("No response from server.");
    }
}

export default handleTrashOnClick;