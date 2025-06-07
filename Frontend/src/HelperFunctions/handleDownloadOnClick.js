import toast from "react-hot-toast";
import fileDownload from "js-file-download";

async function handleDownloadOnClick(file, setIsRunning, setFileStatus)
{
    try
    {
        if(file.isTrash === true)
        {
            toast.error("Restore the File to download.");
            return;
        }

        setIsRunning(true);
        setFileStatus((prevFileStatus) => {
            return {
                ...prevFileStatus,
                ["isDownloading"]: true
            };
        });

        const response = await fetch(file.url, {method: "GET"});

        const data = await response.blob();

        fileDownload(data, file.name);

        setIsRunning(false);
        setFileStatus((prevFileStatus) => {
            return {
                ...prevFileStatus,
                ["isDownloading"]: false
            };
        });
        
        toast.success("File downloaded successfully.");
    }
    catch(error)
    {
        setIsRunning(false);
        setFileStatus((prevFileStatus) => {
            return {
                ...prevFileStatus,
                ["isDownloading"]: false
            };
        });

        toast.error("Something went wrong while downloading the file.");
    }
}

export default handleDownloadOnClick;