const getParams = () => {
    const param = new URLSearchParams(window.location.search).get("articleId");
    console.log(param)
    fetch(`http://127.0.0.1:8000/articles/${param}`)
    .then((res)=> res.json())
    .then((data)=> displayArticleDetails(data))

}
getParams();

const displayArticleDetails = (article) => {
    const parent = document.getElementById("article-details")
    console.log(article)

    const ratings = article.ratings;
    console.log("article--",article)
    console.log("ratings--",ratings)
    const averageRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "No ratings";
    console.log("averageRating--",ratings)
    const user_id = localStorage.getItem("user_id")
    

    parent.innerHTML = `
    
    <div class="border border-dark rounded ">
          <div class="bg-dark-subtle p-3 rounded">
            <h3 class="fw-bold">${article.headline}</h3>
            <hr>
            <div class="row  text-dark ">
                <div class="col-md-4">
                <p>Category: ${article.category}</p>
                </div>
                <div class="col-md-4">
                <p>Created: ${article.created_at}</p>
                </div>
                <div class="col-md-4">
                <p>Rating: ${averageRating} out of 4  </p>
                </div>
            </div>
          </div>
          
          <p class="p-3">
            ${article.body}
          </p>
        </div>
    
    `
    if (user_id){
        fetch(`http://127.0.0.1:8000/users/list/${user_id}/`)
        .then((res)=> res.json())
        .then((user)=> {
            const isEditor = user.account.user_type === "Editor";
            const isViewer = user.account.user_type === "Viewer";
            if (isEditor) {
                parent.innerHTML += `
                <div class="p-2 border border-dark bg-dark-subtle">
                     <button class="btn px-5 mx-2 btn-outline-dark" id="edit-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Edit</button>
                    <button class="btn px-5 mx-2 btn-outline-danger" id="delete-btn" onclick="deleteArticle()" >Delete</button>
                </div>
                `;
            }
        })
    }
    document.getElementById("edit_headline").value = article.headline
    document.getElementById("edit_body").value = article.body
}

const updateArticle = (event) => {
    event.preventDefault();
    const param = new URLSearchParams(window.location.search).get("articleId");

    const form = document.getElementById("update-article");
    const formData = new FormData(form);
    const token = localStorage.getItem("token")
    console.log(token)
    const articleUpdateData = {
        headline : formData.get('edit_headline'),
        body : formData.get('edit_body'),
    }

    fetch(`http://127.0.0.1:8000/articles/${param}/`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json",
            Authorization : `Token ${token}`
        },
        body : JSON.stringify(articleUpdateData),
    })
    .then((res)=> res.json())
    .then((data) => {
        console.log(data)
        if (!data.error) { // Add a check to ensure the update was successful
            window.location.reload(); // Reload the page
        } else {
            console.error('Update failed:', data.error); // Handle errors if necessary
        }
        
    })
}

const deleteArticle = () =>  {
    const param = new URLSearchParams(window.location.search).get("articleId");
    const token = localStorage.getItem("token")
    fetch(`http://127.0.0.1:8000/articles/${param}/`, {
        method: "DELETE",
        headers: {
            "Content-Type" : "application/json",
            Authorization : `Token ${token}`
        },
    })
    .then((res)=> {
        window.location.href = "./index.html"
    })
    .catch((err) => console.log(err))
}

const handleAddRating = (event) => {
    event.preventDefault();

    const rating = document.getElementById("rating").value;
    const articleId = new URLSearchParams(window.location.search).get("articleId");
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    const ratingData = {
        article: articleId,
        rating: rating,
        user: userId,
    };

    fetch("http://127.0.0.1:8000/rating/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify(ratingData),
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.error) {
            console.error(data.error);
        } else {
            alert("Rating submitted successfully");
            location.reload(); // Reload the page to update the rating display
        }
    })
    .catch((err) => console.error("Error submitting rating:", err));
};
