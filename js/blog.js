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

// Get post by ID
function getPostById(id) {
    return blogPosts.find(post => post.id === parseInt(id));
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
