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

const handleAddArticle = async (event) => {
    event.preventDefault();

    const form = document.getElementById("add-article");
    const formData = new FormData(form);
    const token = localStorage.getItem("token");

    // Upload the image to Imgbb first
    const imageFile = formData.get('image');
    let imageUrl = '';

    if (imageFile) {
        const imgFormData = new FormData();
        imgFormData.append('image', imageFile);

        const imgbbResponse = await fetch('https://api.imgbb.com/1/upload?key=648e380c7b8d76ec81662ddc06d73ec5', {
            method: 'POST',
            body: imgFormData
        });

        const imgbbData = await imgbbResponse.json();
        if (imgbbData.status === 200) {
            imageUrl = imgbbData.data.url;
        } else {
            alert('Image upload failed!');
            return;
        }
    }

    const articleData = {
        headline: formData.get('headline'),
        body: formData.get('body'),
        category: formData.get('category'),
        image_url: imageUrl
    };

    fetch("https://amar-kotha.onrender.com/articles/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify(articleData)
    })
    .then((res) => res.json())
    .then((data) => {
        alert("Article added successfully!");
        window.location.href = "./index.html";
    })
    .catch(error => console.error('Error:', error));
};


const loadArticles = (value) => {
    fetch(`https://amar-kotha.onrender.com/categories/${value}/`)
    .then((res)=>res.json())
    .then((data)=> {
        document.getElementById("category-title").innerText = data.name;
    })


    document.getElementById("nodata").innerText = ''
    document.getElementById("articles-sector").innerHTML = ''
    fetch(`https://amar-kotha.onrender.com/articles/?category_id=${value}`)
    .then((res) => res.json())
    .then((data) => {

        if(data.length>0){
            data.sort((a, b) => b.average_rating - a.average_rating);
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
    const createdAt = new Date(article.created_at).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    const div = document.createElement("div")
    div.innerHTML = `
    
    <a href="article_Details.html?articleId=${article.id}"" class="article-headline">
        <div class="article border border-dark rounded  my-2">
        <div class="row">
            <div class="col-md-3">
                ${article.image_url ? `<img src="${article.image_url}" alt="Article Image" class="w-100 rounded">` : `<img src="https://i.ibb.co/1MC5gDs/download.jpg" alt="Article Image" class="w-100 rounded">`}
            </div>
            <div class="col-md-9 p-3">
                <h3 class="fw-bold">${article.headline}</h3>
                <hr class="p-0 m-0"/>

                <div class="row">
                    <div class="col-md-6">
                    <p class="p-0 m-0">Published: ${createdAt}</p>
                    </div>
                    <div class="col-md-6">
                        <p class="p-0 m-0">Rating: ${article.average_rating ?? 0} out of 4</p>
                    </div>
                    </div>
                <hr class="p-0 m-0"/>

                <p class="mt-3">${article.body.slice(0,150)}...</p>
            </div>
        </div>
        </div>
    </a>
    
    `
    parent.appendChild(div)
  });

}