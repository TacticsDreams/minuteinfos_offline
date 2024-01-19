document.addEventListener('DOMContentLoaded', () => {
    const articlesElements = document.querySelectorAll(".article");
    articlesElements.forEach(article => {
      article.addEventListener('click', (e) => {
        e.preventDefault();
        const link = article.getAttribute("data-link");
        window.location.href = link;
      });
    });
  });