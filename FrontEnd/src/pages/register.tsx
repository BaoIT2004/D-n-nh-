    import React, { useState } from "react";
    import { Navigate, useNavigate } from "react-router-dom";
    import '../styles/register.css'
    import {useQuery} from "@tanstack/react-query"
    import  { registerUser }  from '../services/User'
    

    function register() {

        const navigate = useNavigate();
        const [Name, setName] = useState("");
        const [Email, SetEmail] = useState("");
        const [Password, setPassword] = useState("");
        const [Login, setLogin] = useState(false);

        if(Login){
            return <Navigate to="/login"/>
        }
        
        async function handleRegister() {
            await registerUser(Name, Email,Password);
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

                            <input type="text" placeholder="Mật khẩu của bạn" className="input_field" 
                            value={Password} onChange={(e) => setPassword(e.target.value)}/>

                            <button className="btn_register" onClick={handleRegister}>Đăng kí tài khoản</button>

                            <div className="input_field text_inf">Bạn đã có tài khoản?<a href="" className="link_login" onClick={() => setLogin(true)}>Đăng nhập</a></div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    export default register