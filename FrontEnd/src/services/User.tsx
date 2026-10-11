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

export async function loginUser(
    Name: string,
    Email: string,
    Password: string
): Promise<{ success: boolean; message: string }> {
    try{
        const responseLogin = await fetch("http://localhost:5024/api/User/login", {
            method: "POST",
            headers:{
                "content-Type": "application/json",
            },
            body:JSON.stringify({
                name: Name,
                email: Email,
                password: Password,
            })
        });

        if(!responseLogin.ok){
            return { success: false, message: "Đăng nhập thất bại" };
        }

        return { success: true, message: "Đăng nhập thành công" };
    } catch (err) {
        console.error(err);
        return { success: false, message: "Không kết nối được đến server" };
    }
}
