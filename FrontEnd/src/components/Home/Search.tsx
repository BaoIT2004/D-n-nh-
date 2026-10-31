import { useNavigate } from 'react-router-dom';
import { PiCodesandboxLogoDuotone } from "react-icons/pi";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { logoutUser } from "../../services/UserService";
import { useState } from 'react';


function Search() {


    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const email = localStorage.getItem("email")

    const handleLogout = async () => {
        const result = await logoutUser();
        if (!result.success) {
            alert(result.message);
            return;
        }
        navigate('/login');
    }

    return (
        <div className="relative flex w-full items-center justify-center gap-5">

                <div className="absolute mr-350 text-3xl">
                    <PiCodesandboxLogoDuotone />
                </div>

                <input
                    type="text"
                    placeholder="Tìm kiếm"
                    className="box-border h-[25px] w-[500px] rounded-lg border border-[#1F2937] px-5 text-[15px] leading-[normal]"
                />

                <div className='flex items-center'>
                    <IoMdHelpCircleOutline title="Trợ giúp" className='absolute ml-55 text-[18px]'/>
                    
                </div>

            <div className="absolute right-10 mr-10 ml-auto flex items-center gap-3.75 text-[13px]">
                {email ? (
                    <>
                        <span onClick={() => setOpen(!open)} className="px-4 py-2 rounded-lg text-gray-700  hover:text-blue-600 transition duration-200 cursor-pointer">{email}</span>
                        {open && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-1">
                                <button onClick={handleLogout} className="flex h-7 w-full cursor-pointer items-center justify-center rounded-lg bg-[#1F2937] px-5 py-2.5 text-sm text-white hover:bg-red-50 transition">
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <button className="flex h-7 cursor-pointer items-center justify-center rounded-lg bg-[#1F2937] px-5 py-2.5 text-white" onClick={() => navigate('/register')}>
                            Đăng ký
                        </button>

                        <button className="flex h-7 cursor-pointer items-center justify-center rounded-lg bg-[#1F2937] px-5 py-2.5 text-white" onClick={() => navigate('/login')}>
                            Đăng nhập
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Search;