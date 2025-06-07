import { useContext, useEffect, useState } from "react";

import { GoStar } from "react-icons/go";
import { PiTrash } from "react-icons/pi";
import { MdImage } from "react-icons/md";
import { FaFolder } from "react-icons/fa";
import { GoStarFill } from "react-icons/go";
import { LuDownload } from "react-icons/lu";
import { SyncLoader } from "react-spinners";
import { MdPictureAsPdf } from "react-icons/md";
import { MdSettingsBackupRestore } from "react-icons/md";

import { AppContext } from "../../Context/AppContext.jsx";
import handleStarOnClick from "../../HelperFunctions/handleStarOnClick.js";
import handleTrashOnClick from "../../HelperFunctions/handleTrashOnClick.js";
import handleDeleteOnClick from "../../HelperFunctions/handleDeleteOnClick.js";
import handleDownloadOnClick from "../../HelperFunctions/handleDownloadOnClick.js";
import handleViewFileOnClick from "../../HelperFunctions/handleViewFileOnClick.js";

function File(props)
{
    const [fileStatus, setFileStatus] = useState({
        isStarring: false,
        isDeleting: false,
        isTrashing: false,
        isRestoring: false,
        shouldRetry: false,
        isDownloading: false
    });

    const {userDetails, setUserDetails, refreshToken} = useContext(AppContext);
    const {file, displayData, setDisplayData, displayStates, setDisplayStates} = props;

    useEffect(function(){
        if(fileStatus.shouldRetry === true)
        {
            if(fileStatus.isStarring === true)
                handleStarOnClick(file, displayData, setDisplayData, userDetails, refreshToken, setFileStatus);
            else if(fileStatus.isTrashing === true)
                handleTrashOnClick("trash", file, displayData, setDisplayData, userDetails, refreshToken, setDisplayStates, setFileStatus);
            else if(fileStatus.isRestoring === true)
                handleTrashOnClick("restore", file, displayData, setDisplayData, userDetails, refreshToken, setDisplayStates, setFileStatus);
            else if(fileStatus.isDeleting === true)
                handleDeleteOnClick(file, displayData, setDisplayData, userDetails, setUserDetails, refreshToken, setDisplayStates, setFileStatus);
        }
    }, [userDetails.accessToken]);

    return(
        <div className="flex justify-between text-sm py-[1rem] border-b border-[#bbb5ae]">
            <button onClick={() => handleViewFileOnClick(file, displayData, setDisplayData)} 
                className="w-[60%] sm:w-[45%] flex items-center gap-2">
                {
                    (file.isFolder === true) ?
                    <FaFolder className="text-lg"></FaFolder>
                    :
                    <></>
                }

                {
                    (file.type.startsWith("image/") === true) ?
                    <MdImage className="text-lg"></MdImage>
                    :
                    <></>
                }

                {
                    (file.type === "application/pdf") ?
                    <MdPictureAsPdf className="text-lg"></MdPictureAsPdf>
                    :
                    <></>
                }

                <span className="md:hidden sm:hidden">
                    {
                        (file.name.length > 75) ? file.name.substring(0, 75) + "..." : file.name
                    }
                </span>

                <span className="hidden md:block sm:hidden">
                    {
                        (file.name.length > 45) ? file.name.substring(0, 45) + "..." : file.name
                    }
                </span>

                <span className="hidden sm:block">
                    {
                        (file.name.length > 12) ? file.name.substring(0, 12) + "..." : file.name
                    }
                </span>
            </button>

            <div className="w-[15%] md:hidden">
                {file.createdAt.substring(0, 10)}
            </div>

            <div className="w-[15%] sm:w-[18%]">
                {
                    (file.isFolder === true) ? "--" : file.size + " MB"
                }
            </div>

            <div className="w-[10%] md:w-[18%] sm:w-[27%] flex items-center">
                {
                    (displayData.activeTab !== "Bin") ?
                    <div className="w-[33.2%]">
                        {
                            (fileStatus.isStarring === false) ?
                            <button disabled={displayStates.isRunning} 
                                onClick={() => handleStarOnClick(file, displayData, setDisplayData, userDetails, refreshToken, setDisplayStates, setFileStatus)}>
                                {
                                    (file.isStarred === false) ?
                                    <GoStar className="text-lg md:text-base"></GoStar>
                                    :
                                    <GoStarFill className="text-lg md:text-base"></GoStarFill>
                                }
                            </button>
                            :
                            <SyncLoader color="white" size="4px"></SyncLoader>
                        }
                    </div>
                    :
                    <div className="w-[33.2%]">
                        {
                            (fileStatus.isRestoring === false) ?
                            <button disabled={displayStates.isRunning} 
                               onClick={() => handleTrashOnClick("restore", file, displayData, setDisplayData, userDetails, refreshToken, setDisplayStates, setFileStatus)} >
                                <MdSettingsBackupRestore className="text-lg md:text-base"></MdSettingsBackupRestore>
                            </button>
                            :
                            <SyncLoader color="white" size="4px"></SyncLoader>
                        }
                    </div>
                }

                <div className="w-[33.2%]">
                    {      
                        (fileStatus.isTrashing === false && fileStatus.isDeleting === false) ?
                        <button disabled={displayStates.isRunning} 
                            onClick={() => {
                                    if(displayData.activeTab !== "Bin")
                                        handleTrashOnClick("trash", file, displayData, setDisplayData, userDetails, refreshToken, setDisplayStates, setFileStatus);
                                    else
                                        handleDeleteOnClick(file, displayData, setDisplayData, userDetails, setUserDetails, refreshToken, setDisplayStates, setFileStatus);
                                }
                            }>
                            <PiTrash className="text-lg md:text-base"></PiTrash>
                        </button>
                        :
                        <SyncLoader color="white" size="4px"></SyncLoader>
                    }
                </div>

                <div className="w-[33.2%]">            
                    {
                        (file.isFolder === false) ?
                            (fileStatus.isDownloading === false) ?
                            <button disabled={displayStates.isRunning} 
                                onClick={() => handleDownloadOnClick(file, setDisplayStates, setFileStatus)}>
                                <LuDownload className="text-lg md:text-base"></LuDownload>
                            </button>
                            :
                            <SyncLoader color="white" size="4px"></SyncLoader>
                        :
                        <>
                            --
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default File;