const loadCatgory = () => {
    const parent = document.getElementById("category")
    fetch("http://127.0.0.1:8000/categories/")
    .then((res)=> res.json())
    .then((data)=> {
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

    fetch("http://127.0.0.1:8000/articles/", {
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
        console.log(data);
    })
}