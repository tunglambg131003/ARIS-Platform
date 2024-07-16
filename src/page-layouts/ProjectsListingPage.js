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
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import Layout from '../navigation/layout';

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
	const router = useRouter();
	const [projects, setProjects] = useState([]);

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

	return (
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
							onClick={project.onClick}
						/>
					))}
				</VStack>
			</Box>
		</Layout>
	);
};

export default ProjectsListing;
