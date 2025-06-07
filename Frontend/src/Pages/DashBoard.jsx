import { useContext, useEffect, useState } from "react";

import { IoMdCloud } from "react-icons/io";
import { SyncLoader } from "react-spinners";
import { GoHome, GoHomeFill } from "react-icons/go";
import { GoStar, GoStarFill } from "react-icons/go";
import { PiTrash, PiTrashFill } from "react-icons/pi";

import Files from "../Components/DashBoard/Files";
import { AppContext } from "../Context/AppContext";
import UploadFileForm from "../Components/Forms/UploadFileForm";
import CreateFolderForm from "../Components/Forms/CreateFolderForm";
import handleEmptyBinOnClick from "../HelperFunctions/handleEmptyBinOnClick";

function DashBoard()
{
    const [displayData, setDisplayData] = useState({
        files: [],
        path: ["Root"],
        parentIds: [null],
        activeTab: "Home"
    });

    const [displayStates, setDisplayStates] = useState({
        isLoading: false,
        isRunning: false,
        isClearing: false,
        shouldRetry: false,
        isFileFormOpen: false,
        isFolderFormOpen: false
    });

    const {userDetails, setUserDetails, refreshToken} = useContext(AppContext);

    const tabs = [
        {
            name: "Home",
            iconLight: <GoHome className="text-lg"></GoHome>,
            iconFill: <GoHomeFill className="text-lg"></GoHomeFill>
        },
        {
            name: "Starred",
            iconLight: <GoStar className="text-lg"></GoStar>,
            iconFill: <GoStarFill className="text-lg"></GoStarFill>
        },
        {
            name: "Bin",
            iconLight: <PiTrash className="text-lg"></PiTrash>,
            iconFill: <PiTrashFill className="text-lg"></PiTrashFill>
        }
    ];

    function handlePathChangeOnClick(event)
    {
        const newPath = [...displayData.path].slice(0, displayData.path.indexOf(event.target.value) + 1);
        const newParentIds = [...displayData.parentIds].slice(0, displayData.path.indexOf(event.target.value) + 1);

        setDisplayData((prevDisplayData) => {
            return {
                ...prevDisplayData,
                ["path"]: newPath,
                ["parentIds"]: newParentIds
            };
        });
    }

    function handleScroll(event)
    {
        event.preventDefault();

        if(event.deltaY === 0)
            return;

        const pathDiv = document.getElementById("pathDiv");
        pathDiv.scrollTo({
            left: pathDiv.scrollLeft + event.deltaY,
            behavior: "smooth"
        });
    }

    useEffect(function(){
        if(displayStates.shouldRetry === true)
            handleEmptyBinOnClick(setDisplayData, userDetails, setUserDetails, refreshToken, setDisplayStates, setShouldRetry);
    }, [userDetails.accessToken]);

    return(
        <div className="w-[100%] h-[calc(100dvh-4.5rem)] fixed mt-[4.5rem] flex justify-center">
            <div className="w-[100%] text-white flex md:flex-col-reverse fixed">
                <div className={`w-[15%] md:w-[100%] ${((displayStates.isFileFormOpen && window.innerWidth > 768) || (displayStates.isFolderFormOpen && window.innerWidth > 768)) ? "opacity-15" : "opacity-1"} flex flex-col md:flex-row md:justify-center px-[0.5rem] md:px-[1rem] py-[2rem] md:py-[0.7rem] md:border-t md:border-[#bbb5ae]`}>
                    {
                        tabs.map(function(tab, idx){
                            return(
                                <div key={idx} className={`${(idx === 0) ? "mt-[4.25rem] md:mt-[0rem]" : "mt-[1rem] md:mt-[0rem]"} md:w-[33%]`}>
                                    <button onClick={() => setDisplayData((prevDisplayData) => {
                                                return {
                                                    ...prevDisplayData,
                                                    ["activeTab"]: tab.name
                                                };
                                            })
                                        } 
                                        disabled={displayStates.isLoading || displayStates.isRunning || displayStates.isFolderFormOpen || displayStates.isFileFormOpen}
                                        className={`${(displayData.activeTab === tab.name) ? "bg-[#2D2B29]" : "bg-[#121319]"} w-[100%] text-sm flex sm:flex-col items-center rounded-lg py-[0.5rem] pl-[1rem] md:pl-[0rem] md:justify-center gap-4 md:gap-2 sm:gap-1`}>
                                        {
                                            (displayData.activeTab === tab.name) ?
                                            tab.iconFill
                                            :
                                            tab.iconLight
                                        }

                                        {tab.name}
                                    </button>
                                </div>
                            );
                        })
                    }
                    
                    <div className="md:hidden w-[100%] px-[1rem] py-[0.5rem] text-sm mt-[1rem]">
                        <div className="flex items-center gap-4"> 
                            <IoMdCloud className="text-lg"></IoMdCloud> 

                            Storage
                        </div>

                        <div className="w-[100%] h-[0.3rem] rounded-lg bg-gray-500 mt-[1rem]">
                            <div className=" h-[100%] rounded-lg bg-white" 
                                style={{
                                    width: userDetails.spaceConsumed
                                }}>
                            </div>
                        </div>

                        <div className="mt-[0.8rem] text-xs">
                            {userDetails.spaceConsumed} MB of 256 MB used
                        </div>
                    </div>
                </div>

                <div className={`w-[85%] md:w-[100%] ${(displayStates.isFileFormOpen || displayStates.isFolderFormOpen) ? "opacity-15" : "opacity-1"} bg-[#1A1918] border-l border-[#bbb5ae] md:border-0 p-[2rem] md:pt-[2rem] md:pb-[0.5rem] md:px-[2rem] sm:px-[1.5rem]`}>
                    <div className="flex gap-4">
                        <button disabled={displayData.activeTab === "Starred" || displayData.activeTab === "Bin" || displayStates.isLoading || displayStates.isRunning || displayStates.isFolderFormOpen || displayStates.isFileFormOpen}
                            onClick={() => setDisplayStates((prevDisplayStates) => {
                                return {
                                    ...prevDisplayStates,
                                    ["isFolderFormOpen"]: true
                                };
                            })}
                            className="bg-[#0061FE] text-sm font-semibold px-[1rem] py-[0.5rem] rounded-lg">
                            Create Folder
                        </button>

                        <button disabled={displayData.activeTab === "Starred" || displayData.activeTab === "Bin" || displayStates.isLoading || displayStates.isRunning || displayStates.isFolderFormOpen || displayStates.isFileFormOpen}
                            onClick={() => setDisplayStates((prevDisplayStates) => {
                                return {
                                    ...prevDisplayStates,
                                    ["isFileFormOpen"]: true
                                };
                            })}
                            className="bg-[#0061FE] text-sm font-semibold px-[1rem] py-[0.5rem] rounded-lg">
                            Upload file
                        </button>
                    </div>

                    <div id="pathDiv" onWheel={handleScroll}
                        className={`flex ${(displayData.activeTab === "Bin") ? "justify-between" : "justify-start"} py-[0.1rem] gap-2 font-semibold text-2xl mt-[2rem] overflow-x-scroll`}>
                        {
                            (displayData.activeTab === "Home") ?
                            displayData.path.map(function(p, idx){
                                return(
                                    <div key={idx} className="flex gap-2 cursor-pointer">
                                        <button disabled={idx === displayData.path.length - 1} value={p} onClick={handlePathChangeOnClick}>
                                            {p}
                                        </button>

                                        {
                                            (idx !== displayData.path.length - 1) ?
                                            <span> {`>`} </span>
                                            :
                                            <></>
                                        }
                                    </div>
                                )
                            })
                            :
                            <div>
                                {displayData.activeTab}
                            </div>
                        }

                        {
                            (displayData.activeTab === "Bin") ?
                            <button disabled={displayStates.isRunning || displayStates.isClearing || displayStates.isLoading || displayData.files.length === 0} 
                                onClick={() => handleEmptyBinOnClick(setDisplayData, userDetails, setUserDetails, refreshToken, setDisplayStates, setShouldRetry)}
                                className="bg-red-500 text-sm font-semibold text-center w-[102px] py-[0.2rem] rounded">
                                {
                                    (displayStates.isClearing === false) ?
                                    "Empty bin"
                                    :
                                    <SyncLoader color="white" size="5px"></SyncLoader>
                                }
                            </button>
                            :
                            <></>
                        }
                    </div>

                    <div className="w-[100%] flex-col mt-[1.5rem]">
                        <div className="w-[100%] flex justify-between py-[0.5rem] border-b border-[#bbb5ae]">
                            <div className="w-[60%] sm:w-[45%]">
                                Name
                            </div>

                            <div className="w-[15%] md:hidden">
                                Created
                            </div>

                            <div className="w-[15%] sm:w-[18%]">
                                Size
                            </div>

                            <div className="w-[10%] md:w-[18%] sm:w-[27%]">
                                
                            </div>
                        </div>
                    </div>

                    <div className="flex-col h-[calc(100dvh-18rem)] md:h-[calc(100dvh-23.5rem)] sm:h-[calc(100dvh-25rem)] overflow-y-scroll">
                        <Files 
                            displayData={displayData}
                            setDisplayData={setDisplayData}
                            displayStates={displayStates}
                            setDisplayStates={setDisplayStates}>
                        </Files>
                    </div>

                    <div className="hidden max-w-[450px] mx-auto w-[100%] md:flex justify-between items-center mt-[1rem]">
                        <div className="md:w-[50%] sm:w-[40%] h-[0.5rem] rounded-lg bg-gray-500">
                            <div className=" h-[100%] rounded-lg bg-white" 
                                style={{
                                    width: userDetails.spaceConsumed
                                }}>
                            </div>
                        </div>

                        <div className="text-sm">
                            {userDetails.spaceConsumed} MB of 256 MB used
                        </div>
                    </div>
                </div>
            </div>
            
            {
                (displayStates.isFolderFormOpen === true) ?
                <CreateFolderForm
                    displayData={displayData}
                    setDisplayData={setDisplayData}
                    displayStates={displayStates}
                    setDisplayStates={setDisplayStates}>
                </CreateFolderForm>
                :
                <></>
            }

            {
                (displayStates.isFileFormOpen === true) ?
                <UploadFileForm 
                    displayData={displayData}
                    setDisplayData={setDisplayData}
                    displayStates={displayStates}
                    setDisplayStates={setDisplayStates}>
                </UploadFileForm>
                :
                <></>
            }
        </div>
    );
}

export default DashBoard;