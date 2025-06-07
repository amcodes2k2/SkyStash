import { useContext, useEffect, useState } from "react";

import toast from "react-hot-toast";
import { SyncLoader } from "react-spinners";
import { AppContext } from "../../Context/AppContext";

function UploadFileForm(props)
{
    const [file, setFile] = useState(null);
    const [shouldRetry, setShouldRetry] = useState(false);
    
    const {userDetails, setUserDetails, refreshToken} = useContext(AppContext);
    const {displayData, setDisplayData, displayStates, setDisplayStates} = props;

    async function handleFileUpload(event) 
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

            if((Math.round(((file.size) / 1048576) * 100) / 100).toFixed(1) > 4.5)
            {
                toast.error("File size should not exceed 4.5 MB.");
                return;
            }

            const formData = new FormData();

            formData.append("file", file);
            formData.append("parentId", displayData.parentIds.at(-1));

            setDisplayStates((prevDisplayStates) => {
                return {
                    ...prevDisplayStates,
                    ["isRunning"]: true
                };
            });

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/upload-file`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Authorization": `Bearer ${userDetails.accessToken}`
                },
                body: formData
            });

            const data = await response.json();
            
            if(data.success === true)
            {
                const newFiles = [...displayData.files];
                newFiles.push(data.fileDocument);
                
                setFile(null);
                setDisplayStates((prevDisplayStates) => {
                    return {
                        ...prevDisplayStates,
                        ["isRunning"]: false,
                        ["isFileFormOpen"]: false
                    };
                });
                setDisplayData((prevDisplayData) => {
                    return {
                        ...prevDisplayData,
                        ["files"]: newFiles
                    };
                });
                setUserDetails((prevUserDetails) => {
                    return {
                        ...prevUserDetails,
                        ["spaceConsumed"]: parseFloat((prevUserDetails["spaceConsumed"] + data.fileDocument.size).toFixed(10))
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

                setFile(null);
                setDisplayStates((prevDisplayStates) => {
                    return {
                        ...prevDisplayStates,
                        ["isRunning"]: false,
                        ["isFileFormOpen"]: false
                    };
                });
            }
        }   
        catch(error)
        {
            setFile(null);
            setDisplayStates((prevDisplayStates) => {
                return {
                    ...prevDisplayStates,
                    ["isRunning"]: false,
                    ["isFileFormOpen"]: false
                };
            });

            if(!error?.response)
                toast.error("No response from server.");
        } 
    }

    useEffect(function(){
        if(shouldRetry === true)
            handleFileUpload();
    }, [userDetails.accessToken]);

    return(
        <div className="max-w-[350px] w-[100%] md:max-w-[300px] flex-col p-[1.5rem] text-white bg-[#21201F] rounded-lg top-[15rem] fixed">
            <form className="flex-col mt-[0.5rem]" onSubmit={handleFileUpload}>
                <label htmlFor="file" className="font-semibold">Upload a file</label>
                <input required id="file" type="file" accept="image/*, application/pdf"
                    onChange={(event) => setFile(event.target.files[0])}
                    className="w-[100%] mt-[1rem] rounded py-[0.5rem] bg-[#292524] border border-[#736c64] px-[0.5rem]">
                </input>
                
                <div className="flex mt-[1.5rem] gap-2">
                    <button type="button" disabled={displayStates.isRunning} 
                        onClick={() => setDisplayStates((prevDisplayStates) => {
                            return {
                                ...prevDisplayStates,
                                ["isFileFormOpen"]: false
                            };
                        })}
                        className="bg-[#0061FE] text-sm font-semibold w-[84px] text-center py-[0.5rem] rounded-lg">
                        Cancel
                    </button>

                    <button type="submit" disabled={displayStates.isRunning} className="bg-[#0061FE] text-sm font-semibold w-[84px] text-center py-[0.5rem] rounded-lg">
                        {
                            (displayStates.isRunning === false) ? 
                            "Upload"
                            :
                            <SyncLoader color="white" size="5px"></SyncLoader>
                        }
                    </button>
                </div>  
            </form>
        </div>
    );
}

export default UploadFileForm;