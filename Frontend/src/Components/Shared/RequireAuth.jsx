import { useContext } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

import { ClipLoader } from "react-spinners";
import { AppContext } from "../../Context/AppContext.jsx";

function RequireAuth()
{
    const location = useLocation();
    const {userDetails, isLoading} = useContext(AppContext);

    return(
        (isLoading === false) ?
        <>
            {
                (Object.keys(userDetails).length > 0) ?
                <Outlet></Outlet>
                :
                <Navigate to="/login" state={{ requireLogin: true, from: location }} replace>
                </Navigate>
            }
        </>
        :
        <div className="w-[100%] min-h-[calc(100dvh-4.5rem)] mt-[4.5rem] flex justify-center items-center">
            <ClipLoader color="white" size="50px"></ClipLoader>
        </div>
    );
}

export default RequireAuth;