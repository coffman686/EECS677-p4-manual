// articles routes: get all articles, create article, delete article

const express = require('express'); 
const router = express.Router();
const { getDatabase } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

// public route to get all articles
router.get('/', (req, res) => {
  try {
    const db = getDatabase(); // get db connection

    // sql query to get all articles with associated usernames
    // select all article fields and username, then join tables based on equality of user_id and id, order by created_at desc
    // .all() to get ALL rows as an array
    // .prepare for safety against SQL injection
    const articles = db.prepare(`
      SELECT articles.id, articles.url, articles.title, articles.user_id, articles.created_at, users.username
      FROM articles
      JOIN users ON articles.user_id = users.id
      ORDER BY articles.created_at DESC `).all();
    
    res.json(articles); // send sql result as JSON response

  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// protected route to create a new article
router.post('/', authenticateToken, (req, res) => {
  try {
    const { url, title } = req.body; // get url and title from request body
    const userId = req.user.id; // get user id

    // require url to exist
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // make sure URL is in valid format
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const db = getDatabase(); // get db connection

    // insert new article into articles table
    // use .prepare and .run with ? placeholders to prevent SQL injection
    const result = db.prepare('INSERT INTO articles (url, title, user_id) VALUES (?, ?, ?)').run(url, title || null, userId);

    // get that newly created article to return in response
    // same way as in GET / route, but with WHERE clause to get only the new article by its id
    // once again, use .prepare and .get to prevent SQL injection and get single row
    const newArticle = db.prepare(`
      SELECT articles.id, articles.url, articles.title, articles.user_id, articles.created_at, users.username
      FROM articles
      JOIN users ON articles.user_id = users.id
      WHERE articles.id = ? `).get(result.lastInsertRowid);

    res.status(201).json(newArticle); // return the new article with 201 created status

  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// protected route to delete an article by id
// must either be the article owner or an admin to delete
// uses authentication and authorization to enforce this
router.delete('/:id', authenticateToken, (req, res) => { // /:id to get article id from URL
  try {

    const articleId = req.params.id; // get article id from URL params
    const userId = req.user.id; // get user id
    const isAdmin = req.user.isAdmin; // check if user is admin
    const db = getDatabase();

    // first, fetch the article to see if it exists and who owns it
    // use .prepare and .get to prevent SQL injection and get single row
    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(articleId);

    // check if article exists
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // deny if user is not the owner and not an admin
    if (article.user_id !== userId && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this article' });
    }

    // delete the article
    db.prepare('DELETE FROM articles WHERE id = ?').run(articleId);
    res.json({ message: 'Article deleted successfully' });

  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
