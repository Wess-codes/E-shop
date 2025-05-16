import Container from "../components/Container";
import FormWrap from "../components/FormWrap";
import CheckoutClient from "./CheckOutClient";


const CheckOut = () => {
    return(
        <Container>
            <FormWrap>
                <CheckoutClient />
            </FormWrap>
        </Container>
    );
}
export default CheckOut;