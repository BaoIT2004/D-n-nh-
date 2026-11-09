import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import BoardPage from "./components/Project/AddStatusTask";
import { useCurrentUser } from "./hooks/projects/use-projects";
import TaskDetailModal from "./components/TaskDetailModal/TaskDetailModal";
function App() {
  const { data: user, isLoading } = useCurrentUser();
  const isAuthenticated = user !== undefined;
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/BoardPage/:id"
        element={
          isLoading ? ( // isloading true hiển thị đang tải isAuthenticated = true hiện BoardPage còn lại hiện login
            <p>...Đang tải</p>
          ) : isAuthenticated ? (
            <BoardPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/task-detail-modal/:id" element={<TaskDetailModal />} />
    </Routes>
  );
}

export default App;
