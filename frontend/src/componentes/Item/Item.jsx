import React, { useEffect, useState } from "react";
import "./Item.css";
import { Link } from "react-router-dom";

const Item = (props) => {
    const [product, setProduct] = useState(props); 

    useEffect(() => {

        setProduct(props);
    }, []);

    return (
        <div className="item">
            <Link to={`/product/${product.id}`}>
                <img onClick={() => window.scrollTo(0, 0)} src={product.image} alt="" />
            </Link>
            <p>{product.name}</p>
            <div className="item-prices">
                <div className="item-price-new">
                    ${product.new_price}
                </div>
                <div className="item-price-old">
                    ${product.old_price}
                </div>
            </div>
        </div>
    );
};

export default Item;
