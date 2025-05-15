import React, { useState } from "react";
import "./Blog.css";
import {
  AiOutlineCalendar,
  AiOutlineUser,
  AiOutlineTags,
} from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";

// Datos de ejemplo para las publicaciones
const initialPosts = [
  {
    id: 1,
    title: "Cómo vender más en tu marketplace",
    excerpt:
      "Aprende las estrategias clave para aumentar tus ventas en nuestra plataforma.",
    author: "Equipo Marketplace",
    date: "15 Mayo 2023",
    tags: ["Ventas", "Consejos"],
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    content: "Contenido completo del artículo...",
  },
  {
    id: 2,
    title: "Tendencias de e-commerce para 2023",
    excerpt:
      "Descubre las tendencias que están marcando este año en el comercio electrónico.",
    author: "Ana Pérez",
    date: "22 Abril 2023",
    tags: ["Tendencias", "E-commerce"],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    content: "Contenido completo del artículo...",
  },
  {
    id: 3,
    title: "Guía para nuevos vendedores",
    excerpt:
      "Todo lo que necesitas saber para empezar a vender en nuestra plataforma.",
    author: "Carlos Rodríguez",
    date: "10 Marzo 2023",
    tags: ["Guías", "Vendedores"],
    image:
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    content: "Contenido completo del artículo...",
  },
];

const Blog = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleReadMore = (post) => {
    setSelectedPost(post);
  };

  const handleBackToList = () => {
    setSelectedPost(null);
  };

  return (
    <div className="blog-container">
      {!selectedPost ? (
        <>
          <section className="blog-header">
            <h1>Blog del Marketplace</h1>
            <p>Consejos, noticias y tendencias para vendedores y compradores</p>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </section>

          <div className="blog-grid">
            {filteredPosts.map((post) => (
              <article key={post.id} className="blog-card">
                <div className="card-image">
                  <img src={post.image} alt={post.title} />
                </div>
                <div className="card-content">
                  <div className="post-meta">
                    <span>
                      <AiOutlineUser /> {post.author}
                    </span>
                    <span>
                      <AiOutlineCalendar /> {post.date}
                    </span>
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <div className="post-tags">
                    <AiOutlineTags />
                    {post.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    className="read-more"
                    onClick={() => handleReadMore(post)}
                  >
                    Leer más <BsArrowRight />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="post-detail">
          <button className="back-button" onClick={handleBackToList}>
            ← Volver al blog
          </button>
          <article>
            <div className="post-header">
              <h1>{selectedPost.title}</h1>
              <div className="post-meta">
                <span>
                  <AiOutlineUser /> {selectedPost.author}
                </span>
                <span>
                  <AiOutlineCalendar /> {selectedPost.date}
                </span>
              </div>
              <div className="post-tags">
                <AiOutlineTags />
                {selectedPost.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="post-image">
              <img src={selectedPost.image} alt={selectedPost.title} />
            </div>
            <div className="post-content">
              <p>{selectedPost.content}</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                in dui mauris. Vivamus hendrerit arcu sed erat molestie
                vehicula.
              </p>
              <p>
                Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
                Ut in nulla enim. Phasellus molestie magna non est bibendum non
                venenatis nisl tempor.
              </p>
            </div>
          </article>
        </div>
      )}
    </div>
  );
};

export default Blog;
