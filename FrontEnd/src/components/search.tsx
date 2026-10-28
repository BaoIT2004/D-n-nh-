import { useNavigate } from 'react-router-dom';
import '../styles/register.css';
import { PiCodesandboxLogoDuotone } from "react-icons/pi";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { logoutUser } from "../services/User";
import { useState } from 'react';


function Search() {


    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const email = localStorage.getItem("email")

    const handleLogout = async () => {
        try{
            await logoutUser();
        }finally{
            navigate('/login')
        }
    }

    return (
        <div className="search">

                <div className="absolute mr-350 text-3xl">
                    <PiCodesandboxLogoDuotone />
                </div>

                <input
                    type="text"
                    placeholder="Tìm kiếm"
                    className="IputRes"
                />

                <div className='flex items-center'>
                    <IoMdHelpCircleOutline title="Trợ giúp" className='absolute ml-55 text-[18]'/>
                    
                </div>

            <div className="navbar_buttons flex items-center">
                {email ? (
                    <>
                        <span onClick={() => setOpen(!open)} className="px-4 py-2 rounded-lg text-gray-700  hover:text-blue-600 transition duration-200 cursor-pointer">{email}</span>
                        {open && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-1">
                                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition cursor-pointer">
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate('/register')}>
                            Đăng ký
                        </button>

                        <button onClick={() => navigate('/login')}>
                            Đăng nhập
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Search;