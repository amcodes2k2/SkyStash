import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { AppContext } from "../../Context/AppContext.jsx";

function RedirectIfLoggedIn()
{
    const location = useLocation();
    const {userDetails} = useContext(AppContext);

    return(
        (Object.keys(userDetails).length > 0) ?
        <Navigate to="/dashboard" state={{ from: location }} replace>
        </Navigate>
        :
        <Outlet>
        </Outlet>
    );
}

export default RedirectIfLoggedIn;