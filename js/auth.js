const handleRegister = (event) => {
    event.preventDefault();
    const form = document.getElementById("register-form");
    const formData  = new FormData(form);
    console.log(formData.get("profile_image")?.file)
    const registerData = {
        username: formData.get("username"),
        email: formData.get("email"),
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        password: formData.get("password"),
        confirm_password: formData.get("password2"),
        user_type: formData.get("user_type"),
        phone: formData.get("phone"),
        image: formData.get("profile_image") 
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
        if (data.error) {
            // error show korben
        } else {
            // sucess msg dekhaben
        }
    })
    .catch((err) => console.log("error::",err))
};