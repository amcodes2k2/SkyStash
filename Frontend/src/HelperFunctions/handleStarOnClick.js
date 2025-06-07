import toast from "react-hot-toast";

async function handleStarOnClick(file, displayData, setDisplayData, userDetails, refreshToken, setDisplayStates, setFileStatus)
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

        if(file.isTrash === true)
        {
            toast.error("Restore the File/Folder to change starred status.");
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
                ["isStarring"]: true
            };
        });

        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/star-file/${file._id}`, {
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
            file.isStarred = data.updatedFileDocument.isStarred;

            setDisplayStates((prevDisplayStates) => {
                return {
                    ...prevDisplayStates,
                    ["isRunning"]: false
                };
            });
            setFileStatus((prevFileStatus) => {
                return {
                    ...prevFileStatus,
                    ["isStarring"]: false
                };
            });
            toast.success(data.message);

            if(displayData.activeTab === "Starred")
            {
                const newFiles = displayData.files.filter(function(f){
                    return f._id !== file._id;
                });

                setDisplayData((prevDisplayData) => {
                    return {
                        ...prevDisplayData,
                        ["files"]: newFiles
                    };
                });
            }
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
                    ["isStarring"]: false
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
                ["isStarring"]: false
            };
        });

        if(!error?.response)
            toast.error("No response from server.");
    }
}

export default handleStarOnClick;