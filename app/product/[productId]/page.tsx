import Container from "@/app/components/Container";
import ProductDetails from "./productDetails";
import ListRating from "@/app/components/pruducts/ListRating";
import  {products}  from "@/utils/products";

interface IPrams{
    productId?: string
  }

const Product = ({params}: {params : IPrams}) => {
    console.log("params", params);

   const product = products.find((item)=>item.id === params.productId)

    return(
        <div className="p-8">
            <Container>
                <ProductDetails product={product}/>
                <div className="flex flex-col mt-20 gap-4">
                    <div>Add rating</div>
                    <ListRating Product={product}/>
                </div>
            </Container>
        </div>
    );
};
export default Product;