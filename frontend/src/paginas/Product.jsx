import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import {ShopContext} from "../context/ShopContext"
import Breadcrum from "../componentes/Breadcrum/Breadcrum";
import PorductDisplay from "../componentes/PorductDisplay/PorductDisplay";
import RelatedProducts from "../componentes/RelatedProducts/RelatedProducts";

const Product = () =>{
    const {all_product} = useContext(ShopContext)
    const {productId} = useParams()
    const product = all_product.find((e) => e.id === Number(productId))
    return(
        <div>
            <PorductDisplay product={product}/>
            <RelatedProducts/>
        </div>
    )
}

export default Product