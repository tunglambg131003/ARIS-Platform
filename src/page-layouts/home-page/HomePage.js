'use client';

import React, { useEffect, useContext } from 'react';
import {
	Box,
	Button,
	Heading,
	Image,
	SimpleGrid,
	Text,
	VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FileContext } from '@/context/FileProvider';
import { useUploadModel } from '@/context/UploadModelContext';
import Layout from '@/src/navigation/layout';

// src/components/ActivityCard.js

const ActivityCard = ({ activity }) => (
	<Box p={4} shadow="md" borderWidth="1px" borderRadius="md">
		<Heading fontSize="lg">
			{activity.action}: {activity.modelName}
		</Heading>
		<Text mt={4}>Date: {new Date(activity.date).toLocaleString()}</Text>
	</Box>
);

// Individual Box Component
const ThumbnailBox = ({ onClick, src, alt, label, buttonProps, textProps }) => (
	<Box position="relative">
		<Button
			onClick={onClick}
			w="full"
			h="200px"
			borderRadius={12}
			position="relative"
			overflow="hidden"
			p={0}
			{...buttonProps}
		>
			<Image
				src={src}
				alt={alt}
				boxSize="full"
				objectFit="cover"
				position="absolute"
				top={0}
				left={0}
			/>
		</Button>
		<Text textAlign="center" mt={2} color="white" {...textProps}>
			{label}
		</Text>
	</Box>
);

function HomePageTest() {
	const router = useRouter();
	const { fileData } = useContext(FileContext);
	const { activities, setActivities } = useUploadModel();

	useEffect(() => {
		if (fileData) {
			const newActivity = {
				action: 'Uploaded',
				modelName: fileData.name,
				date: new Date(),
			};

			setActivities((prevActivities) => [...prevActivities, newActivity]);
		}
	}, [fileData, setActivities]);

	const modelViewer = () => {
		router.push('/upload');
	};

	const editor = () => {
		router.push('/editor');
	};

	const asset = () => {
		router.push('/assetspage');
	};

	const projects = () => {
		router.push('/projects');
	};
	return (
		<Layout>
			<VStack
				spacing={8}
				align="left"
				background="gray.900"
				pt={4}
				pb={4}
				pr={8}
				pl={8}
			>
				<Heading color="white">Home</Heading>
				<SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={8}>
					<ThumbnailBox
						onClick={modelViewer}
						src="/theme/home_page/Model_Viewer.png"
						alt="Model Viewer"
						label="Model Viewer"
					/>
					<ThumbnailBox
						onClick={editor}
						src="/theme/home_page/Image_Tracking.png"
						alt="Image Tracking"
						label="Image Tracking"
					/>
					<ThumbnailBox
						onClick={editor}
						src="/theme/home_page/Face_Tracking.png"
						alt="Face Tracking"
						label="Face Tracking"
					/>
				</SimpleGrid>

				<Heading color="white">Recent</Heading>
				<SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={8}>
					{activities &&
						activities.map((activity, index) => (
							<ActivityCard key={index} activity={activity} />
						))}
					<ThumbnailBox
						onClick={editor}
						src="/theme/home_page/Editor_Background.png"
						alt="Editor"
						label="Editor"
					/>
					<ThumbnailBox
						onClick={projects}
						src="/theme/home_page/logo.png"
						alt="Editor"
						label="Projects"
					/>
				</SimpleGrid>
			</VStack>
		</Layout>
	);
}

export default HomePageTest;
