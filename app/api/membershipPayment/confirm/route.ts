import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

import { type NextRequest } from 'next/server';
import db from '@/utils/db';
import { distributeCommission, updateMemberTier } from '@/utils/actions';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get('session_id') as string;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    // console.log(session);

    const memberId = session.metadata?.memberId;
    const transactionId = session.metadata?.transactionId;
    if (session.status === 'complete' && memberId && transactionId) {

      const membershipCommissionTransaction = await db.membershipCommissionTransaction.findFirst({
        where: { id: transactionId }
      });
      
      if( membershipCommissionTransaction === null ) {
        return Response.json(null, {
          status: 404,
          statusText: 'Membership transaction not found',
        });
      }

      await db.member.update({
        where: { id: memberId },
        data: { isActive: 1},
      });

      if(membershipCommissionTransaction.referalCode) {
        await distributeCommission(transactionId, 'membership');
        await updateMemberTier(membershipCommissionTransaction.referalCode as string);
      }
      if(membershipCommissionTransaction.closerId) {
        await distributeCommission(transactionId, 'closer');
      }

      await db.membershipCommissionTransaction.update({
        where: { id: transactionId },
        data: { paymentStatus: true },
      });

        return new Response(null, {
          status: 303, // See Other
          headers: {
            'Location': '/member/dashboard' // or wherever you want to redirect
          },
        });
    }
  } catch (err) {
    console.log(err);
    return Response.json(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
};