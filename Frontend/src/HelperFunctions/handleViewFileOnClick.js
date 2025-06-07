import toast from "react-hot-toast";

function handleViewFileOnClick(file, displayData, setDisplayData)
{
    if(file.isTrash === true)
    {
        toast.error("Restore the File/Folder to view.");
        return;
    }

    if(file.isFolder === false)
    {
        window.open(file.url, "_blank");
        return;
    }
    else
    {
        const newPath = [...displayData.path];
        newPath.push(file.name);

        const newParentIds = [...displayData.parentIds];
        newParentIds.push(file._id);

        setDisplayData((prevDisplayData) => {
            return {
                ...prevDisplayData,
                ["path"]: newPath,
                ["parentIds"]: newParentIds
            };
        });
    }
}

export default handleViewFileOnClick;