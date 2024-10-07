const loadBreakingNews = () => {
    fetch('https://amar-kotha.onrender.com/articles/')
    .then(res => res.json())
    .then(data => {
        if (data.length > 0) {
            const marquee = document.getElementById('breakingNewsMarquee');
            const recentNews = data.slice(-5).reverse(); 
            const newsText = recentNews.map(newsItem => 
                `<a href="article_Details.html?articleId=${newsItem.id}" class="br-news">${newsItem.headline}</a>`
            ).join(' || ');
           
            marquee.innerHTML = newsText; 
        }
    })
    .catch(error => {
        console.error('Error loading breaking news:', error);
    });
};
loadBreakingNews();
