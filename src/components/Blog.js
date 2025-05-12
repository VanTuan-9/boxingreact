import React from 'react';

function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "Essential Tips for Beginners",
      author: "Coach John Smith",
      date: "April 15, 2024",
      excerpt: "Starting your boxing journey? Here are the key things you need to know...",
      image: "/images/beginner-tips.jpg"
    },
    {
      id: 2,
      title: "Advanced Footwork Techniques",
      author: "Coach Sarah Johnson",
      date: "April 10, 2024",
      excerpt: "Improve your ring movement with these professional footwork drills...",
      image: "/images/footwork.jpg"
    }
  ];

  return (
    <div className="blog-container">
      <h2>Boxing Blog</h2>
      <div className="blog-grid">
        {blogPosts.map(post => (
          <div key={post.id} className="blog-card">
            <div className="blog-image">
              <img src={post.image} alt={post.title} />
            </div>
            <div className="blog-content">
              <h3>{post.title}</h3>
              <div className="blog-meta">
                <span>{post.author}</span>
                <span>{post.date}</span>
              </div>
              <p>{post.excerpt}</p>
              <button className="read-more">Read More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blog;