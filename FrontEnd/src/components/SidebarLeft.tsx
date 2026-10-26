import { useState } from "react";
import '../styles/register.css'
import { IoHomeOutline  } from "react-icons/io5";
import { IoCreateOutline  } from "react-icons/io5";
import { CiViewBoard } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdMenuOpen } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/User";

type SidebarLeftProps = {
    onCreateClick: () => void;  // onCreateClick tên thuộc tính hàm sẽ nhân , () => void kiểu hàm không nhận tham số () và không yêu cầu trả về giá trị void
}; 

function SidebarLeft({ onCreateClick }: SidebarLeftProps) { // là destructuring: lấy thẳng onCreateClick ra từ props,
    const [open , setOpen] = useState(true);
    const navigate = useNavigate();
    const [project, setproject] = useState<{id: number; name: String }[]>([]);

    async function handleLogout() {
        const result = await logoutUser();
        if (!result.success) {
            alert(result.message);
        }
        navigate("/login");
    }
    
    const menuItem = [  
        {
            icons: <IoHomeOutline  size={20} />,
            label: 'Home',
        },
        {
            icons: <IoCreateOutline  size={20} />,
            label: 'Create',
        },
        {
            icons: <CiViewBoard size={20} />,
            label: 'Board',
        },
        {
            icons: <IoIosNotificationsOutline  size={20} />,
            label: 'Announcement',
        },
         {
            icons: <FaRegUserCircle  size={20} />,
            label: 'Infomation user',
        },
        {
            icons: <IoSettingsOutline size={20} />,
            label: 'Setting',
        },
    ]   

    return (
        <nav className={`h-screen border-r border-[#D1D5DB] shadow-md duration-500 ${ open ? "w-40" : "w-12" }`}>
            <div>
                <MdMenuOpen size={30} className={`ml-1.5 duration-500  cursor-pointer ${!open && `rotate-180`}`} onClick={()=> setOpen(!open)}/>
            </div>
            <ul>
                {
                    
                    menuItem.map((item, index) => {
                        return (
                            <li key={index}
                            onClick={()=>{
                                if(item.label == "Create"){
                                    onCreateClick();
                                }
                            }} 
                            className="px-3 py-2 hover:bg-blue-100 pl-2 flex gap-2 items-center">
                                <div>{item.icons}</div>
                                <p className={`text-[15px] whitespace-nowrap overflow-hidden transition-all duration-500 ${open ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0"}`}>{item.label}</p>
                            </li>
                        )
                    })
                }
            </ul>
            <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-2 hover:bg-blue-100 pl-2 flex gap-2 items-center w-full text-left"
            >
                <IoLogOutOutline size={20} />
                <span className={`text-[15px] whitespace-nowrap overflow-hidden transition-all duration-500 ${open ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0"}`}>
                    Logout
                </span>
            </button>
        </nav>
        
    );
}

export default SidebarLeft;