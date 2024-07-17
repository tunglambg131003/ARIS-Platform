'use client';

import { useEffect, useState } from 'react';
import {
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	Text,
	VStack,
	Input,
	Modal,
	ModalOverlay,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalFooter,
	useToast,
	FormControl,
	Textarea,
	IconButton,
} from '@chakra-ui/react';
import Layout from '../navigation/layout';
import { AddIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';

const ProjectListItem = ({
	onClick,
	title,
	description,
	buttonProps,
	textProps,
}) => (
	<Box
		bg="gray.700"
		p={4}
		borderRadius="md"
		mb={2}
		cursor="pointer"
		_hover={{ bg: 'gray.600' }}
		onClick={onClick}
		{...buttonProps}
	>
		<HStack spacing={4}>
			<Box flex="1">
				<Heading size="md" color="white" {...textProps}>
					{title}
				</Heading>
				<Text color="gray.300" fontSize="sm" mt={2}>
					{description}
				</Text>
			</Box>
			<Button colorScheme="teal" size="sm" onClick={onClick}>
				Open
			</Button>
		</HStack>
	</Box>
);

const ProjectsListing = ({ user }) => {
	const [projects, setProjects] = useState([]);
	const [projectName, setProjectName] = useState('');
	const [description, setDescription] = useState('');
	const [modalOpen, setModalOpen] = useState(false);

	const [buttonPressed, setButtonPressed] = useState(false);
	const toast = useToast();
	const router = useRouter();

	useEffect(() => {
		async function fetchUserProjects() {
			const response = await fetch('/api/projects/fetch-user-projects', {
				method: 'POST',
				body: JSON.stringify({
					username: user,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
				const data = await response.json();
				// console.log(data.projects);
				setProjects(data.projects);
			} else {
				console.error('Failed to fetch projects');
			}
		}
		try {
			fetchUserProjects();
		} catch (error) {
			console.error(error);
		}
	}, [user]);

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

			const projName = user + '/' + projectName;
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
		window.location.reload();
	};

	return (
		<>
			<Layout>
				<Box bg="gray.900" minH="100vh" p={8}>
					<VStack spacing={4} align="stretch">
						<Heading color="white" mb={4}>
							Projects
						</Heading>
						{projects.map((project, index) => (
							<ProjectListItem
								key={index}
								title={project.name}
								description={project.description}
								onClick={() =>
									router.push(`/projects/${project.projectIdentifier}`)
								}
							/>
						))}
					</VStack>
				</Box>
			</Layout>
			<IconButton
				icon={<AddIcon />}
				onClick={() => setModalOpen(true)}
				position="fixed"
				bottom="2.5vw"
				right="2.5vw"
			/>
			<Modal
				isOpen={modalOpen}
				size="xl"
				isCentered
				onClose={() => setModalOpen(false)}
			>
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
									{user}
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

export default ProjectsListing;
