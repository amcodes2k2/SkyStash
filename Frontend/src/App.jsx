import './App.css';
import { useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Home from './Pages/Home.jsx';
import Login from './Pages/Login.jsx';
import Signup from './Pages/Signup.jsx';
import NotFound from './Pages/NotFound.jsx';
import DashBoard from './Pages/DashBoard.jsx';
import VerifyEmail from './Pages/VerifyEmail.jsx';
import Footer from './Components/Shared/Footer.jsx';
import Header from './Components/Shared/Header.jsx';
import ResetPassword from './Pages/ResetPassword.jsx';
import ForgotPassword from './Pages/ForgotPassword.jsx';
import RequireAuth from './Components/Shared/RequireAuth.jsx';
import RedirectIfLoggedIn from './Components/Shared/RedirectIfLoggedIn.jsx';

import { Toaster } from 'react-hot-toast';
import { FadeLoader } from 'react-spinners';
import { AppContext } from './Context/AppContext';

function App() 
{
  const containerStyle = {};
  const location = useLocation();
  const {isLoading} = useContext(AppContext);
  
  if(window.innerWidth <= 640)
    containerStyle.bottom = "6rem";
  else if(window.innerWidth > 640 && window.innerWidth <= 768)
    containerStyle.bottom = "4rem";
  else
    containerStyle.bottom = "1rem";

  return(
    (isLoading === false) ?
    <>
      <Header></Header>

      <Routes>
        <Route index element={<Home></Home>}></Route>

        <Route element={<RedirectIfLoggedIn></RedirectIfLoggedIn>}>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/verify-email/:type" element={<VerifyEmail></VerifyEmail>}></Route>
          <Route path="/reset-password" element={<ResetPassword></ResetPassword>}></Route>
          <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>}></Route>
        </Route>

        <Route element={<RequireAuth></RequireAuth>}>
          <Route path="/dashboard" element={<DashBoard></DashBoard>}></Route>
        </Route>
        
        <Route path="*" element={<NotFound></NotFound>}></Route>
      </Routes>

      {
        (location.pathname.split("/").at(-1) !== "dashboard") ?
        <Footer></Footer>
        :
        <></>
      }
     
      <Toaster position="bottom-center" containerStyle={containerStyle}>
      </Toaster>
    </>
    :
    <div className="w-[100vw] h-[100dvh] flex items-center justify-center gap-2">
      <FadeLoader color="white" height="15px" width="5px"></FadeLoader>

      <p className="text-white font-semibold text-lg md:text-base">
        Attempting to persist login
      </p>
    </div>
  );
}

export default App;