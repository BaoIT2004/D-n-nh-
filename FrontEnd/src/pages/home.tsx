import { useState } from 'react';
import Search from '../components/Search';
import SidebarLeft from '../components/SidebarLeft';
import AddProject from '../components/AddProject';
import AllProject from '../components/AllProject';
  
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
                        <AllProject />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Home;