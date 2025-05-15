import React, { createContext, useState, useEffect } from "react";
import Axios from "axios";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [all_product, setProductos] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [stateSearch, SetSateSearch] = useState([]);

    useEffect(() => {
        cargarProductos(); 
    }, []);

    const cargarProductos = () => {
        Axios.post("http://localhost:4000/SearchAllProduct", {})
            .then((response) => {
                if (response.data.length > 0) {
                    setProductos(response.data);
                    setCartItems(getDefaultCart(response.data)); 
                }
            })
            .catch((error) => {
                console.error("No hay productos, error: ", error);
            });
    };

    const getDefaultCart = (products) => {
        let cart = {};
        for (let product of products) {
            cart[product.id] = 0;
        }
        return cart;
    };

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
        console.log(cartItems);
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) - 1 }));
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (let item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (let item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    };

    const addProduct = (nuevoProducto) => {
        Axios.post("http://localhost:4000/CreateProduct", nuevoProducto)
            .then((response) => {
                console.log("Producto añadido exitosamente:", response.data);
                cargarProductos(); 
            })
            .catch((error) => {
                console.error("Error al añadir el producto:", error);
            });
    };

    const contextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        all_product,
        setProductos,
        cartItems,
        addToCart,
        removeFromCart,
        addProduct,
        stateSearch, 
        SetSateSearch
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
