import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
	return (
		<Flex h="100vh" bg="gray.900">
			<Box w="300px" color="white">
				<Sidebar />
			</Box>
			<Box flex="1" bg="gray.900">
				{children}
			</Box>
		</Flex>
	);
};

export default Layout;
