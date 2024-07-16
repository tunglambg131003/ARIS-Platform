'use client';

import React from 'react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
	Text,
	Box,
	Button,
	Flex,
	Input,
	Modal,
	ModalOverlay,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalFooter,
	useToast,
	FormControl,
	VStack,
	Textarea,
} from '@chakra-ui/react';
import Image from 'next/image';

const NewProjectPage = () => {
	const session = useSession();
	const [projectName, setProjectName] = useState('');
	const [description, setDescription] = useState('');

	const [buttonPressed, setButtonPressed] = useState(false);
	const toast = useToast();

	const createProject = async () => {
		setButtonPressed(true);
		try {
			if (!projectName) {
				throw new Error('Project name must not be empty.');
			}
			if (!/^[a-zA-Z0-9_]*$/.test(projectName)) {
				throw new Error('Project name must not contain special characters.');
			}
			if (projectName.length > 100) {
				throw new Error('Project name must not exceed 100 characters.');
			}
			if (description.length > 500) {
				throw new Error('Description must not exceed 500 characters.');
			}

			const projName = session.data?.user?.username + '/' + projectName;
			const res = await fetch('/api/projects/create', {
				method: 'POST',
				body: JSON.stringify({
					projectName: projectName,
					projectIdentifier: projName,
					description: description,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!res.ok) {
				const msg = await res.json();
				console.log(msg);
				throw new Error('Project creation failed: ' + msg.message);
			}

			toast({
				title: 'Project created successfully!',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
		} catch (err) {
			console.error(err);
			toast({
				title: 'Project creation failed.',
				description: err.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
		setButtonPressed(false);
	};

	// console.log('from projects: ', session.data.user.username);
	return (
		<>
			<Box
				height="100vh"
				width={'100vw'}
				maxHeight={'100vh'}
				maxWidth={'100vw'}
				backgroundColor="#2f3730"
			>
				<Image
					src="/resc.webp"
					alt="background"
					layout="fill"
					objectFit="cover"
					style={{ filter: 'blur(10px)' }}
				/>
			</Box>
			<Modal isOpen={true} size="xl" isCentered>
				<ModalOverlay />
				<ModalContent bg="gray.900">
					<ModalHeader color="white">New Project</ModalHeader>
					<ModalBody>
						<VStack align="left" spacing={4}>
							<Flex alignItems="center">
								<Text color="white" width="150px" fontWeight="bold">
									Owner
								</Text>
								<Text color="white" fontWeight="bold">
									Project Name
								</Text>
							</Flex>
							<Flex alignItems="center">
								<Text fontWeight={500} color="white" width="150px">
									{session.data?.user?.username}
								</Text>
								<Text margin="0 16px" color="white">
									/
								</Text>
								<FormControl isRequired>
									<Input
										border={'1px solid white'}
										width="200px"
										onChange={(event) => setProjectName(event.target.value)}
										color="white"
									/>
								</FormControl>
							</Flex>
							<Text color={'white'} fontWeight="bold" mt={4}>
								Description
							</Text>
							<Textarea
								placeholder="A short, memorable description..."
								color="white"
								onChange={(event) => setDescription(event.target.value)}
							/>
						</VStack>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							disabled={buttonPressed}
							onClick={() => createProject()}
						>
							Continue
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default NewProjectPage;
