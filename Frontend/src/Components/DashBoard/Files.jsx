import { useContext, useEffect } from "react";

import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

import File from "./File";
import { AppContext } from "../../Context/AppContext";

function Files(props)
{
    const {userDetails, refreshToken} = useContext(AppContext);
    const {displayData, setDisplayData, displayStates, setDisplayStates} = props;

    async function fetchFiles()
    {
        try
        {
            setDisplayStates((prevDisplayStates) => {
                return {
                    ...prevDisplayStates,
                    ["isLoading"]: true
                };
            });

            let url = `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1`;
            if(displayData.activeTab === "Home")
                url = url + `/get-contents/${displayData.parentIds.at(-1)}`;
            else if(displayData.activeTab === "Starred")
                url = url + `/get-starred`;
            else
                url = url + `/get-trashed`;

            const response = await fetch(url, {
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
                if(displayData.activeTab === "Home")
                {
                    data.contents = data.contents.filter(function(file){
                        return file.isTrash === false;
                    });
                }
                    
                setDisplayStates((prevDisplayStates) => {
                    return {
                        ...prevDisplayStates,
                        ["isLoading"]: false
                    };
                });
                setDisplayData((prevDisplayData) => {
                    return {
                        ...prevDisplayData,
                        ["files"]: data.contents
                    };
                });
            }
            else
            {
                setDisplayStates((prevDisplayStates) => {
                    return {
                        ...prevDisplayStates,
                        ["isLoading"]: false
                    };
                });

                if(response.status === 401)
                    await refreshToken();
                else if(response.status !== 500)
                    toast.error(data.message);
                else
                    toast.error("Something went wrong with the server.")
            }
        }
        catch(error)
        {
            setDisplayStates((prevDisplayStates) => {
                return {
                    ...prevDisplayStates,
                    ["isLoading"]: false
                };
            });

            if(!error?.response)
                toast.error("No response from server.");
        }
    }

    useEffect(function(){
        fetchFiles();
    }, [userDetails.accessToken, displayData.activeTab, displayData.parentIds]);

    return(
        (displayStates.isLoading === false) ?
        <>
            {
                displayData.files.map(function(file){
                    return(
                        <File 
                            key={file._id} 
                            file={file}
                            displayData={displayData}
                            setDisplayData={setDisplayData}
                            displayStates={displayStates}
                            setDisplayStates={setDisplayStates}>
                        </File>
                    );
                })
            }

            {
                (displayData.files.length === 0) ?
                <div className="flex w-[100%] h-[calc(100dvh-25rem)] items-center justify-center text-white">
                    Nothing to display here.
                </div>
                :
                <></>
            }
        </>
        :
        <div className="w-[100%] flex justify-center mt-[2rem]">
            <ClipLoader color="white" size="50px"></ClipLoader>
        </div>
    );
}

export default Files;