const axios = require('axios');
const Parser = require('rss-parser');
const fs = require('fs');

const parser = new Parser();
const sources = [
    {name: 'BBC News', url: 'http://feeds.bbci.co.uk/news/rss.xml', maxArticles: 10}
]

async function fetchArticlesFromRSSFeed(source) {
    try {
      //console.log('Fetching articles from source:', source);
      
      const response = await axios.get(source.url);
      const feed = await parser.parseString(response.data);
  
      // Limit the number of articles based on the maxArticles property
      const articles = feed.items.slice(0, source.maxArticles).map(item => ({
        title: item.title,
        description: item.contentSnippet,
        image: item.enclosure ? item.enclosure.url : null,
        date: new Date(item.isoDate),
        source: source.name, // Add source information to each article
      }));
  
      return articles;
    } catch (error) {
      console.error(`Error fetching articles from ${source ? source.name : 'unknown source'} RSS feed:`, error);
      throw error;
    }
  }

async function fetchArticlesFromAllSources() {
    const allArticles = [];

    for (const source of sources) {
        const articles = await fetchArticlesFromRSSFeed(source);
        allArticles.push(...articles);
    }

    return allArticles;
}

function saveArticlesToJSON(articles, outputPath) {
    const jsonContent = JSON.stringify(articles, null, 2);
  
    try {
      fs.writeFileSync(outputPath, jsonContent);
      console.log('Articles saved to JSON file:', outputPath);
    } catch (error) {
      console.error('Error saving articles to JSON file:', error);
      throw error;
    }
  }

  function generateArticleHTML(articles) {
    return articles.map(article => `
      <div class="article">
        <h2>${article.title}</h2>
        <p>${article.description}</p>
        <img src="${article.image}" alt="${article.title}">
        <p>Date: ${article.date.toDateString()}</p>
        <p>Source: ${article.source}</p>
      </div>
    `).join('');
  }

// Example usage
fetchArticlesFromAllSources().then(articles => {
  saveArticlesToJSON(articles, 'articles.json');
  appendToHTML(articles, '../index.html');
});

function appendToHTML(articles, htmlFilePath) {
  const existingHTML = fs.readFileSync(htmlFilePath, 'utf-8');
  const newArticlesHTML = generateArticleHTML(articles);
  const updatedHTMLContent = existingHTML.replace(
    /<div id="articles-container">([\s\S]*?)<\/div>/,
    `<div id="articles-container">$1${newArticlesHTML}</div>`
  );

  try {
    fs.writeFileSync(htmlFilePath, updatedHTMLContent);
    console.log('HTML file updated:', htmlFilePath);
  } catch (error) {
    console.error('Error updating HTML file:', error);
    throw error;
  }
}