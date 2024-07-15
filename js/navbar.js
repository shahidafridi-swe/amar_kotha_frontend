fetch("../navbar.html")
.then(res=> res.text())
.then(data=> {
    document.getElementById("navbar").innerHTML = data

    let navbarElement = document.getElementById("navbar-element")
    const token = localStorage.getItem("token")
    if (token) {
        navbarElement.innerHTML += `
            
            <li class="nav-item">
            <a class="nav-link "  href="./index.html">Profile</a>
            </li>

            <li class="nav-item">
                <a class="nav-link" onclick="handleLogout()" >Logout</a>
            </li>
        
        `
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
