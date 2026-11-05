import { useState } from 'react';
import Search from '../components/Home/Search';
import SidebarLeft from '../components/Home/SidebarLeft';
import AddProject from '../components/Project/AddProject';
import ProjectTable from '../components/Project/AllProject';
  
function Home() {
    const [projectOpen, setProjectOpen] = useState(false); // projectOpen ban đầu là false 

    let projectForm = null;

    if (projectOpen) {
        projectForm = <AddProject />
    }

    return (
        <main>
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
                    <div className='p-5 flex justify-center'>
                        <ProjectTable />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Home;