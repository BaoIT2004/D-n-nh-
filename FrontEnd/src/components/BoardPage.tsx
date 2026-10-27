import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Search from "./search";
import SidebarLeft from "./SidebarLeft";
import AddProject from "./addProject";

function BoardPage() {
   const { id } = useParams(); // Lấy id dự án từ URL (ví dụ: /projects/:id)
   const [projectOpen, setProjectOpen] = useState(false); // projectOpen ban đầu là false 
   let projectForm = null;
   if (projectOpen) {
      projectForm = <AddProject />
   }

   useEffect(() => {
      async function fetchProjectBoard() {
         try {
            // Gọi API lấy dữ liệu bảng/chi tiết dự án dựa vào id ở đây
            // const res = await getProjectById(id);
         } catch (error) {
            console.error("Lỗi khi tải dữ liệu bảng:", error);
         }
      }
      fetchProjectBoard();
   }, [id]);


   return (
      <nav>
         <div className="home">
            <div className="navbar">
               <Search />
            </div>

            <div className="flex">
               <SidebarLeft
                  onCreateClick={() =>
                     setProjectOpen((openCreate) => !openCreate) // openCreate giá trị hiên tại của projectOpen
                  }
               />
               {projectForm}


               <div className='p-5 flex justify-center'>
                  <div className="flex-1 p-6 bg-gray-50 min-h-screen">
                     <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Bảng Công Việc</h1>
                        <p className="text-sm text-gray-500">Quản lý tiến độ công việc của dự án này.</p>
                     </div>

                     {/* Giao diện các cột Kanban */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Cột 1: To Do */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200">
                           <h3 className="font-semibold text-gray-700 mb-3">Cần làm (To Do)</h3>
                           <div className="space-y-3">
                              <div className="bg-white p-3 rounded shadow-sm border border-gray-100 text-sm text-gray-700">
                                 Thiết kế giao diện trang chủ
                              </div>
                           </div>
                        </div>

                        {/* Cột 2: In Progress */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200">
                           <h3 className="font-semibold text-gray-700 mb-3">Đang làm (In Progress)</h3>
                           <div className="space-y-3">
                              <div className="bg-white p-3 rounded shadow-sm border border-gray-100 text-sm text-gray-700">
                                 Xử lý API Sidebar và điều hướng
                              </div>
                           </div>
                        </div>

                        {/* Cột 3: Done */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200">
                           <h3 className="font-semibold text-gray-700 mb-3">Hoàn thành (Done)</h3>
                           <div className="space-y-3">
                              <div className="bg-white p-3 rounded shadow-sm border border-gray-100 text-sm text-gray-700">
                                 Cấu hình React Router
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </nav>
   );
}

export default BoardPage;  