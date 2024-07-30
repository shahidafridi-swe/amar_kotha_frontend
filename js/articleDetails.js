const getParams = () => {
    const param = new URLSearchParams(window.location.search).get("articleId");
    console.log(param)
    fetch(`https://amar-kotha.onrender.com/articles/${param}`)
    .then((res)=> res.json())
    .then((data)=> displayArticleDetails(data))

}
getParams();

const displayArticleDetails = (article) => {
    const parent = document.getElementById("article-details");
    const ratingSection = document.getElementById("rating-section");

    console.log("article--", article);

    const createdAt = new Date(article.created_at).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    const user_id = localStorage.getItem("user_id");

    fetch(`https://amar-kotha.onrender.com/categories/${article.category}/`)
        .then((res) => res.json())
        .then((category) => {
            parent.innerHTML = `
                <div class="border border-dark rounded ">
                    <div class="bg-dark-subtle p-3 rounded">
                        <h3 class="fw-bold">${article.headline}</h3>
                        <hr>
                        <div class="row text-dark ">
                            <div class="col-md-4">
                                <p>Category: ${category.name}</p>
                            </div>
                            <div class="col-md-4">
                                <p>Published: ${createdAt}</p>
                            </div>
                            <div class="col-md-4">
                                <p>Rating: ${article.average_rating ?? 0} out of 4</p>
                            </div>
                        </div>
                    </div>
                    <p class="p-3">${article.body}</p>
                </div>
            `;
            ratingSection.style.display = 'none';

            if (user_id) {
                fetch(`https://amar-kotha.onrender.com/users/list/${user_id}/`)
                    .then((res) => res.json())
                    .then((user) => {
                        const isEditor = user.account.user_type === "Editor";
                        const isViewer = user.account.user_type === "Viewer";

                        if (isEditor) {
                            parent.innerHTML += `
                                <div class="p-2 border border-dark bg-dark-subtle">
                                    <button class="btn px-5 mx-2 btn-outline-dark" id="edit-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Edit</button>
                                    <button class="btn px-5 mx-2 btn-outline-danger" id="delete-btn" onclick="deleteArticle()">Delete</button>
                                </div>
                            `;
                            ratingSection.style.display = 'none';
                        } else if (isViewer) {
                            fetch("https://amar-kotha.onrender.com/rating/")
                            .then((res)=>res.json())
                            .then((ratingList)=>{
                                console.log(ratingList);
                                const userRating = ratingList.find(rating => rating.article == article.id && rating.user == user_id);

                                if (userRating) {
                                    document.getElementById("rating-message").innerHTML = `
                                    <h5>You have already rated this article: ${userRating.rating} out of 4</h5>
                                    
                                    `
                                }
                                else{
                                    ratingSection.style.display = 'block';
                                }
                            })
                        }
                    });
            }

            document.getElementById("edit_headline").value = article.headline;
            document.getElementById("edit_body").value = article.body;
        });
};


const displayTwoArticles = () => {
    const param = new URLSearchParams(window.location.search).get("articleId");
    console.log(param)
    fetch(`https://amar-kotha.onrender.com/articles/${param}`)
    .then((res)=> res.json())
    .then((data)=> {
        const category = data.category;
        fetch(`https://amar-kotha.onrender.com/articles/?category_id=${category}`)
        .then((res)=>res.json())
        .then((articles)=> {
            // console.log("articles ---" , articles)
            const filteredArticles = articles.filter(article => article.id != param);
            const lastTwoArticles = filteredArticles.slice(-2);
            // console.log("-----", articles, param);
            const parent = document.getElementById("two-articles");
            lastTwoArticles.forEach(article => {
                const div = document.createElement("div");
                div.classList.add("col-md-6");
                div.innerHTML = `
                    <div class="article border rounded p-3">
                        <a href="article_Details.html?articleId=${article.id}"" class="article-headline">
                            <h3 class="fw-bold">${article.headline}</h3>
                        </a>
                        <p>${article.body.slice(0,150)}</p>
                    </div>
                `;
                parent.appendChild(div);
            });
            
        })
    })
}
displayTwoArticles();




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

    fetch(`https://amar-kotha.onrender.com/articles/${param}/`, {
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
    fetch(`https://amar-kotha.onrender.com/articles/${param}/`, {
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
    console.log("rate---> ",ratingData)
    fetch("https://amar-kotha.onrender.com/rating/", {
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
