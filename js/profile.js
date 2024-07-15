const displayProfile = () => {

    const user_id = localStorage.getItem("user_id")
    const parent = document.getElementById("profile-info")
    fetch(`https://amar-kotha.onrender.com/users/list/${user_id}/`)
    .then((res)=> res.json())
    .then((user)=> {
        parent.innerHTML = `
            <h3>${user.first_name} ${user.last_name}</h3>
            <hr>
            <h5>Username: ${user.username}</h5>
            <h5>Email: ${user.email}</h5>
            <h5>User Type: ${user.account.user_type}</h5>
            <h5>Phone: ${user.account.phone}</h5>

        
        `
    })


}
displayProfile();