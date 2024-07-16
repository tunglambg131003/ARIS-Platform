'use client';

import React, { useState, useEffect } from 'react';
import {
	Box,
	Flex,
	Text,
	Button,
	Grid,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	Heading,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import Sidebargeneral from '@/src/navigation/Sidebar';
import classes from '@/styles/asssets.module.css';
import { Image } from '@chakra-ui/react';

const NavCard = ({ title, asset, thumbnail }) => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const onClick = async () => {
		setLoading(true);
		const res = await fetch('/api/assets/grab', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				assetID: asset._id,
			}),
		});
		const data = await res.json();
		console.log(res);
		console.log(data);
		router.push(`/render/${data.body.modelID}`);
		setLoading(false);
	};
	return (
		<Flex direction="column" alignItems="center" margin="2px">
			<Card
				backgroundColor={'gray.500'}
				width={'350px'}
				onClick={onClick}
				className={classes.assetCard}
			>
				<Image
					src={thumbnail}
					alt={`Thumbnail for ${title}`}
					width="100%"
					height="200px"
					objectFit="cover"
				/>
			</Card>
			<Heading mt={2} fontWeight="bold" color="white">
				{title}
			</Heading>
		</Flex>
	);
};

const TestHome = () => {
	const [assets, setAssets] = useState([]);
	useEffect(() => {
		const getAssets = async () => {
			const res = await fetch('/api/assets/grab');
			const data = await res.json();
			console.log(data);
			setAssets(data.body.assets);
		};

		getAssets();
	}, []);

	return (
		<Box backgroundColor="#191a1d" minHeight="200vh" width="150vw">
			<Grid padding="0 32px" templateColumns="200px auto">
				<Box></Box>
				<Box>
					<Box height={'100px'} />
					<Heading color={'white'}></Heading>
					<Box height={'100px'} />
					<Heading color={'white'}>Try our assets</Heading>
					<Sidebargeneral />
					<Flex>
						{assets.map((asset, i) => {
							return (
								<NavCard
									title={asset.name}
									action="View"
									key={`asset-${i}`}
									asset={asset}
									thumbnail={asset.thumbnailUrl}
								/>
							);
						})}
						{/* <NavCard title="User" action="User" /> */}
					</Flex>
				</Box>
			</Grid>
		</Box>
	);
};

export default TestHome;
