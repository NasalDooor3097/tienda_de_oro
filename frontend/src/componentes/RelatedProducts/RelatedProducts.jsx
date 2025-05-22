import React, { useContext, useState, useEffect } from "react";
import "./RelatedProducts.css"
import data_product from "../assets/data"
import Item from "../Item/Item";
import Axios from "axios";


const RelatedProducts = () =>{


    
    const [productos, setProductos] = useState([]);

    
    useEffect(() => {


                Axios.post("http://localhost:4000/SearchAllProduct", {
                }).then((response) => {
                    if (response.data.length > 0) {
                        setProductos(response.data);
                    } else {
                        setProductos([]);
                    }
                }).catch((error) => {
                    console.error("No hay productos, error: ", error);
                    setProductos([]);
                });
        }, [])




    return(
        <div className="relatedproducts">
            <h1>Otros productos</h1>
            <hr />
            <div className="relatedproducts-item">
                
            {productos.length > 0 ? (
                productos.map((item, i) => (
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
                <p>Por el momento no hay productos</p>
            )}
            </div>
        </div>
    )
}

export default RelatedProducts