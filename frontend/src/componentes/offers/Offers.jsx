import React from "react"; 
import "./Offers.css";
import exclusive_image from "../assets/imagen-oro.jpg";

const Offers = () => {
    return (
        <div className="offers">
            <div className="offers-left">
                <h1>¡Ofertas Exclusivas!</h1>
                <h2>Solo en productos seleccionados de BET SELLERS</h2>
                <p>Descubre joyas de oro únicas y elegantes, diseñadas solo para ti. No dejes pasar esta oportunidad de obtener productos de lujo a precios inigualables.</p>
                <button>Ver Colección</button>
            </div>

            <div className="offers-right">
                <img src={exclusive_image} alt="Oferta Exclusiva" />
            </div>
        </div>
    )
}

export default Offers;
