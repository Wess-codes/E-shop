import prisma from "@/libs/prismadb";
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { CartProductType } from "@/app/product/[productId]/productDetails";
import { getCurrentUser } from "@/actions/getCurrentUser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-04-30.basil", // use latest stable version (adjust as needed)
});

// Calculate total order amount
const calculateOrderAmount = (items: CartProductType[]) => {
  const totalPrice = items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  return Math.floor(totalPrice); // convert to integer
};

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { items, payment_intent_id }: { items: CartProductType[]; payment_intent_id?: string } = body;

  const total = calculateOrderAmount(items) * 100;

  // Prepare order data for Prisma (embedded products array, no connect)
  const orderData = {
    user: { connect: { id: currentUser.id } },
    amount: total,
    currency: "usd",
    status: "pending",
    deliveryStatus: "pending",
    paymentIntentId: payment_intent_id || "",
    products: items, // ✅ direct embed
  };

  if (payment_intent_id) {
    const currentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (currentIntent) {
      const updatedIntent = await stripe.paymentIntents.update(payment_intent_id, { amount: total });

      const existingOrder = await prisma.order.findFirst({
        where: { paymentIntentId: payment_intent_id },
      });

      if (!existingOrder) {
        return NextResponse.json({ error: "Invalid payment intent" }, { status: 404 });
      }

      await prisma.order.update({
        where: { paymentIntentId: payment_intent_id },
        data: {
          amount: total,
          products: items, // ✅ embedded again
        },
      });

      return NextResponse.json({ paymentIntent: updatedIntent });
    }
  } else {
    // Create new Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    orderData.paymentIntentId = paymentIntent.id;

    await prisma.order.create({ data: orderData });

    return NextResponse.json({ paymentIntent });
  }

  return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
}
