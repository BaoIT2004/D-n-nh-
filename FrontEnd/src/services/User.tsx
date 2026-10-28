// đăng kí 
export async function registerUser(Name: string, Email: string, Password: String) {
    try {
        const response = await fetch("http://localhost:5024/api/User/register", {
            method: "POST",
            headers: {
                "content-Type": "application/json",
            },
            body: JSON.stringify({
                name: Name,
                email: Email,
                password: Password,
            })
        });

        if (!response.ok) {
            const mesage = await response.text();
            alert(mesage);
        } else {
            alert("Đăng ký thành công")
            return true;
        }
    } catch (Error) {
        console.error(Error);
        alert("Không kết nối đến với server");
    }
}


//đăg nhập
export async function loginUser(Name: string, Email: string, Password: string): Promise<{ success: boolean; message: string }> {
    try {

        const responseLogin = await fetch("http://localhost:5024/api/User/login", {
            method: "POST",
            headers: {
                "content-Type": "application/json",
            },
            body: JSON.stringify({
                name: Name,
                email: Email,
                password: Password,
            })
        });

        const result = await responseLogin.json();

        if (!responseLogin.ok) {
            return {
                success: false,
                message: "Đăng nhập thất bại"
            };
        } else {
            localStorage.setItem("accessToken", result.data.accessToken);
            localStorage.setItem("refreshToken", result.data.refreshToken);
            localStorage.setItem("email", result.data.email)
            localStorage.setItem("userId", String(result.data.id));
            return {
                success: true,
                message: "Đăng nhập thành công"
            }
        }

    } catch (err) {
        console.error(err);
        return { success: false, message: "Không kết nối được đến server" };
    }
}



//Đăng xuất
export async function logoutUser(): Promise<{ success: boolean; message: string }> {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
        if (!refreshToken) {
            return {
                success: true,
                message: "Đã đăng xuất"
            };
        }

        const response = await fetch("http://localhost:5024/api/User/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }), //gói refresh token lại để gửi lên server.
        });

        if (!response.ok) {
            return {
                success: false,
                message: "Lỗi server",
            };
        } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("email");
            localStorage.removeItem("userId")
            return {
                success: true,
                message: "Đăng xuất thành công"
            };
        }

    } catch (err) {
        console.error(err);
        return {
            success: false,
            message: "Không thể kết nối đến máy chủ để thu hồi phiên",
        };
    }
}
