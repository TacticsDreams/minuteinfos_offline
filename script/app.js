const axios = require('axios');
const Parser = require('rss-parser');
const fs = require('fs');

const parser = new Parser();
const sources = [
    {name: 'BBC News', url: 'http://feeds.bbci.co.uk/news/rss.xml', maxArticles: 10},
    { name: 'CNN', url: 'http://rss.cnn.com/rss/cnn_topstories.rss', maxArticles: 10 },
    { name: 'The New York Times', url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', maxArticles: 10 },
]

async function fetchArticlesFromRSSFeed(source) {
    try {
      //console.log('Fetching articles from source:', source);
      
      const response = await axios.get(source.url);
      const feed = await parser.parseString(response.data);
  
      // Limit the number of articles based on the maxArticles property
      const articles = feed.items.slice(0, source.maxArticles).map(item => ({
        title: item.title,
        description: item.contentSnippet || 'No description available',
        image: item.enclosure ? item.enclosure.url : null,
        date: new Date(item.isoDate),
        link: item.link,
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

// Example usage
fetchArticlesFromAllSources().then(articles => {
  saveArticlesToJSON(articles, 'articles.json');
  }
);