fetch("../navbar.html")
.then(res=> res.text())
.then(data=> {
    document.getElementById("navbar").innerHTML = data

    let navbarElement = document.getElementById("navbar-element")
    const token = localStorage.getItem("token")
    const user_id = localStorage.getItem("user_id")
    if (user_id){
        fetch(`http://127.0.0.1:8000/users/list/${user_id}/`)
        .then((res)=> res.json())
        .then((user)=> {
            if(user.account.user_type == "Editor"){
                navbarElement.innerHTML += `
                
            <li class="nav-item">
                <a class="nav-link "  href="./add_article.html">Add Article</a>
            </li>
            <li class="nav-item">
            <a class="nav-link "  href="./profile.html">Profile</a>
            </li>

            <li class="nav-item">
                <a class="nav-link" onclick="handleLogout()" >Logout</a>
            </li>
            `
            }
            else{
                navbarElement.innerHTML += `
            
                <li class="nav-item">
                <a class="nav-link "  href="./profile.html">Profile</a>
                </li>
    
                <li class="nav-item">
                    <a class="nav-link" onclick="handleLogout()" >Logout</a>
                </li>
            
            `
            }
        })
    }

    if (token) {
       
    }
    else {
        navbarElement.innerHTML += `
        
            <li class="nav-item">
                <a class="nav-link" href="./login.html">Login</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="./register.html">Register</a>
            </li>
        
        `
    }
})

const loadUser = () => {
    const user_id = localStorage.getItem("user_id")
    fetch(`http://127.0.0.1:8000/users/list/${user_id}/`)
    .then((res)=> res.json())
    .then((user)=> console.log(user))

}
loadUser()