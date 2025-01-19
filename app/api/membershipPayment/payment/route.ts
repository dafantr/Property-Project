import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
import { type NextRequest, type NextResponse } from 'next/server';
import db from '@/utils/db';
import { calculateRegistrationFee } from '@/utils/calculateTotals';

export const POST = async (req: NextRequest, res: NextResponse) => {
    const requestHeaders = new Headers(req.headers);
    const origin = requestHeaders.get('origin');

    const { memberId, transactionId } = await req.json();

    const member = await db.member.findFirst({
        where: { memberId: memberId }
    });

    const { subTotal, tax, orderTotal } = await calculateRegistrationFee();

    if (member === null) {
        return Response.json(null, {
            status: 404,
            statusText: 'Not Found',
        });
    }
    
    try {
        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            metadata: { memberId: member.id, transactionId: transactionId },
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: 'idr',

                        product_data: {
                            name: `Membership Registration Detail`,
                            description: `Become Million Dollar Villa's Exclusive Member`,
                        },
                        unit_amount: orderTotal * 100,
                    },
                },
            ],
            mode: 'payment',
            return_url: `${origin}/api/membershipPayment/confirm?session_id={CHECKOUT_SESSION_ID}`,
        });

        return Response.json({ clientSecret: session.client_secret });
    } catch (error) {
        console.log(error);

        return Response.json(null, {
            status: 500,
            statusText: 'Internal Server Error',
        });
    }
};

function getMembershipPrice(tierId: any): number | undefined {
    throw new Error('Function not implemented.');
}
