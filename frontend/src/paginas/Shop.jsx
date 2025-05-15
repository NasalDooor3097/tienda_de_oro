import React, { useContext, useState, useEffect, useRef } from "react";
import Hero from "../componentes/hero/Hero";
import Popular from "../componentes/popular/Popular";
import Offers from "../componentes/offers/Offers";
import NewCollections from "../componentes/NewCollections/NewCollections";
import NewsLetter from "../componentes/NewsLetter/NewsLetter";
import Footer from "../componentes/footer/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CSS/Shop.css";
import { ShopContext } from "../context/ShopContext";
import { TfiSearch } from "react-icons/tfi";

const Shop = () => {
  const navigate = useNavigate();
  const [searchss, Setsearchss] = useState("");
  const { stateSearch, SetSateSearch } = useContext(ShopContext);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const searchRef = useRef(null);

  // 
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    // Cerrar el historial al hacer click fuera
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const BuscarProducto = (e) => {
    e.preventDefault();
    if (!searchss.trim()) return;


    const updatedHistory = [
      searchss,
      ...searchHistory.filter((item) => item !== searchss),
    ].slice(0, 4);

    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));

    navigate("/Busquedas");
    axios
      .post("http://localhost:4000/TitleProduct", {
        producto: searchss,
      })
      .then((results) => {
        SetSateSearch(results.data);
      });

    setShowHistory(false);
  };

  const selectFromHistory = (term) => {
    Setsearchss(term);
    setShowHistory(false);
  };

  const handleInputClick = () => {
    if (searchHistory.length > 0) {
      setShowHistory(true);
    }
  };

  return (
    <div>
      <form className="search" ref={searchRef}>
        <input
          className="input_search"
          onChange={(event) => Setsearchss(event.target.value)}
          onClick={handleInputClick}
          type="text"
          placeholder="¿Que estas buscando?"
          value={searchss}
        />
        <button className="button_search" onClick={BuscarProducto}>
          <TfiSearch className="icono_search" />
        </button>

        {/* Mostrar historial solo cuando showHistory es true */}
        {showHistory && searchHistory.length > 0 && (
          <div className="history-dropdown">
            {searchHistory.map((term, index) => (
              <div
                key={index}
                className="history-item"
                onClick={() => selectFromHistory(term)}
              >
                {term}
              </div>
            ))}
          </div>
        )}
      </form>

      <Hero />
      <Popular />
      <Offers />
      <NewCollections />
      <NewsLetter />
      <Footer />
    </div>
  );
};

export default Shop;
