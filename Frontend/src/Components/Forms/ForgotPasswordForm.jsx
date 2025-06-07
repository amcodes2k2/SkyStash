import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SyncLoader } from "react-spinners";
import { AppContext } from "../../Context/AppContext.jsx";

function ForgotPasswordForm()
{
    const [formData, setFormData] = useState({
        email: ""
    });
    const [isRunning, setIsRunning] = useState(false);

    const navigate = useNavigate();
    const {sendOTP} = useContext(AppContext);
    
    function handleChange(event)
    {
        setFormData(function(prevFormData){
            return {
                ...prevFormData,
                [event.target.id]: event.target.value
            };
        });
    }

    async function handleSubmit(event)
    {
        try
        {
            setIsRunning(true);
            event.preventDefault();

            await sendOTP(undefined, formData.email, "reset-password")
            .then((res) => {
                if(res.success === true)
                {
                    setIsRunning(false);

                    window.scrollTo(0, 0);
                    navigate(`/verify-email/reset-password`, {state: {userId: res.user_id}});
                }
            });

            setIsRunning(false);
        }
        catch
        {
            setIsRunning(false);
            return;
        }
    }

    return(
        <div className="mt-[2rem] flex justify-center w-[100%]">
            <form className="w-[100%]" onSubmit={handleSubmit}>
                <div>
                    <p className="text-base text-white text-center">
                        We'll send a 6-digit code to your email to reset your password.
                    </p>

                    <input id="email" type="email" minLength="3" maxLength="254" value={formData.email} onChange={handleChange} placeholder="Enter email address" className="text-base bg-[#151b23] border-b border-white outline-none text-white mt-[2rem] mb-[1rem] w-[100%] py-[0.8rem] rounded-md indent-3"></input> <br/>
                </div>
                
                <button type="submit" className="w-[100%] bg-[#0061FE] mt-[1rem] py-[0.8rem] font-semibold text-white rounded-lg cursor-pointer">
                    {(isRunning === false) ? "Submit" : <SyncLoader color="white" size="5px"></SyncLoader>}
                </button>
            </form>
        </div>
    );
}

export default ForgotPasswordForm;