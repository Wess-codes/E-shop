"use client";

import Button from "@/app/components/Buttons";
import ProductImage from "@/app/components/pruducts/ProductImages";
import SetColor from "@/app/components/pruducts/SetColor";
import SetQuantity from "@/app/components/pruducts/SetQuantity";
import { useCart } from "@/hooks/useCart";
import { Rating } from "@mui/material";
import { useRouter } from "next/navigation";

import { useCallback, useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/md";

interface productDetailsProp{
    product: any
}
export type CartProductType = {
    id:string,
    name: string,
    descritpion: string,
    category: string,
    brand: string,
    selectedImage: SelectedImageType,
    quantity: number,
    price: number,
}

export type SelectedImageType = {
    color: string,
    colorCode: string,
    image: string   
}



const ProductDetails:React.FC<productDetailsProp> = ({product}) => {
   
    const productRating = product.reviews.reduce((acc: number, item: any) => acc + item.rating, 0) / product.reviews.length;


    const Horizontal = ()=>{
        return<hr className="w-[30%] my-2"/>    };
     
        const{handleAddProductToCart , cartProducts} = useCart();
        const [isCartProduct, setIsCartProduct] = useState(false);
        const[cartProduct, setCartProduct] = useState<CartProductType>({
            id: product.id,
            name: product.name,
            descritpion: product.description,
            category: product.category,
            brand: product.brand,
            selectedImage: { ...product.images[0] },
            quantity: 1,
            price: product.price,
        })

        const router = useRouter();

        useEffect(()=>{
            setIsCartProduct(false);
            if(cartProducts){
                const existingIdex = cartProducts.findIndex((item)=> item.id === product.id)

                if (existingIdex > -1){
                    setIsCartProduct(true);
                    
                }
            }
        },[cartProducts]);
        
       
        
        const handleColorSelect = useCallback((value: SelectedImageType)=>{
             setCartProduct((prev) =>{
                return{...prev, selectedImage: value};
             });
        },[cartProduct.selectedImage])

        const handleQtyIncrease = useCallback(()=>{
            if(cartProduct.quantity === 99){
                return;
            }
            setCartProduct((prev)=>{
                return{ ...prev, quantity: prev.quantity+1 };
            });
        },[cartProduct]);
        const handleQtyDecrease = useCallback(()=>{
            if(cartProduct.quantity === 1){
                return;
            }
            setCartProduct((prev)=>{
                
                return{ ...prev, quantity: prev.quantity -1 };
            });
        },[cartProduct]);

        
    return(
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ProductImage cartProduct={cartProduct} product={product} handleColorSelect={handleColorSelect} />
            <div>
                <h2 className="text-3xl font-medium text-slate-700">{product.name}</h2>
                <div className="flex items-center gap-2">
                    <Rating value={productRating} readOnly/>
                    <div className="">{product.reviews.length} Reviews</div>
                </div>
                <Horizontal/>
                <div className="text-justify">{product.description}</div>
                <Horizontal/>
                <div>
                    <span className="font-semibold">CATEGORY:</span>
                    {product.category}
                </div>
                <div>
                    <span className="font-semibold">BRAND:</span>
                    {product.brand}
                </div>
                <div className={product.inStock ? "text-teal-400" : "text-rose-400"}>{product.inStock ? "In stock" : "Out of stock"}</div>
                <Horizontal/>
                {isCartProduct? <> 
                <p className="mb-2 text-slate-400 flex items-center gap-1">
                <MdCheckCircle size={20} className="text-teal-400"/>
                Product added to cart</p> 
                <div className="max-w-[300px]">
                    <Button label='View cart' outlined onClick={()=>
                        {
                            
                            router.push("/cart")
                        }}
                         />
                </div>
                </>:
                <>
                <SetColor 
               cartProduct={cartProduct}
               images={product.images}
               handleColorSelect={handleColorSelect}/>
                <Horizontal />
                <SetQuantity 
                cartProduct={cartProduct}
                handleQtyIncrease={handleQtyIncrease}
                handleQtyDecrease={handleQtyDecrease}

                />
                <Horizontal />
                <div className="max-w-[300px]">
                    <Button  label='Add to cart' onClick={()=>handleAddProductToCart(cartProduct)} />
                         </div>
                </>}
               
            </div>
        </div> 
    );
};
export default ProductDetails;