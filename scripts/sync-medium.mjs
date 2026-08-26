import { createClient } from '@supabase/supabase-js';
import Parser from 'rss-parser';
import WebSocket from 'ws';

// 1. Setup Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});
const parser = new Parser();

// Re-using the date conversion logic we previously built
function formatDisplayDate(dateStr) {
  if (!dateStr || dateStr === 'Unknown') return 'Unknown';
  
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
  
  if (!/\d{4}/.test(dateStr) && /^[A-Z][a-z]{2} \d{1,2}$/.test(dateStr)) {
    return `${dateStr}, ${new Date().getFullYear()}`;
  }
  
  return dateStr;
}

// Function to extract first image from HTML content
function extractThumbnail(htmlContent) {
  if (!htmlContent) return null;
  const match = htmlContent.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

async function syncPosts() {
  console.log('Fetching Medium RSS feed...');
  let feed;
  try {
    feed = await parser.parseURL('https://medium.com/feed/@lynwrites_');
  } catch (error) {
    console.error('Error fetching Medium RSS:', error);
    process.exit(1);
  }

  if (!feed || !feed.items || feed.items.length === 0) {
    console.log('No posts found in the RSS feed.');
    return;
  }

  console.log(`Found ${feed.items.length} posts in RSS feed.`);

  // Fetch existing posts from Supabase to prevent duplicates
  const { data: existingPosts, error: fetchError } = await supabase
    .from('posts')
    .select('link');

  if (fetchError) {
    console.error('Error fetching existing posts from Supabase:', fetchError);
    process.exit(1);
  }

  // Use the full link without query params as the unique identifier
  const existingLinks = new Set(existingPosts.map(p => p.link));
  
  const newPosts = [];

  for (const item of feed.items) {
    const cleanLink = item.link.split('?')[0]; // Remove query params
    
    if (!existingLinks.has(cleanLink)) {
      // Format the pubDate (RSS pubDate is usually ISO or RFC2822, so we can convert it cleanly)
      const dateObj = new Date(item.pubDate);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formattedDate = `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
      
      const image = extractThumbnail(item['content:encoded']);

      newPosts.push({
        title: item.title,
        link: cleanLink,
        date: formattedDate,
        image: image || null
      });
    }
  }

  if (newPosts.length === 0) {
    console.log('No new posts to sync. Database is up to date.');
    return;
  }

  console.log(`Inserting ${newPosts.length} new posts...`);
  
  const { error: insertError } = await supabase
    .from('posts')
    .insert(newPosts);

  if (insertError) {
    console.error('Error inserting new posts:', insertError);
    process.exit(1);
  }

  console.log('Successfully synced all new posts!');
}

syncPosts();
