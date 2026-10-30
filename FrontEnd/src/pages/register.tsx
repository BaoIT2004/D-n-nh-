import { useState } from "react";
import { Link } from "react-router-dom";
import '../styles/register.css'
import { registerUser } from '../services/userService'


function register() {

    const [Name, setName] = useState("");
    const [Email, SetEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    async function handleRegister() {
        if (!Name.trim() || !Email.trim() || !Password.trim()) {
            setMessage("empty");
            return;
        }

        setMessage("");

        const result = await registerUser(Name, Email, Password);

        if (!result.success) {
            setMessage(result.message);
        }
    }
    return (
        <main>
            <div className="page_ft">
                <div className="register_page">
                    <div className="infomation_register">
                        <div className="text">Đăng kí tài khoản</div>

                        <input type="Text" placeholder="Tên của bạn" className="input_field"
                            value={Name} onChange={(e) => setName(e.target.value)} />
                        {!Name.trim() && message === "empty" && (
                            <p className={`error_message ${!Name.trim() && message === "empty" ? "show" : ""}`}>
                                Vui lòng nhập tên!
                            </p>
                        )}

                        <input type="Text" placeholder="Email của bạn" className="input_field"
                            value={Email} onChange={(e) => SetEmail(e.target.value)} />
                        {!Email.trim() && message === "empty" && (
                            <p className={`error_message ${!Email.trim() && message === "empty" ? "show" : ""}`}>
                                Vui lòng nhập tên!
                            </p>
                        )}

                        <input type="password" placeholder="Mật khẩu của bạn" className="input_field"
                            value={Password} onChange={(e) => setPassword(e.target.value)} />
                        {!Password.trim() && message === "empty" && (
                            <p className={`error_message ${!Password.trim() && message === "empty" ? "show" : ""}`}>
                                Vui lòng nhập mật khẩu!
                            </p>
                        )}

                        <button className="btn_register" onClick={handleRegister}>Đăng kí tài khoản</button>

                        <div className="input_field text_inf">Bạn đã có tài khoản?<Link to="/login" className="link_login">Đăng nhập</Link></div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default register