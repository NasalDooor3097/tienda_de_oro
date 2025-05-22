import React, { useContext, useState } from "react";
import "./PorductDisplay.css";
import { ShopContext } from "../../context/ShopContext";  
import star_icon from "../assets/star_icon.png";
import star_dull_icon from "../assets/star_dull_icon.png";
import { FormContext } from "../../context/FormContext";
import { Link, useNavigate } from "react-router-dom";

const PorductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);
    const [isActive, setIsActive] = useState(false);
    const { logout } = useContext(FormContext);
    const navigate = useNavigate();
    const { userlist } = useContext(FormContext);

    const handleToggle = () => {
        setIsActive(!isActive);
    };
    
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isLoggedIn = userlist.length > 0 && userlist.some(user => user.user_name && user.user_name.trim() !== "");

    return (
        <div className="productdisplay">
            <div className="productdisplay-left">
                <div className="productdisplay-img-list"></div>
                <div className="productdisplay-img">
                    <img className="productdisplay-main-img" src={`http://localhost:4000/${product.img1}`} alt={product.name} />                    
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.titulo}</h1>
                <div className="productdisplay-right-star">
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_dull_icon} alt="" />
                    <p>(122)</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">${product.old_price}</div>
                    <div className="productdisplay-right-price-new">${product.new_price}</div>
                </div>
                <div className="productdisplay-right-description"></div>
                <div className="product-right-size">
                    <h1>Select Size</h1>
                    <div className="productdisplay-right-size">
                        <div>1</div>
                        <div>2</div>
                        <div>3</div>
                        <div>4</div>
                        <div>5</div>
                    </div>
                </div>
                {isLoggedIn ? (
                    <button onClick={() => { addToCart(product.id) }}>Agregar al carrito</button>
                ) : (
                    <Link to={"/login"}><button>Iniciar sesión</button></Link>
                )}
            </div>
        </div>
    );
};

export default PorductDisplay;
