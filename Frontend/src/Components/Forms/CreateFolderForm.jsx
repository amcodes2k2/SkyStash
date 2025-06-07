import { useContext, useEffect, useState } from "react";

import toast from "react-hot-toast";
import { SyncLoader } from "react-spinners";
import { AppContext } from "../../Context/AppContext";

function CreateFolderForm(props)
{
    const [folderName, setFolderName] = useState("");
    const [shouldRetry, setShouldRetry] = useState(false);

    const {userDetails, refreshToken} = useContext(AppContext);
    const {displayData, setDisplayData, displayStates, setDisplayStates} = props;

    async function handleCreateFolder(event)
    {
        try
        {
            event.preventDefault();
            
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

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/create-folder`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userDetails.accessToken}`
                },
                body: JSON.stringify({parentId: displayData.parentIds.at(-1), folderName: folderName})
            });

            const data = await response.json();
            
            if(data.success === true)
            {
                const newFiles = [...displayData.files];
                newFiles.push(data.folderDocument);
                
                setFolderName("");
                setDisplayStates((prevDisplayStates) => {
                    return {
                        ...prevDisplayStates,
                        ["isRunning"]: false,
                        ["isFolderFormOpen"]: false
                    };
                });
                setDisplayData((prevDisplayData) => {
                    return {
                        ...prevDisplayData,
                        ["files"]: newFiles
                    };
                });

                toast.success(data.message);
            }
            else
            {
                if(response.status === 401)
                {
                    await refreshToken();
                    setShouldRetry(true);
                    return;
                }

                if(response.status !== 500)
                    toast.error(data.message);
                else
                    toast.error("Something went wrong with the server.");

                setFolderName("");
                setDisplayStates((prevDisplayStates) => {
                    return {
                        ...prevDisplayStates,
                        ["isRunning"]: false,
                        ["isFolderFormOpen"]: false
                    };
                });
            }
        }
        catch(error)
        {
            setFolderName("");
            setDisplayStates((prevDisplayStates) => {
                return {
                    ...prevDisplayStates,
                    ["isRunning"]: false,
                    ["isFolderFormOpen"]: false
                };
            });

            if(!error?.response)
                toast.error("No response from server.");
        }
    }

    useEffect(function(){
        if(shouldRetry === true)
            handleCreateFolder();
    }, [userDetails.accessToken]);

    return(
        <div className="max-w-[350px] w-[100%] md:max-w-[300px] flex-col p-[1.5rem] text-white bg-[#21201F] rounded-lg top-[15rem] fixed">
            <form className="flex-col mt-[0.5rem]" onSubmit={handleCreateFolder}>
                <label htmlFor="folderName" className="font-semibold">Folder name</label>
                <input value={folderName} required onChange={(event) => setFolderName(event.target.value)}
                    id="folderName" type="text" minLength="1" maxLength="50" placeholder="Enter folder name" 
                    className="w-[100%] mt-[1rem] bg-[#292524] border border-[#736c64] rounded py-[0.5rem] indent-3 text-white">
                </input>
                
                <div className="flex mt-[1.5rem] gap-2">
                    <button type="button" disabled={setDisplayStates.isRunning} 
                        onClick={() => setDisplayStates((prevDisplayStates) => {
                            return {
                                ...prevDisplayStates,
                                ["isFolderFormOpen"]: false
                            };
                        })}
                        className="bg-[#0061FE] text-sm font-semibold w-[84px] text-center py-[0.5rem] rounded-lg">
                        Cancel
                    </button>

                    <button type="submit" disabled={displayStates.isRunning} className="bg-[#0061FE] text-sm font-semibold w-[84px] text-center py-[0.5rem] rounded-lg">
                        {
                            (displayStates.isRunning === false) ? 
                            "Create"
                            :
                            <SyncLoader color="white" size="5px"></SyncLoader>
                        }
                    </button>
                </div>  
            </form>
        </div>
    );
}

export default CreateFolderForm;