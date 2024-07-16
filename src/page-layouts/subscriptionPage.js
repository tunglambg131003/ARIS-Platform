// pages/subscriptionPage.js
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const plans = [
	{
		id: 'price_1PNPyPLEQPR331aN9YkLX1BI',
		name: 'Basic',
		price: 10,
		limit: '1 GB',
	},
	{
		id: 'price_1PNSOwLEQPR331aNPx7Jld9T',
		name: 'Pro',
		price: 20,
		limit: '2 GB',
	},
	{
		id: 'price_1PNSPELEQPR331aNlIfW1Ypr',
		name: 'Rich',
		price: 69,
		limit: '5 GB',
	},
];

const SubscriptionForm = () => {
	const [dataLimit, setDataLimit] = useState(null);
	const router = useRouter();

	const handleSubscribe = async (planId) => {
		try {
			const response = await fetch('/api/subscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ planId }),
			});

			const data = await response.json();

			if (response.ok && data.url) {
				setDataLimit(data.dataLimit);
				window.location.href = data.url;
			} else {
				console.error('Error creating checkout session:', data.error);
			}
		} catch (error) {
			console.error('An error occurred:', error);
		}
	};

	return (
		<div>
			<h1>Choose a Plan</h1>
			<ul>
				{plans.map((plan) => (
					<li key={plan.id}>
						<h2>{plan.name}</h2>
						<p>${plan.price} per month</p>
						<p>Storage: {plan.limit}</p>
						<button onClick={() => handleSubscribe(plan.id)}>Subscribe</button>
					</li>
				))}
			</ul>
			{dataLimit && <p>Your data limit is: {dataLimit} bytes</p>}
		</div>
	);
};

export default SubscriptionForm;
