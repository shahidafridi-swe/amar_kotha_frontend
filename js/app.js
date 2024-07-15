const loadArticles = () => {
    fetch("https://amar-kotha.onrender.com/articles/")
    // fetch("http://127.0.0.1:8000/articles/")
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err))
  };

// loadArticles();