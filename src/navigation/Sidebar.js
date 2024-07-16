'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Box, Button, IconButton, VStack, Text, Image } from '@chakra-ui/react';
import { FiHome, FiUser, FiBook, FiClock, FiFolder } from 'react-icons/fi';
import { FaSignOutAlt } from 'react-icons/fa';

function Sidebar() {
	const router = useRouter();

	const asset = () => {
		router.push('/assetspage');
	};

	const redirectToHomePage = () => {
		router.push('/home'); // Assuming 'HomePage' is the route for your homepage
	};

	const { data: session } = useSession();

	return (
		<Box
			as="nav"
			bg="gray.800"
			color="white"
			p={4}
			minW="300px"
			minHeight={'100vh'}
			position={'fixed'}
		>
			<VStack spacing={4} align="stretch">
				<Button
					leftIcon={<FiUser />}
					variant="ghost"
					colorScheme="whiteAlpha"
					justifyContent="flex-start"
				>
					{session?.user?.email || 'Profile'}
				</Button>

				<VStack spacing={3} align="stretch">
					<Button
						onClick={redirectToHomePage}
						leftIcon={<FiHome />}
						variant="ghost"
						colorScheme="whiteAlpha"
						justifyContent="flex-start"
					>
						Home
					</Button>

					<Button
						onClick={asset}
						leftIcon={<FiFolder />}
						variant="ghost"
						colorScheme="whiteAlpha"
						justifyContent="flex-start"
					>
						Assets
					</Button>

					<Button
						leftIcon={<FiBook />}
						variant="ghost"
						colorScheme="whiteAlpha"
						justifyContent="flex-start"
					>
						Library
					</Button>

					<Button
						leftIcon={<FiClock />}
						variant="ghost"
						colorScheme="whiteAlpha"
						justifyContent="flex-start"
					>
						History
					</Button>

					<Button
						leftIcon={<FaSignOutAlt />}
						variant="ghost"
						colorScheme="whiteAlpha"
						justifyContent="flex-start"
						onClick={() => signOut()}
					>
						Sign Out
					</Button>
				</VStack>
			</VStack>
		</Box>
	);
}

export default Sidebar;
