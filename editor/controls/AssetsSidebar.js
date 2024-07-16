'use client';

import { Flex, Text, Box, Image } from '@chakra-ui/react';
import { useModelStateStore } from '../store/useStore';
import { v4 as uuidv4 } from 'uuid';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const AssetButton = ({ assetName, assetURL, assetImgUrl }) => {
	const { addModel } = useModelStateStore();

	const handleAddModel = () => {
		const loader = new GLTFLoader();
		loader.load(assetURL, (gltf) => {
			const mesh = gltf.scene;
			const uuid = uuidv4();
			addModel(mesh, assetName, uuid);
			// console.log(mesh);
		});
	};

	return (
		<Box
			as="button"
			onClick={handleAddModel}
			width="100%"
			// height="150px"
			borderWidth="1px"
			borderRadius="lg"
			overflow="hidden"
			textAlign="center"
			mb="20px"
			_hover={{
				boxShadow: 'md',
				cursor: 'pointer',
				transform: 'translateY(-2px)',
			}} // Slight lift effect on hover
			transition="transform 0.2s, box-shadow 0.2s" // Smooth transition for hover effect
		>
			<Image
				src={assetImgUrl}
				alt={`Image of ${assetName}`}
				width="100%"
				height="150px" // This makes the image height adjust to its aspect ratio
				objectFit="cover"
			/>
			<Text fontSize="lg" fontWeight="bold" mt="2" mb="2">
				{assetName}
			</Text>
		</Box>
	);
};

const AssetsSidebar = () => {
	return (
		<Flex
			position="fixed"
			width="300px"
			height="calc(100vh - 64px)"
			left="0"
			margin="32px"
			zIndex={99}
			boxShadow={'0px 0px 10px 0px rgba(0,0,0,0.75)'}
			bgColor={'#292d39'}
			borderRadius={'12px'}
			// padding={'24px'}
			alignItems={'center'}
			flexDirection={'column'}
			// alignItems={'center'}
		>
			<Flex height="70px" justifyContent={'center'} alignItems={'center'}>
				<Text fontFamily="Monospace" color="#8c92a3" fontSize="2xl">
					Assets
				</Text>
			</Flex>
			<Flex
				width="100%"
				borderRadius={'12px 12px 0 0 '}
				// justifyContent={'center'}
				alignItems={'center'}
				padding={'24px'}
				bgColor="#181c20"
				flexDir={'column'}
				height="calc(100% - 70px)"
				overflowY={'scroll'}
			>
				<Box>
					<AssetButton
						assetName="Bird.glb"
						assetURL="/Bird.glb"
						assetImgUrl="/Bird.png"
					/>
					<AssetButton
						assetName="Farm.glb"
						assetURL="/farm.glb"
						assetImgUrl="/Farm.png"
					/>
					<AssetButton
						assetName="Heart.glb"
						assetURL="/heart.glb"
						assetImgUrl="/Heart.png"
					/>
					<AssetButton
						assetName="Chicken.glb"
						assetURL="/chicken.glb"
						assetImgUrl="/chicken.png"
					/>
					<AssetButton
						assetName="Earth.glb"
						assetURL="/earth.glb"
						assetImgUrl="/earth.png"
					/>
					<AssetButton
						assetName="animated Robot"
						assetURL="/RobotExpressive.glb"
						assetImgUrl="/expressive robot.png"
					/>
					<AssetButton
						assetName="skull"
						assetURL="/skull.glb"
						assetImgUrl="/expressive robot.png"
					/>
				</Box>
			</Flex>
		</Flex>
	);
};

export default AssetsSidebar;
