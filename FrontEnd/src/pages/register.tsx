    import { useState } from "react";
    import { Link } from "react-router-dom";
    import '../styles/register.css'
    import { registerUser } from '../services/userService'
    

    function register() {

        const [Name, setName] = useState("");
        const [Email, SetEmail] = useState("");
        const [Password, setPassword] = useState("");
        const [message, setMessage] = useState("");
        
        async function handleRegister() {
            const result = await registerUser(Name, Email, Password);
            setMessage(result.message);
        }

        return (
            <main>
                <div className="page_ft">
                    <div className="register_page">
                        <div className="infomation_register">
                            <div className="text">Đăng kí tài khoản</div>

                            <input type="Text" placeholder="Tên của bạn" className="input_field" 
                            value = {Name} onChange={(e)=> setName(e.target.value)}/>

                            <input type="Text" placeholder="Email của bạn" className="input_field" 
                            value={Email} onChange={(e) => SetEmail(e.target.value)}/>

                            <input type="password" placeholder="Mật khẩu của bạn" className="input_field" 
                            value={Password} onChange={(e) => setPassword(e.target.value)}/>

                            <button className="btn_register" onClick={handleRegister}>Đăng kí tài khoản</button>
                            {message && <p role="status">{message}</p>}

                            <div className="input_field text_inf">Bạn đã có tài khoản?<Link to="/login" className="link_login">Đăng nhập</Link></div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    export default register