// Blog functionality for Elvis' retro blog

let blogPosts = [];

// Load blog posts from JSON
async function loadBlogPosts() {
    try {
        const response = await fetch('./data/blog-posts.json');
        if (!response.ok) {
            throw new Error('Failed to load blog posts');
        }
        const data = await response.json();
        blogPosts = data.posts;
        return blogPosts;
    } catch (error) {
        console.error('Error loading blog posts:', error);
        return null;
    }
}

// Format date to readable string
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// Format comment date to relative time (e.g., "2 hours ago")
function formatCommentDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
        return diffMins <= 1 ? '1 minute ago' : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
        return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays < 7) {
        return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    } else {
        return formatDate(dateString);
    }
}

// Get post by ID
function getPostById(id) {
    return blogPosts.find(post => post.id === parseInt(id));
}

// Render comments section
function renderComments(comments) {
    if (!comments || comments.length === 0) {
        return `
            <div class="comments-empty">
                <p>No comments yet. Be the first to comment!</p>
            </div>
        `;
    }

    return comments.map(comment => `
        <div class="comment-card">
            <div class="comment-header">
                <div class="comment-avatar">${comment.author.charAt(0).toUpperCase()}</div>
                <div class="comment-meta">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${formatCommentDate(comment.date)}</span>
                </div>
            </div>
            <div class="comment-content">
                ${comment.content}
            </div>
        </div>
    `).join('');
}

// Render comment form
function renderCommentForm() {
    return `
        <div class="comment-form">
            <h3 class="silk">Leave a Comment</h3>
            <p class="comment-form-note">Share your thoughts (demo only - comments won't be saved)</p>
            <form id="comment-form" onsubmit="handleCommentSubmit(event)">
                <div class="form-group">
                    <label for="comment-name">Name</label>
                    <input type="text" id="comment-name" name="name" placeholder="Your name" required>
                </div>
                <div class="form-group">
                    <label for="comment-email">Email (optional)</label>
                    <input type="email" id="comment-email" name="email" placeholder="your@email.com">
                </div>
                <div class="form-group">
                    <label for="comment-text">Comment</label>
                    <textarea id="comment-text" name="comment" rows="4" placeholder="Write your comment here..." required></textarea>
                </div>
                <button type="submit" class="comment-submit">Post Comment</button>
            </form>
        </div>
    `;
}

// Handle comment form submission (demo only)
function handleCommentSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const name = form.name.value;
    const comment = form.comment.value;

    // Show success message
    const formContainer = document.querySelector('.comment-form');
    const successMessage = document.createElement('div');
    successMessage.className = 'comment-success';
    successMessage.innerHTML = `
        <p class="silk">✓ Comment submitted!</p>
        <p>Thanks for your comment, ${name}! (This is a demo - comments aren't actually saved)</p>
    `;

    formContainer.parentNode.insertBefore(successMessage, formContainer);

    // Reset form
    form.reset();

    // Remove success message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// Render blog cards on listing page
function renderBlogCards(posts) {
    const container = document.getElementById('blog-posts');

    if (!posts || posts.length === 0) {
        container.innerHTML = `
            <div class="blog-error">
                <p class="silk">No blog posts found</p>
                <p>Check back soon for new content!</p>
            </div>
        `;
        return;
    }

    // Sort posts by date (newest first)
    const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = sortedPosts.map(post => `
        <div class="blog-card" onclick="navigateToPost(${post.id})">
            <p class="silk">${post.title}</p>
            <div class="blog-meta">
                <span class="blog-date">${formatDate(post.date)}</span>
                <span class="blog-author">by ${post.author}</span>
            </div>
            <p class="blog-excerpt">${post.excerpt}</p>
            <div class="blog-tags">
                ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// Navigate to individual post
function navigateToPost(postId) {
    window.location.href = `./blog-post.html?id=${postId}`;
}

// Render single post on post page
function renderSinglePost(post) {
    const container = document.getElementById('blog-post-content');

    if (!post) {
        container.innerHTML = `
            <div class="blog-error">
                <p class="silk">Post not found</p>
                <p>The post you're looking for doesn't exist.</p>
                <a href="./blog.html" class="back-to-blog">
                    <span class="material-symbols-outlined">arrow_back</span>
                    Back to Blog
                </a>
            </div>
        `;
        return;
    }

    // Update page title
    document.title = `${post.title} | Elvis`;

    container.innerHTML = `
        <a href="./blog.html" class="back-to-blog">
            <span class="material-symbols-outlined">arrow_back</span>
            Back to Blog
        </a>

        <h1 class="blog-post-title">${post.title}</h1>

        <div class="blog-meta">
            <span class="blog-date">${formatDate(post.date)}</span>
            <span class="blog-author">by ${post.author}</span>
        </div>

        <div class="blog-tags">
            ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
        </div>

        <div class="blog-content">
            ${post.content}
        </div>

        <div class="comments-section">
            <h2 class="silk">Comments (${post.comments ? post.comments.length : 0})</h2>
            <div class="comments-list">
                ${renderComments(post.comments)}
            </div>
        </div>

        ${renderCommentForm()}

        <a href="./blog.html" class="back-to-blog">
            <span class="material-symbols-outlined">arrow_back</span>
            Back to Blog
        </a>
    `;
}

// Initialize blog listing page
async function initBlogListing() {
    const posts = await loadBlogPosts();

    if (posts === null) {
        const container = document.getElementById('blog-posts');
        container.innerHTML = `
            <div class="blog-error">
                <p class="silk">Error loading posts</p>
                <p>Please try again later.</p>
            </div>
        `;
        return;
    }

    renderBlogCards(posts);
}

// Initialize blog post page
async function initBlogPost() {
    // Get post ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        const container = document.getElementById('blog-post-content');
        container.innerHTML = `
            <div class="blog-error">
                <p class="silk">No post specified</p>
                <a href="./blog.html" class="back-to-blog">
                    <span class="material-symbols-outlined">arrow_back</span>
                    Back to Blog
                </a>
            </div>
        `;
        return;
    }

    const posts = await loadBlogPosts();

    if (posts === null) {
        const container = document.getElementById('blog-post-content');
        container.innerHTML = `
            <div class="blog-error">
                <p class="silk">Error loading post</p>
                <p>Please try again later.</p>
                <a href="./blog.html" class="back-to-blog">
                    <span class="material-symbols-outlined">arrow_back</span>
                    Back to Blog
                </a>
            </div>
        `;
        return;
    }

    const post = getPostById(postId);
    renderSinglePost(post);
}

// Auto-initialize based on page
document.addEventListener('DOMContentLoaded', () => {
    const blogPostsContainer = document.getElementById('blog-posts');
    const blogPostContent = document.getElementById('blog-post-content');

    if (blogPostsContainer) {
        // We're on the blog listing page
        initBlogListing();
    } else if (blogPostContent) {
        // We're on the individual post page
        initBlogPost();
    }
});
