import { useState } from "react";
import '../styles/register.css' 
import { loginUser } from '../services/User'
import { Navigate, useNavigate } from "react-router-dom";

function Login() {
    const [Name, setName] = useState("");
    const [Email, SetEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [register, setRegister] = useState(false);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    if(register){
        return <Navigate to='/register'/>
    }

    async function handleLogin() {
        setIsSubmitting(true);
        setMessage("");
        try {
            const result = await loginUser(Name, Email, Password);
            setMessage(result.message);
            if (result.success) {
                navigate("/");
            }
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <main>
            <div className="page_ft">
                <div className="register_page">
                    <div className="infomation_register">
                        <div className="text">Đăng nhập tài khoản</div>

                        <input type="Text" placeholder="Email của bạn" className="input_field"
                            value={Email} onChange={(e) => SetEmail(e.target.value)} />

                        <input type="text" placeholder="Mật khẩu của bạn" className="input_field"
                            value={Password} onChange={(e) => setPassword(e.target.value)} />

                        <button
                            className="btn_register"
                            onClick={handleLogin}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập tài khoản"}
                        </button>
                        {message && <p role="status">{message}</p>}

                        <div className="input_field text_inf">Bạn chưa có tài khoản?<a href="" className="link_login" onClick={() => setRegister(true)}>Đăng ký</a></div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login