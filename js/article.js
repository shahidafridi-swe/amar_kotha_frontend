const loadCatgory = () => {
    const parent = document.getElementById("category_option")
    fetch("https://amar-kotha.onrender.com/categories/")
    .then((res)=> res.json())
    .then((data)=> {
        displayCategory(data);
        data.forEach(element => {
            // console.log(element)
            const option = document.createElement("option")
            option.value = element.id 
            option.innerText = element.name
            parent.appendChild(option)
        });
        
    })
};
loadCatgory();

const displayCategory = (categories) => {
    const parent = document.getElementById("categories")
    fetch("https://amar-kotha.onrender.com/categories/")
    .then((res)=> res.json())
    .then((data)=> {
        data.forEach(element => {
            const p = document.createElement("p")
            p.innerHTML = `
                <p class="btn btn-outline-dark m-0 w-100" onclick="loadArticles('${element.id}')">${element.name}</p>
            
            `
            parent.appendChild(p);
        })
    })
}


const handleAddArticle = (event) => {
    event.preventDefault()

    const form = document.getElementById("add-article");
    const formData = new FormData(form);
    const token = localStorage.getItem("token")
    console.log(token)
    const articleData = {
        headline : formData.get('headline'),
        body : formData.get('body'),
        category : formData.get('category'),
    }
    console.log("---", articleData)

    fetch("https://amar-kotha.onrender.com/articles/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization : `Token ${token}`,
        },
        body: JSON.stringify(articleData)
    })
    .then((res)=> res.json())
    .then((data)=> {
        alert("Article added ");
        window.location.href = "./index.html"
    })
}

const loadArticles = (value) => {
    fetch(`https://amar-kotha.onrender.com/categories/${value}/`)
    .then((res)=>res.json())
    .then((data)=> {
        document.getElementById("category-title").innerText = data.name;
    })


    document.getElementById("nodata").innerText = ''
    document.getElementById("articles-sector").innerHTML = ''
    fetch(`https://amar-kotha.onrender.com/articles/?category_id=${value}`)
    // fetch("http://127.0.0.1:8000/articles/")
    .then((res) => res.json())
    .then((data) => {

        if(data.length>0){
            displayArticles(data);

          }
          else{
              document.getElementById("nodata").innerText = 'Sorry there are no articls for this category'
            document.getElementById("articles-sector").innerHTML = ""
          }
    })
    .catch((err) => console.log(err))
  };

loadArticles('');

const displayArticles = (articles) => {
  const parent = document.getElementById("articles-sector")
    
  articles.forEach(article => {
    const div = document.createElement("div")
    div.innerHTML = `
    
      <div class="article border rounded p-3">
        <a href="article_Details.html?articleId=${article.id}"" class="article-headline">
            <h3 class="fw-bold">${article.headline}</h3>
        </a>
        <p>${article.body.slice(0,150)}</p>
      </div>
    
    `
    parent.appendChild(div)
  });

}