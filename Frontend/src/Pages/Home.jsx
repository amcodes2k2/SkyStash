import { useContext } from "react";
import { Link } from "react-router-dom";

import banner from "../Assets/Images/Banner.png";
import { AppContext } from "../Context/AppContext";

function Home()
{
    const {userDetails} = useContext(AppContext);

    return(
        <div className="min-h-[calc(100dvh-4.5rem)] px-[2rem] py-[2rem] mt-[4.5rem] flex justify-center items-center">
            <section className="py-[3rem] flex-col justify-items-center">
                <img src={banner} className="h-[150px]"></img>

                <div className="text-center mt-[2rem]">
                    <h2 className="text-white font-semibold text-2xl">
                        Backup your images and PDFs with ease
                    </h2>
                </div>

                <div className="text-center mt-[1rem] max-w-[1000px]">
                    <p className="font-semibold text-[#a4a5ab] text-base">
                        Simple and effective cloud storage for individuals. Upload and access files from any device. Register now to get 256 MB of cloud storage for your files.
                    </p>
                </div>

                <Link to={(Object.keys(userDetails).length > 0) ? "/dashboard" : "/signup"} onClick={() => window.scrollTo(0, 0)}>
                    <button className="w-[100%] bg-[#0061FE] mt-[2rem] px-[2rem] py-[0.8rem] font-semibold text-base text-white rounded-lg cursor-pointer">
                        Get started now
                    </button>
                </Link>
            </section>
        </div>
    );
}

export default Home;