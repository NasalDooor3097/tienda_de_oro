import React, { useContext, useState } from "react";
import "./SellProduct.css";
import { ShopContext } from "../../context/ShopContext";
import { FormContext } from "../../context/FormContext";
import { Link } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";

const SellProduct = () => {
  const [titulo, SetTitulo] = useState("");
  const [new_price, SetNewPrice] = useState("");
  const [old_price, SetOldPrice] = useState("");
  const [img1, SetImg] = useState(null); // Inicialmente null
  const [tipo, SetTipo] = useState("");
  const { userlist } = useContext(FormContext);
  const { addProduct } = useContext(ShopContext);

  const handleAddProduct = () => {
    userlist.forEach((user) => {
      const id_user = user.id;
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("new_price", new_price);
      formData.append("old_price", old_price);
      formData.append("photo", img1); // Usar "photo" para que coincida con el nombre en el servidor
      formData.append("id_user", id_user);
      formData.append("tipo", tipo);

      addProduct(formData);
    });
  };

  return (
    <div className="SellProductContainer">
      <h2 className="SellProductTitle">
        {" "}
        <AiOutlinePlusCircle size={32} /> Agregar Producto
      </h2>
      <input
        className="SellProductInput"
        onChange={(event) => SetTitulo(event.target.value)}
        type="text"
        placeholder="Ingresa un título descriptivo"
      />
      <input
        className="SellProductInput"
        onChange={(event) => SetNewPrice(event.target.value)}
        type="number"
        placeholder="Cual es el precio del producto"
      />
      <input
        className="SellProductInput"
        onChange={(event) => SetImg(event.target.files[0])} // Usar `event.target.files[0]`
        type="file"
      />
      <select
        className="SellProductInput"
        onChange={(event) => SetTipo(event.target.value)} // Cambiar aquí
      >
        <option value="">Sin categoria</option>
        <option value="Tecnologia">Tecnologia</option>
        <option value="Manualidades">Manualidades</option>
        <option value="Ropa">👗 Ropa</option>
        <option value="Zapatos">👠 Zapatos</option>
        <option value="Accesorios">Accesorios</option>
        <option value="Maquillaje">💄 Maquillaje</option>
        <option value="Perfumes">Perfumes</option>
        <option value="Bolsos">👜 Bolsos</option>
        <option value="Juguetes">Juguetes</option>
        <option value="Otros">Otros</option>
      </select>
      <Link to="/">
        <button className="SellProductButton" onClick={handleAddProduct}>
          Agregar <AiOutlinePlusCircle size={20} />
        </button>
      </Link>
    </div>
  );
};

export default SellProduct;
