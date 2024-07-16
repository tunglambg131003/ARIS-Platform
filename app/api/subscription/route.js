import Stripe from 'stripe';
import clientPromise from '@/lib/mongoClient';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json(
			{ message: 'You are not authenticated!' },
			{ status: 401 }
		);
	}

	const { planId } = await request.json();

	try {
		const customer = await stripe.customers.create({
			email: session.user.email,
		});

		const checkoutSession = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			customer: customer.id,
			line_items: [
				{
					price: planId,
					quantity: 1,
				},
			],
			mode: 'subscription',
			success_url: `https://buy.stripe.com/test_cN229x2O67Ni1e8288`,
			//   cancel_url: `${request.headers.origin}/cancel`,
		});

		const client = await clientPromise;
		const db = client.db();
		const userCollection = db.collection('user');
		const dataLimit = getDataLimit(planId);

		await userCollection.updateOne(
			{ email: session.user.email },
			{
				$set: {
					stripeCustomerId: customer.id,
					stripeSubscriptionId: checkoutSession.subscription,
					plan: planId,
					dataLimit: dataLimit,
				},
			}
		);

		return NextResponse.json(
			{ url: checkoutSession.url, dataLimit: dataLimit },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

function getDataLimit(planId) {
	switch (planId) {
		case 'price_1PNPyPLEQPR331aN9YkLX1BI':
			return 1 * 1024 * 1024 * 1024; // 1 GB in bytes
		case 'price_1PNSOwLEQPR331aNPx7Jld9T':
			return 2 * 1024 * 1024 * 1024; // 2 GB in bytes
		case 'price_1PNSPELEQPR331aNlIfW1Ypr':
			return 5 * 1024 * 1024 * 1024; // 5 GB in bytes
		default:
			return 0;
	}
}
