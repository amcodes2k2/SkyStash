import { Link } from "react-router-dom";
import SignupForm from "../Components/Forms/SignupForm";

function Signup()
{
    return(
        <div className="min-h-[calc(100dvh-4.5rem)] px-[2rem] py-[2rem] mt-[4.5rem] flex justify-center items-center">
            <div className="flex-col justify-items-center max-w-[350px] w-[350px] sm:max-w-[300px]">
                <h2 className="font-semibold text-2xl text-white text-center">
                    Register to start your journey with us
                </h2>

                <SignupForm></SignupForm>

                <div className="text-white text-base mt-[2rem]">
                    Have an account? <Link to="/login" onClick={() => window.scrollTo(0, 0)}><button className="text-white underline cursor-pointer">
                        Log in
                    </button></Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;