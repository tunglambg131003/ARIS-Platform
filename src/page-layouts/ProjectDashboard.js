'use client';

import { useEffect, useState } from 'react';
import {
	Box,
	Button,
	Heading,
	SimpleGrid,
	Text,
	VStack,
	useToast,
	Spinner,
} from '@chakra-ui/react';
import Layout from '../navigation/layout';
import { useRouter } from 'next/navigation';

const ProjectDashboard = ({ user, projectName }) => {
	const toast = useToast();
	const router = useRouter();
	const [projectData, setProjectData] = useState(null);

	useEffect(() => {
		if (user && projectName) {
			// Fetch project data based on slugs
			const fetchData = async () => {
				try {
					const response = await fetch(`/api/projects/project-by-identifier`, {
						method: 'POST',
						body: JSON.stringify({
							projectIdentifier: user + '/' + projectName,
						}),
						headers: {
							'Content-Type': 'application/json',
						},
					});
					const data = await response.json();
					if (!response.ok) throw new Error(data.message);
					setProjectData(data);
				} catch (error) {
					toast({
						title: 'Error fetching project data.',
						description: error.message,
						status: 'error',
						duration: 5000,
						isClosable: true,
					});
				}
			};

			fetchData();
		}
	});

	return (
		<Layout>
			<Box minH="100vh" bg="gray.900" color="white" p={4} pl={8} pr={8}>
				<VStack spacing={8} align="stretch">
					<Heading>Project Dashboard</Heading>
					{projectData ? (
						<>
							<Text fontSize="xl">User: {user}</Text>
							<Text fontSize="xl">Project: {projectName}</Text>

							<SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={8}>
								<Button
									p={6}
									bg="gray.700"
									borderRadius="md"
									boxShadow="lg"
									display="flex"
									flexDirection="column"
									alignItems="center"
									h="150px"
									onClick={() =>
										toast({
											title: 'Wait',
											description: 'This feature is not yet implemented.',
											status: 'info',
											duration: 5000,
											isClosable: true,
										})
									}
									_hover={{ bg: 'gray.800' }}
									_focus={{ boxShadow: 'outline' }}
								>
									<Heading size="md" color="white">
										View in AR
									</Heading>
								</Button>
								<Button
									p={6}
									bg="gray.700"
									borderRadius="md"
									boxShadow="lg"
									display="flex"
									flexDirection="column"
									alignItems="center"
									h="150px"
									onClick={() =>
										router.push(`/projects/${user}/${projectName}/edit`)
										// console.log('presseds')
									}
									_hover={{ bg: 'gray.800' }}
									_focus={{ boxShadow: 'outline' }}
								>
									<Heading size="md" color="white">
										Edit with 3D editor
									</Heading>
								</Button>
								<Button
									p={6}
									bg="gray.700"
									borderRadius="md"
									boxShadow="lg"
									display="flex"
									flexDirection="column"
									alignItems="center"
									h="150px"
									onClick={() =>
										toast({
											title: 'Metadata',
											description: JSON.stringify(projectData, null, 2),
											status: 'info',
											duration: 5000,
											isClosable: true,
										})
									}
									_hover={{ bg: 'gray.800' }}
									_focus={{ boxShadow: 'outline' }}
								>
									<Heading size="md" color="white">
										View Metadata
									</Heading>
								</Button>
							</SimpleGrid>
						</>
					) : (
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
							height="100vh"
						>
							<Spinner size="xl" />
						</Box>
					)}
				</VStack>
			</Box>
		</Layout>
	);
};

export default ProjectDashboard;
