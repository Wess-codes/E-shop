import { CartProductType } from "@/app/product/[productId]/productDetails";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {toast} from "react-hot-toast";

type CartContextType = {
    
    cartTotalAmount: number;
    cartTotalQty: number;
    cartProducts: CartProductType[] | null;
    handleAddProductToCart: (product: CartProductType) => void;
    handleRemoveProductFromCart: (product: CartProductType) => void;
    handleCartQtyIncrease: (product: CartProductType) => void;
    handleCartQtyDecrease: (product: CartProductType) => void;
    handleClearCart: ()=> void;
    handleSetPaymentIntent: (val: string | null) => void;
    paymentIntent: string | null;
    
}

export const CartContext = createContext<CartContextType | null>(null);


interface Props {
    [propName: string]: any;
};
export const CartContextProvider = (props: Props) =>{

    const [cartTotalAmount, setCartTotalAmount] = useState(0);
    const [ cartTotalQty, setCartTotalQty,]= useState(0);
    const [ cartProducts, setCardProducts] = useState<CartProductType[] | null>(null);
    
    const [paymentIntent, setPaymentIntent] = useState<string | null>(null);


    useEffect(()=>{
        const cartItems:any = localStorage.getItem("EshopCart");
        const cProducts:  CartProductType[] | null =  JSON.parse(cartItems);
        const eShopPaymentIntent: any = localStorage.getItem("EshopPaymentIntent");
        const paymentIntent: string| null = JSON.parse(eShopPaymentIntent);


        setCardProducts(cProducts);
        setPaymentIntent(paymentIntent);

    },[])

    console.log("qty", cartTotalQty);
    console.log("total", cartTotalAmount);

    

    useEffect(() => {
        const getTotals = () => {
            if (cartProducts) {
                const { total, qty } = cartProducts.reduce((acc, item) => {
                    const itemTotal = item.price * item.quantity;
    
                    acc.total += itemTotal;
                    acc.qty += item.quantity;
    
                    return acc;
                }, {
                    total: 0,
                    qty: 0,
                });
    
                setCartTotalQty(qty);
                setCartTotalAmount(total);
            }
        };
    
        // Call the function inside useEffect
        getTotals();
    }, [cartProducts]);
    
    console.log('qty',cartTotalQty);
    console.log('total',cartTotalQty);

    

    let updatedCart;
    const handleAddProductToCart = useCallback((product:CartProductType)=> {
        setCardProducts((prev) =>{
            
            if(prev){
                updatedCart = [...prev, product];
            }else{
                updatedCart = [product];
            }

            toast.success("Product added to cart");
            localStorage.setItem("EshopCart", JSON.stringify(updatedCart));
            return updatedCart;
        })
    }, []);

    const handleRemoveProductFromCart = useCallback((product:CartProductType)=>{
        if(cartProducts){
            const filteredProducts = cartProducts.filter((item) =>{
                item.id !== product.id
            })
            setCardProducts(filteredProducts)
            toast.success("Product remoed from cart");
            localStorage.setItem("EshopCart", JSON.stringify(filteredProducts));

        }
    },[cartProducts])


    const handleCartQtyIncrease = useCallback((product: CartProductType)=>{
        if(product.quantity === 99){
            return toast.error('Ooops! Maximum reached')
        }
        if(cartProducts){
            updatedCart = [...cartProducts]

            const existingIdex = cartProducts.findIndex((item)=> item.id === product.id);

            if(existingIdex > -1){
                updatedCart[existingIdex].quantity = ++updatedCart[existingIdex].quantity
            }

            setCardProducts(updatedCart)
            localStorage.setItem("EshopCart", JSON.stringify(updatedCart))

        }
    },[cartProducts]);

    const handleCartQtyDecrease = useCallback((product: CartProductType)=>{
        if(product.quantity === 1){
            return toast.error('Ooops! Minimum reached')
        }
        if(cartProducts){
            updatedCart = [...cartProducts]

            const existingIdex = cartProducts.findIndex((item)=> item.id === product.id);

            if(existingIdex > -1){
                updatedCart[existingIdex].quantity = --updatedCart[existingIdex].quantity
            }

            setCardProducts(updatedCart)
            localStorage.setItem("EshopCart", JSON.stringify(updatedCart))

        }
    },[cartProducts]);

    const handleClearCart = useCallback(()=>{
        setCardProducts(null)
        setCartTotalQty(0)
        localStorage.setItem("EshopCart", JSON.stringify(null))

    },[cartProducts])

    const handleSetPaymentIntent = useCallback((val: string | null) => {
        setPaymentIntent(val)
        localStorage.setItem("EshopPaymentIntent", JSON.stringify(val));
    },[paymentIntent]);

    const value = {
        cartTotalAmount,
        cartTotalQty,
        cartProducts,
        handleAddProductToCart,
        handleRemoveProductFromCart,
        handleCartQtyIncrease,
        handleCartQtyDecrease,
        handleClearCart,
        handleSetPaymentIntent,
        paymentIntent,
     }


    return<CartContext.Provider value={value} {...props}/>
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context=== null) {
        throw new Error("useCart must be used within a CartContextProvider");
    }
    return context;
};