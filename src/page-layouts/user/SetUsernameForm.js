'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Heading,
	VStack,
	useToast,
} from '@chakra-ui/react';

function SetUsernameForm() {
	const [username, setUsername] = useState('');
	const { data: session, status, update } = useSession();
	console.log(session);
	const toast = useToast();

	useEffect(() => {
		if (status === 'loading') return; // Do nothing while loading
		if (!session) signIn(); // Redirect to sign in if no session
		if (session.user.username) redirect('/home'); // Redirect to home if username is already set
	}, [session, status]);

	if (status === 'loading') {
		return <p>Loading...</p>;
	}

	async function submitHandler(event) {
		event.preventDefault();

		const enteredUsername = username;

		const res = await fetch('/api/user/set-username', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username: enteredUsername }),
		});

		if (res.ok) {
			toast({
				title: 'Username set successfully. Redirecting you to home...',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
			const data = await res.json();
			update({ username: data.username });
			redirect('/home');
		} else {
			const data = await res.json();
			console.log(res.json());
			toast({
				title: 'Failed to set username.',
				description: 'An error occurred while setting the username. ',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
	}

	return (
		<Box
			maxW="md"
			mx="auto"
			mt={8}
			p={6}
			borderWidth={1}
			borderRadius="lg"
			boxShadow="lg"
		>
			<Heading mb={6}>Set Username</Heading>
			<form onSubmit={submitHandler}>
				<VStack spacing={4}>
					<FormControl id="username" isRequired>
						<FormLabel>Username</FormLabel>
						<Input
							type="text"
							value={username}
							onChange={(event) => setUsername(event.target.value)}
						/>
					</FormControl>
					<Button type="submit" colorScheme="teal" width="full">
						Submit
					</Button>
				</VStack>
			</form>
		</Box>
	);
}

export default SetUsernameForm;
