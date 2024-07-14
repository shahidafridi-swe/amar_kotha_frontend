const handleRegister = (event) => {
    event.preventDefault()
    const form = document.getElementById("register-form")
    const formData  = new FormData(form)
    
    const registerData = {
        username : formData.get("username"),
        email : formData.get("email"),
        first_name : formData.get("first_name"),
        last_name : formData.get("last_name"),
        
        password : formData.get("password"),
        confirm_password : formData.get("password2"),
    };
    console.log(registerData);

    fetch("https://amar-kotha.onrender.com/users/register/", {
        method : "POST",
        headers : {
            "Content-Type": "application/json",
        },
        body : JSON.stringify(registerData),
    })
    .then((res) => res.json())
    .then((data)=> {
        console.log(data);
        const accountData = {
            user : data.user,
            user_type : formData.get("user_type"),
            profile_image : formData.get("profile_image"),
            phone : formData.get("phone"),
        }
        console.log(accountData);

    })
    .then((err) => console.log(err))
}