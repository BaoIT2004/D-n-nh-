import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Search from "./Search";
import SidebarLeft from "./SidebarLeft";
import AddProject from "./AddProject";
import { CiSquarePlus } from "react-icons/ci";
import { addStatusTask } from "../services/statusTaskService";


function BoardPage() {
   const { id } = useParams(); // Lấy id dự án từ URL (ví dụ: /projects/:id)
   const [projectOpen, setProjectOpen] = useState(false); // projectOpen ban đầu là false
   const [modal, setmodal] = useState(false);
   const [status, setStatus] = useState("Todo");


   let projectForm = null;
   if (projectOpen) {
      projectForm = <AddProject />
   }


   const [isSuccess, setIsSuccess] = useState(false);
   const handleAddStatusTask = async () => {
      try {
         const projectId = Number(id);
         if (!Number.isInteger(projectId) || projectId <= 0) {
            alert("ID dự án không hợp lệ.");
            return;
         }

         const result = await addStatusTask(status, projectId);
         if (result.success) {
            toggleModal();
         } else {
            alert(result.message);
         }
      } catch (error) {
         console.error("Lỗi khi thêm trạng thái:", error);
         alert("Không thể thêm trạng thái.");
      }
   };

   const toggleModal = () => {
      setmodal(!modal);
   }



   return (
      <nav>
         <div className="home">
            <div className="flex h-10 w-full shrink-0 items-center justify-end border border-[#9CA3AF] bg-white">
               <Search />
            </div>

            <div className="flex">
               <SidebarLeft
                  onCreateClick={() =>
                     setProjectOpen((openCreate) => !openCreate) // openCreate giá trị hiên tại của projectOpen
                  }
               />
               {projectForm}



               {/* Nội dung chính */}
               <div className="flex-1 min-w-0 border-l border-gray-300">
                  <div className="p-6 bg-white min-h-screen w-full">
                     <div className="mb-6 ">
                        <h1 className="text-2xl font-bold text-gray-800">Bảng Công Việc</h1>
                        <p className="text-sm text-gray-500">Quản lý tiến độ công việc của dự án này.</p>
                     </div>

                     {/* tạo đưởng kẻ ngang */}
                     <hr className="border-t border-gray-300 -mx-6 my-5" />

                     {/* Giao diện các cột Kanban */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Cột 1: To Do */}
                        {/* Note101 */}

                        <div className="flex items-start gap-3"> {/*items-start mọi phần tử con bị kéo giãn cho cao bằng phần tử cao nhất trong hàng. */}
                           <div className="w-fit h-fit min-w-64 max-w-md p-4 bg-[#F8F8F8] rounded-lg shadow-sm border border-gray-200">
                              <h3 className="font-semibold text-gray-700 mb-3">To do</h3>
                              <div className="space-y-3">
                                 <div className="p-1 rounded shadow-sm border border-dashed border-gray-300 text-sm text-gray-500 flex justify-center">
                                    <CiSquarePlus size={20} />
                                 </div>

                              </div>
                           </div>



                           {/* add buton */}
                           <button className="active" onClick={toggleModal}>
                              <CiSquarePlus size={35} />
                           </button>

                           {modal && (
                              <div className="fixed inset-0 flex items-center justify-center">
                                 <div className="absolute inset-0 bg-black/50 " onClick={toggleModal}></div>

                                 <div className="relative bg-white p-6 rounded-lg w-150 h-70 mb-60">
                                    <h1 className="font-bold pb-4">
                                       AddStatus
                                    </h1>
                                    <h4 className="text-gray-500">
                                       A status shows the progression of work. Add an existing status or type to create a new one.
                                    </h4>
                                    <h5 className="text-gray-900 pt-4">
                                       Status name
                                    </h5>
                                    <select
                                       value={status}
                                       onChange={(e) => setStatus(e.target.value)}
                                       className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-10 text-sm text-gray-700 shadow-sm transition hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 mt-3"
                                    >
                                       <option value="Todo">To do</option>
                                       <option value="Inprogress">In progress</option>
                                       <option value="Done">Done</option>
                                    </select>

                                    <div className="mt-6 flex justify-end gap-2">
                                       <button
                                          className="rounded-lg bg-red-400 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-200"
                                          onClick={toggleModal}
                                       >
                                          Close
                                       </button>
                                       <button
                                          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-600"
                                          onClick={handleAddStatusTask}
                                       >
                                          Add
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           )}
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