    import { useEffect, useState } from "react";
    import { IoHomeOutline } from "react-icons/io5";
    import { IoCreateOutline } from "react-icons/io5";
    import { CiViewBoard } from "react-icons/ci";
    import { IoIosNotificationsOutline } from "react-icons/io";
    import { FaRegUserCircle } from "react-icons/fa";
    import { IoSettingsOutline } from "react-icons/io5";
    import { MdMenuOpen } from "react-icons/md";
    import { useNavigate } from "react-router-dom";
    import { logoutUser } from "../services/userService";
    import { allProject } from "../services/projectService";
    import type { Project } from "../types/project";
    import { SiAlby } from "react-icons/si";

    type SidebarLeftProps = {
        onCreateClick: () => void;  // onCreateClick tên thuộc tính hàm sẽ nhân , () => void kiểu hàm không nhận tham số () và không yêu cầu trả về giá trị void
    };

    function SidebarLeft({ onCreateClick }: SidebarLeftProps) { // là destructuring: lấy thẳng onCreateClick ra từ props,
        const [project, setProject] = useState<Project[]>([]);
        const [open, setOpen] = useState(true);
        const [board, setBoard] = useState(true);
        const navigate = useNavigate();

        async function handleLogout() {
            const result = await logoutUser();
            if (!result.success) {
                alert(result.message);
                return;
            }
            navigate("/login");
        }

        useEffect(() => {
            async function viewProject() {
                const result = await allProject();
                if (!result.success) {
                    alert(result.message);
                    return;
                }
                setProject(result.data ?? []);
            }
            viewProject();
        }, [])

        const menuItem = [
            {
                icons: <IoHomeOutline size={20} />,
                label: 'Home',
            },
            {
                icons: <IoCreateOutline size={20} />,
                label: 'Create',
            },
            {
                icons: <CiViewBoard size={20} />,
                label: 'Board',
            },
            {
                icons: <SiAlby color="#00B8D9" />,
                label: "name project",
                isProject: true,
            },
            {
                icons: <IoIosNotificationsOutline size={20} />,
                label: 'Announcement',
            },
            {
                icons: <FaRegUserCircle size={20} />,
                label: 'Infomation user',
            },
            {
                icons: <IoSettingsOutline size={20} />,
                label: 'Setting',
            },
        ]

        return (
            <nav className={`h-screen border-r border-[#D1D5DB] shadow-md duration-500 ${open ? "w-40" : "w-12"}`}>
                <div>
                    <MdMenuOpen size={30} className={`ml-1.5 duration-500  cursor-pointer ${!open && `rotate-180`}`} onClick={() => setOpen(!open)} />
                </div>
                <ul>
                    {

                        menuItem.map((item, index) => {
                            if (item.isProject) {
                                return (
                                    <div key={index} className={`overflow-hidden transition-all duration-500 ${board ? "max-h-96" : "max-h-0"}`}>

                                        {project.map((p) => (
                                            <li key={p.id}
                                                onClick={() => {
                                                    navigate(`/BoardPage/${p.id}`)
                                                }}
                                                className="ml-4 pl-4 gap-1 py-1 border-l border-[#D1D5DB] text-[13px] text-gray-600 cursor-pointer hover:bg-blue-50 hover:text-blue-600 whitespace-nowrap overflow-hidden transition-all duration-500 flex items-center font-normal">
                                                {item.icons}
                                                {p.nameProject}
                                            </li>
                                        ))}
                                    </div>
                                )
                            }
                            return (

                                <li key={index}
                                    onClick={() => {
                                        if(item.label == "Home"){
                                            navigate("/");
                                        }

                                        if (item.label == "Create") {
                                            onCreateClick();
                                        }   

                                        if (item.label == "Board") {
                                            setBoard(!board)
                                        }
                                    }}
                                    className="px-3 py-2 hover:bg-blue-100 pl-2 flex gap-2 items-center">
                                    <div>{item.icons}</div>
                                    <p className={`text-[15px] whitespace-nowrap overflow-hidden transition-all duration-500 ${open ? "opacity-100" : "opacity-0 max-w-0"}`}>{item.label}</p>
                                </li>
                            )
                        })
                    }
                </ul>
            
            </nav>

        );
    }

    export default SidebarLeft;