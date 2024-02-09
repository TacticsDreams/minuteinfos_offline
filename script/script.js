document.addEventListener('DOMContentLoaded', async () => {
  const articles = await fetchArticlesfromServer();
  displayArticles(articles);
});

async function fetchArticlesfromServer() {
  const response = await fetch('articles.json');
  const articles = await response.json();
  return articles;
}

function displayArticles(articles) {
  const articlesContainer = document.querySelector("#articles-container");

  articles.forEach(article => {
    const articleDiv = document.createElement('div');
    articleDiv.classList.add('article');
    articleDiv.dataset.link = article.link;
  
    const titleHeading = document.createElement('h2');
    titleHeading.textContent = article.title;

    const descParagraph = document.createElement('p');
    descParagraph.textContent = article.description;

    const imageElement = document.createElement('img')
    if (article.image) {
      imageElement.src = article.image;
      imageElement.alt = article.title;
    }

    const dateParagraph = document.createElement('p');
    dateParagraph.textContent = `Date: ${article.date.toDateString()}`;

    const sourceParagraph = document.createElement('p');
    sourceParagraph.textContent = `Source: ${article.source}`;

    // Append Elements to the article container
    articleDiv.appendChild(titleHeading);
    articleDiv.appendChild(descParagraph);
    if (article.image) {
      articleDiv.appendChild(imageElement);
    }
    articleDiv.appendChild(dateParagraph);
    articleDiv.appendChild(sourceParagraph);

    articlesContainer.appendChild(articleDiv);
  });
  const articlesElements = document.querySelectorAll('.article');
  articlesElements.forEach(article => {
    article.addEventListener('click', (e) => {
      e.preventDefault();
      const link = article.getAttribute('data-link');
      window.location.href = link;
    });
  });
}