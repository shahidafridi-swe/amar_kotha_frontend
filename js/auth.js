const handleLogin = (event) => {
    event.preventDefault();
    document.getElementById("login-loading-message").innerText= "Loading..."
    const form = document.getElementById("login-form");
    const formData  = new FormData(form);
    const loginData = {
        username: formData.get("username"),
        password: formData.get("password"),
    };
    console.log(loginData)
    fetch("http://127.0.0.1:8000/users/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    })
    .then((res) => res.json())
    .then((data) => {

        console.log(data);
        localStorage.setItem("token",data.token)
        document.getElementById("login-loading-message").innerText= ""
        window.location.href = "index.html"        
        if (data.error) {
           
        } else {
            // window.location.href = "index.html";
        }
    })
    .catch((err) => console.log("error::",err))
};

const handleRegister = (event) => {
    event.preventDefault()
    document.getElementById("register-loading-message").innerText= "Loading..."
    const form = document.getElementById("register-form");
    const formData  = new FormData(form);
    const registerData = {
        username: formData.get("username"),
        email: formData.get("email"),
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        password: formData.get("password"),
        confirm_password: formData.get("password2"),
        user_type: formData.get("user_type"),
        phone: formData.get("phone"),
        // image: formData.get("profile_image") 
    };
    console.log(registerData)
    fetch("http://127.0.0.1:8000/users/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
    })
    .then((res) => res.json())
    .then((data) => {

        console.log(data);
        document.getElementById("register-loading-message").innerText= ""
        document.getElementById("register-success-message").innerText = "Check Your Email For Activate Your account"
       
        if (data.error) {
           
        } else {
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        }
    })
    .catch((err) => console.log("error::",err))
}

const handleLogout = () => {
    const token = localStorage.getItem('token')

    fetch("http://127.0.0.1:8000/users/logout/", {
        method : "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization : `Token ${token}`,
        }
    })
    .then((res)=> res.json())
    .then((data)=> {
        console.log(data);
       
        localStorage.removeItem("token")
        window.location.href ="./login.html"
    })
    .catch((err)=> console.log("logout error:: ",err))

}