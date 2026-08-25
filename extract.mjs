import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('c:/Users/Ivhan/Downloads/letters from rosie – Medium.html', 'utf8');
const $ = cheerio.load(html);

const posts = [];

$('article').each((i, el) => {
  const title = $(el).attr('aria-label') || $(el).find('h2').text();
  let link = $(el).find('a').attr('href');
  
  if (link && link.startsWith('/')) {
    link = `https://medium.com${link}`;
  }

  let dateStr = 'Unknown';
  const texts = [];
  $(el).find('span, p').each((_, node) => {
    const text = $(node).text().trim();
    if (text) texts.push(text);
  });

  for (const text of texts) {
    if (/^[A-Z][a-z]{2} \d{1,2}(, \d{4})?$/.test(text) || /\d+[a-z] ago/.test(text)) {
      dateStr = text;
      break;
    }
  }

  if (title && link) {
    posts.push({
      title,
      link: link.split('?')[0],
      date: dateStr,
    });
  }
});

console.log(`Found ${posts.length} posts.`);
fs.writeFileSync('extracted_posts.json', JSON.stringify(posts, null, 2));
