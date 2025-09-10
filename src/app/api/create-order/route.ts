
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { z } from 'zod';

const orderSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3),
});

export async function POST(request: Request) {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error('!!! CRITICAL: Razorpay environment variables are not set on the server.');
    console.error('!!! NEXT_PUBLIC_RAZORPAY_KEY_ID found:', !!keyId);
    console.error('!!! RAZORPAY_KEY_SECRET found:', !!keySecret);
    return NextResponse.json({ error: 'Server configuration error: Missing Razorpay credentials. Please check server logs.' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const parsedBody = orderSchema.safeParse(body);

    if (!parsedBody.success) {
      console.error('Invalid request body:', parsedBody.error.flatten());
      return NextResponse.json({ error: 'Invalid request body', details: parsedBody.error.flatten() }, { status: 400 });
    }

    const { amount, currency } = parsedBody.data;

    const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });

    const options = {
      amount, // amount in the smallest currency unit
      currency,
      receipt: `receipt_order_${new Date().getTime()}`,
    };
    
    console.log("Attempting to create Razorpay order with options:", options);
    const order = await razorpay.orders.create(options);
    console.log("Successfully created Razorpay order:", order);

    return NextResponse.json(order, { status: 200 });
    
  } catch (error) {
    console.error('!!! Razorpay order creation failed:', error);
    if (error instanceof Error) {
        // Check for specific Razorpay error structure
        if ('statusCode' in error && 'error' in error) {
            const rzpError = error as any;
            console.error('Razorpay Error Details:', rzpError.error);
            return NextResponse.json({ error: `Razorpay API Error: ${rzpError.error.description || rzpError.message}` }, { status: rzpError.statusCode || 500 });
        }
        return NextResponse.json({ error: `Razorpay API Error: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred during payment processing.' }, { status: 500 });
  }
}
