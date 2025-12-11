// protected article sharing dashboard page

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// main dashboard component
function Dashboard() {

  const [articles, setArticles] = useState([]); // state that holds list of articles
  const [newUrl, setNewUrl] = useState(''); // state for new article URL input
  const [newTitle, setNewTitle] = useState(''); // state for new article title input
  const [error, setError] = useState(''); // state for error messages

  const { user, token, logout } = useAuth(); // get auth state and functions from AuthContext

  // function to fetch articles from the API
  const fetchArticles = async () => {
    try {

      const response = await fetch('/api/articles'); // GET request to fetch articles

      const data = await response.json(); // wait for JSON response
      setArticles(data); // update articles state with fetched data

    } catch (err) {
      console.error('Failed to fetch articles:', err);
    }
  };

  // function to handle new article form submission
  const handleSubmit = async (e) => {

    e.preventDefault();
    setError('');

    try {
      // POST request to create a new article with auth token
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ url: newUrl, title: newTitle })
      });

      const data = await response.json(); // parse JSON response

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post article');
      }

      // if successful, clear form inputs and refresh article list
      setNewUrl('');
      setNewTitle('');
      fetchArticles();

    } catch (err) {
      setError(err.message);
    }
  };

  // function to handle deleting an article
  const handleDelete = async (articleId) => {
    try {
      // DELETE request to delete article by id with auth token
      const response = await fetch('/api/articles/' + articleId, {
        method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete article');
      }

      fetchArticles(); // if successful, refresh article list

    } catch (err) {
      setError(err.message);
    }
  };

  // fetch articles on component mount
  useEffect(() => {
    fetchArticles();
  }, []); 

  // render the dashboard UI
  return (
    <div>
      {/* header section */}
      <header>
        <h1>Article Share</h1>

        {/* display user info */}
        <span>Welcome, {user?.username} {user?.isAdmin && '(Admin)'}</span>

        {/* logout button */}
        <button onClick={logout}>Logout</button>
      </header>

      {/* new article button */}
      <section>
        <h2>Post New Article</h2>

        {/* Error display */}
        {error && <div style={{ color: 'red' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* url input */}
          <div>
            <label htmlFor="url">Article URL:</label>
            <input
              type="url"
              id="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://example.com/article"
              required
            />
          </div>

          {/* optional title input */}
          <div>
            <label htmlFor="title">Title (optional):</label>
            <input
              type="text"
              id="title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Article title"
              maxLength={255}
            />
          </div>

          <button type="submit">Share Article</button>
        </form>
      </section>

      {/* list articles */}
      <section>
        <h2>Shared Articles</h2>

        {articles.length === 0 ? (
          <p>No articles shared yet.</p>
        ) : (
          <ul>
            {/* use article id to map article posts */}
            {articles.map((article) => (
              <li key={article.id}>
                {/* url button */}
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  {article.title || article.url}
                </a>

                {/* user who posted article */}
                <span> - by {article.username}</span>

                {/* delete button (only shows if user is owner of post or user is admin */}
                {(user?.id === article.user_id || user?.isAdmin) && (
                  <button onClick={() => handleDelete(article.id)}>Delete</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
