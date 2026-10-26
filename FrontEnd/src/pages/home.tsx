import { useState } from 'react';
import '../styles/register.css';
import Search from '../components/search';
import SidebarLeft from '../components/SidebarLeft';
import AddProject from '../components/addProject';
import AllProject from '../components/allProject';

function Home() {
    const [projectOpen, setProjectOpen] = useState(false); // projectOpen ban đầu là false 

    let projectForm = null;

    if (projectOpen) {
        projectForm = <AddProject />
    }

    return (
        <main>
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
                        <AllProject />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Home;