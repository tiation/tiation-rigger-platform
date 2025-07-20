import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const PLANS = {
  starter: {
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    amount: 9900, // $99.00
  },
  professional: {
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    amount: 19900, // $199.00
  },
  enterprise: {
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    amount: 39900, // $399.00
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { plan } = req.body;
    
    if (!PLANS[plan]) {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: PLANS[plan].priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/pricing`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Error creating checkout session' });
  }
}
