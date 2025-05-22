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
    title: "Cómo destacar tus productos de tecnología en el mercado",
    excerpt:
      "Consejos esenciales para presentar y vender tus dispositivos electrónicos de manera efectiva.",
    author: "Equipo TecnoMarket",
    date: "15 Mayo 2025",
    tags: ["Tecnología", "Ventas"],
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    content:
      "En este artículo exploramos las mejores prácticas para vender productos tecnológicos, desde cómo describir sus características técnicas hasta cómo presentarlos visualmente para atraer a los compradores más exigentes...",
  },
  {
    id: 2,
    title: "Artesanías Mexicanas: Tradición que vende",
    excerpt:
      "Descubre cómo comercializar las hermosas artesanías tradicionales de México en plataformas digitales.",
    author: "María González",
    date: "22 Abril 2025",
    tags: ["Artesanías", "México"],
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJx4I9XtkYB7g_V6iKdVUXRunzNRd37wJTsA&s",
    content:
      "Las artesanías mexicanas son apreciadas mundialmente por su calidad y tradición. Aprende cómo empaquetarlas adecuadamente para envíos internacionales, cómo contar la historia detrás de cada pieza y dónde encontrar los mejores materiales...",
  },
  {
    id: 3,
    title: "Invertir en oro: Guía para principiantes",
    excerpt:
      "Todo lo que necesitas saber para comprar y vender oro de manera segura en nuestro marketplace.",
    author: "Roberto Mendoza",
    date: "10 Marzo 2025",
    tags: ["Oro", "Inversiones"],
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    content:
      "El oro sigue siendo una de las inversiones más seguras. En esta guía te explicamos cómo identificar oro auténtico, calcular su valor actual y las regulaciones importantes que debes conocer antes de comercializarlo...",
  },
  {
    id: 4,
    title: "Tendencias en gadgets tecnológicos 2023",
    excerpt:
      "Los dispositivos tecnológicos que están dominando el mercado este año.",
    author: "Laura Tech",
    date: "5 Junio 2025",
    tags: ["Gadgets", "Tecnología"],
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    content:
      "Exploramos los gadgets más populares del momento, desde wearables hasta dispositivos para el hogar inteligente, y cómo posicionarlos en el mercado competitivo de la tecnología...",
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
            <h1>Marketplace de Tecnología, Artesanías y Oro</h1>
            <p>Consejos, guías y tendencias para vendedores y coleccionistas</p>
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
              {selectedPost.id === 1 && (
                <>
                  <h3>Consejos para fotografiar productos tecnológicos</h3>
                  <p>
                    La presentación visual es crucial para vender tecnología.
                    Usa fondos limpios y neutros, muestra todos los ángulos del
                    producto y, si es posible, incluye fotos del dispositivo en
                    uso.
                  </p>
                  <h3>Especificaciones técnicas clave</h3>
                  <p>
                    No olvides incluir detalles como modelo exacto, año de
                    fabricación, estado del producto (nuevo, reacondicionado o
                    usado), y todas las especificaciones relevantes para tu
                    categoría.
                  </p>
                </>
              )}
              {selectedPost.id === 2 && (
                <>
                  <h3>Tipos de artesanías mexicanas más demandadas</h3>
                  <p>
                    El mercado internacional valora especialmente la plata de
                    Taxco, los textiles de Oaxaca, la cerámica de Talavera y las
                    piezas de alebrijes. Conocer las particularidades de cada
                    una te ayudará a comercializarlas mejor.
                  </p>
                  <h3>Certificados de autenticidad</h3>
                  <p>
                    Incluir certificados que garanticen el origen artesanal de
                    tus productos puede aumentar significativamente su valor
                    percibido y precio de venta.
                  </p>
                </>
              )}
              {selectedPost.id === 3 && (
                <>
                  <h3>Pureza del oro: qué significan los quilates</h3>
                  <p>
                    El oro de 24K es 99.9% puro, mientras que el de 18K contiene
                    75% oro. Explicar claramente la pureza y el peso en gramos
                    es fundamental para transacciones transparentes.
                  </p>
                  <h3>Precauciones de seguridad</h3>
                  <p>
                    Al vender oro, considera usar servicios de envío
                    especializados con seguro y siempre realiza transacciones
                    importantes en lugares seguros o a través de canales
                    verificados.
                  </p>
                </>
              )}
              {selectedPost.id === 4 && (
                <>
                  <h3>Dispositivos más populares</h3>
                  <p>
                    Los smartwatches con monitoreo de salud, los auriculares con
                    cancelación de ruido y los dispositivos para hogares
                    inteligentes lideran las ventas este año.
                  </p>
                  <h3>Dónde encontrar proveedores confiables</h3>
                  <p>
                    Te mostramos las ferias tecnológicas más importantes y
                    plataformas B2B donde puedes conectar con fabricantes y
                    distribuidores autorizados.
                  </p>
                </>
              )}
            </div>
          </article>
        </div>
      )}
    </div>
  );
};

export default Blog;
