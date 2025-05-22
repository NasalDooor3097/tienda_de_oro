import React, { useContext } from "react";
import "./CSS/ShopCategory.css"
import {ShopContext} from "../context/ShopContext"
import dropdown_icon from "../componentes/assets/dropdown_icon.png"
import Item from "../componentes/Item/Item"
import Footer from "../componentes/footer/Footer";

const ShopCategory = (props) =>{

    const {all_product} = useContext(ShopContext)


    return(
        <div className="shop-category">
            <div className="shop-category">
                <img className="shopcategory-banner" src={props.banner} alt="" />
                <div className="shgopcategory-indexSort">
                    <p>
                        <span>Mostrando 1-12</span>Faltantes 36 products
                    </p>

                    <div className="shopcategory-sort">
                        Sort by <img src={dropdown_icon} alt="" />
                    </div>
                </div>

                <div className="shopcategory-products">
                    {all_product.map((item, i)=>{
                        if (props.category===item.category){
                            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
                        }
                        else{
                            return null;
                        }
                    })}
                </div>
                <div className="shopcategory-loadmore">
                    Explore more
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default ShopCategory