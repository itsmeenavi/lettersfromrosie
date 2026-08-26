import fs from 'fs';
import * as cheerio from 'cheerio';

function convertToAbsoluteDate(dateStr) {
  if (!dateStr || dateStr === 'Unknown') return 'Unknown';
  
  // If it's a relative date like "6d ago", calculate the absolute date
  if (dateStr.includes('ago')) {
    const num = parseInt(dateStr, 10);
    if (isNaN(num)) return dateStr;
    const now = new Date();
    if (dateStr.includes('d')) now.setDate(now.getDate() - num);
    else if (dateStr.includes('h')) now.setHours(now.getHours() - num);
    else if (dateStr.includes('m')) now.setMinutes(now.getMinutes() - num);
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  }
  
  // If it's missing a year (e.g. "Dec 16"), append the current year
  if (!/\d{4}/.test(dateStr) && /^[A-Z][a-z]{2} \d{1,2}$/.test(dateStr)) {
    return `${dateStr}, ${new Date().getFullYear()}`;
  }
  
  return dateStr;
}

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
      date: convertToAbsoluteDate(dateStr),
    });
  }
});

console.log(`Found ${posts.length} posts.`);
fs.writeFileSync('extracted_posts.json', JSON.stringify(posts, null, 2));
