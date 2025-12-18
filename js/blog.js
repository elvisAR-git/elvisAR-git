// Blog functionality for Elvis Moraa's retro blog
// Handles loading and displaying blog posts from JSON

(function() {
    'use strict';

    // Check which page we're on
    const isListingPage = document.getElementById('blog-posts-container') !== null;
    const isPostPage = window.location.pathname.includes('blog-post.html');

    if (isListingPage) {
        loadBlogListing();
    } else if (isPostPage) {
        loadBlogPost();
    }

    // Load all blog posts for the listing page
    function loadBlogListing() {
        fetch('./data/blog-posts.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load blog posts');
                }
                return response.json();
            })
            .then(data => {
                displayBlogPosts(data.posts);
            })
            .catch(error => {
                console.error('Error loading blog posts:', error);
                displayError('Failed to load blog posts. Please try again later.');
            });
    }

    // Display blog posts in card format
    function displayBlogPosts(posts) {
        const container = document.getElementById('blog-posts-container');

        if (!posts || posts.length === 0) {
            container.innerHTML = '<center><p>No blog posts available yet. Check back soon!</p></center>';
            return;
        }

        // Sort posts by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        let html = '';
        posts.forEach(post => {
            const commentCount = post.comments ? post.comments.length : 0;
            const commentText = commentCount === 1 ? 'comment' : 'comments';

            html += `
                <div class="project">
                    <h3>${escapeHtml(post.title)}</h3>
                    <p><strong>Posted:</strong> ${formatDate(post.date)} | <strong>${commentCount}</strong> ${commentText}</p>
                    ${post.tags && post.tags.length > 0 ? `
                        <p>
                            ${post.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join(' ')}
                        </p>
                    ` : ''}
                    <p>${escapeHtml(post.excerpt)}</p>
                    <div class="actions">
                        <a href="./blog-post.html?id=${post.id}">[Read More]</a>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // Load individual blog post with comments
    function loadBlogPost() {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = parseInt(urlParams.get('id'));

        if (!postId) {
            displayPostError('No post ID specified.');
            return;
        }

        fetch('./data/blog-posts.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load blog post');
                }
                return response.json();
            })
            .then(data => {
                const post = data.posts.find(p => p.id === postId);
                if (post) {
                    displayBlogPost(post);
                } else {
                    displayPostError('Blog post not found.');
                }
            })
            .catch(error => {
                console.error('Error loading blog post:', error);
                displayPostError('Failed to load blog post. Please try again later.');
            });
    }

    // Display individual blog post with comments section
    function displayBlogPost(post) {
        const container = document.getElementById('post-content');

        // Update page title
        document.title = `${post.title} - Elvis Moraa`;

        let html = `
            <h2>${escapeHtml(post.title)}</h2>

            <div class="post-meta">
                <strong>Posted by:</strong> ${escapeHtml(post.author)} |
                <strong>Date:</strong> ${formatDate(post.date)}
            </div>

            ${post.tags && post.tags.length > 0 ? `
                <div class="post-tags">
                    <strong>Tags:</strong>
                    ${post.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join(' ')}
                </div>
            ` : ''}

            <div class="post-content">
                ${post.content}
            </div>

            <hr>

            <center>
                <p><a href="./blog.html">&lt;&lt; Back to Blog</a></p>
            </center>

            <div class="comments-section">
                <h2>Comments (${post.comments ? post.comments.length : 0})</h2>

                <div id="comments-container">
                    ${displayComments(post.comments)}
                </div>

                <div class="comment-form">
                    <h3>Add a Comment</h3>
                    <form id="comment-form" onsubmit="return false;">
                        <div class="form-group">
                            <label for="comment-name">Name: <span style="color: #FF0000;">*</span></label>
                            <input type="text" id="comment-name" name="name" required>
                        </div>

                        <div class="form-group">
                            <label for="comment-email">Email: <span class="form-note">(optional, will not be displayed)</span></label>
                            <input type="email" id="comment-email" name="email">
                        </div>

                        <div class="form-group">
                            <label for="comment-text">Comment: <span style="color: #FF0000;">*</span></label>
                            <textarea id="comment-text" name="comment" required></textarea>
                        </div>

                        <p class="form-note">
                            <strong>Note:</strong> This is a demo form. Comments are not actually submitted or stored.
                        </p>

                        <button type="submit" class="submit-btn" onclick="handleCommentSubmit()">Post Comment</button>
                    </form>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // Display comments list
    function displayComments(comments) {
        if (!comments || comments.length === 0) {
            return '<div class="no-comments">No comments yet. Be the first to comment!</div>';
        }

        // Sort comments by date (oldest first)
        comments.sort((a, b) => new Date(a.date) - new Date(b.date));

        let html = '';
        comments.forEach(comment => {
            html += `
                <div class="comment">
                    <div class="comment-header">
                        <span class="comment-author">${escapeHtml(comment.author)}</span>
                        <span class="comment-date">${formatDate(comment.date)}</span>
                    </div>
                    <div class="comment-content">
                        ${escapeHtml(comment.content)}
                    </div>
                </div>
            `;
        });

        return html;
    }

    // Handle comment form submission (demo only)
    window.handleCommentSubmit = function() {
        const name = document.getElementById('comment-name').value;
        const email = document.getElementById('comment-email').value;
        const commentText = document.getElementById('comment-text').value;

        if (!name.trim() || !commentText.trim()) {
            alert('Please fill in all required fields (Name and Comment).');
            return false;
        }

        // Show demo message
        alert('Thank you for your comment, ' + name + '!\n\n' +
              'This is a demo blog, so your comment won\'t actually be saved. ' +
              'In a real implementation, this would be sent to a backend server.');

        // Clear form
        document.getElementById('comment-form').reset();

        return false;
    };

    // Display error message for listing page
    function displayError(message) {
        const container = document.getElementById('blog-posts-container');
        container.innerHTML = `
            <center>
                <p style="color: #FF0000;"><strong>Error:</strong> ${escapeHtml(message)}</p>
                <p><a href="./index.html">Return to Home</a></p>
            </center>
        `;
    }

    // Display error message for post page
    function displayPostError(message) {
        const container = document.getElementById('post-content');
        container.innerHTML = `
            <h2>Error</h2>
            <p style="color: #FF0000;">${escapeHtml(message)}</p>
            <hr>
            <center>
                <p><a href="./blog.html">&lt;&lt; Back to Blog</a></p>
            </center>
        `;
    }

    // Format date to readable format
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

})();
