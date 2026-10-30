import { useState } from "react";
import { loginUser } from '../services/userService'
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [Email, SetEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    async function handleLogin() {

        setIsSubmitting(true);
        if (!Email.trim() || !Password.trim()) {
            setMessage("empty");
            return;
        }

        setMessage("");

        try {
            const result = await loginUser(Email, Password);
            setMessage(result.message);
            if (result.success) {
                navigate("/");
            }
        }catch(err){
            console.log(err);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main>
            <div className="mt-10 flex justify-center px-4">
                <div className="w-full max-w-md rounded-2xl border border-[#808080] bg-[#EEEEEE]">
                    <div className="mx-auto w-full max-w-sm px-6 py-8">
                        <div className="mb-6 flex justify-center font-bold text-xl">Đăng kí tài khoản</div>

                        <div className="mb-3">
                            <input type="Text" placeholder="Email của bạn" className="box-border h-11 w-full rounded-lg border border-[#808080] px-3"
                                value={Email} onChange={(e) => SetEmail(e.target.value)} />
                            <p className={`${!Email.trim() && message === "empty" ? "visible" : "invisible"} mt-1 h-4 text-xs text-[#ff0000]`}>
                                Vui lòng nhập Email
                            </p>
                        </div>

                        <div className="mb-3">
                            <input type="password" placeholder="Mật khẩu của bạn" className="box-border h-11 w-full rounded-lg border border-[#808080] px-3"
                                value={Password} onChange={(e) => setPassword(e.target.value)} />
                            <p className={`${!Password.trim() && message === "empty" ? "visible" : "invisible"} mt-1 h-4 text-xs text-[#ff0000]`}>
                                Vui lòng nhập mật khẩu
                            </p>
                        </div>

                        <button className="mt-1 h-10 w-full cursor-pointer rounded-md border-0 bg-[#1F2937] text-white" onClick={handleLogin}>Đăng kí tài khoản</button>

                        <div className="mt-4 flex h-10 items-center justify-center">
                            Bạn đã có tài khoản?<Link to="/register" className="text-[#1F2937] no-underline">Đăng ký</Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login