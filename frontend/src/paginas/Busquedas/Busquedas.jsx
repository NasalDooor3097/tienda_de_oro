import React, { useContext } from "react";
import "./Busquedas.css";
import { ShopContext } from "../../context/ShopContext"; // Importar el contexto correcto
import Item from "../../componentes/Item/Item";

const Busquedas = () => {
  const { stateSearch, SetSateSearch } = useContext(ShopContext); // Usar el contexto correcto


  const searchFound = stateSearch.length > 0 ? true : false;

  return (
    <div>

      {searchFound ? (
        stateSearch.map((item, i) => (
          <Item 
            key={i} 
            id={item.id} 
            name={item.titulo} 
            image={`http://localhost:4000/${item.img1}`} 
            old_price={item.old_price} 
            new_price={item.new_price} 
          />
        ))
      ) : (
        <h1 className="busquedas">No se encontraron resultados</h1>
      )}
    </div>
  );
};

export default Busquedas;
