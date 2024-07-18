// components/auth/SignUpForm.js
'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import Link from 'next/link';

async function createUser(email, password, username, name) {
	console.log('received response from api route:', res);
}

const SignUpForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [name, setName] = useState('');

	const router = useRouter();
	const toast = useToast();

	async function submitHandler(event) {
		event.preventDefault();
		try {
			const res = await fetch('/api/auth/sign-up', {
				method: 'POST',
				body: JSON.stringify({
					email: email,
					password: password,
					username: username,
					name: name,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (!res.ok) {
				const msg = await res.json();
				console.log(msg);
				throw new Error('Account creation failed: ' + msg.message);
			}
			toast({
				title: 'Account created.',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
			router.push('/home');
		} catch (error) {
			toast({
				title: 'Account creation failed.',
				description: error.message,
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
			<Heading mb={6}>Sign Up</Heading>
			<form onSubmit={submitHandler}>
				<VStack spacing={4}>
					<FormControl id="email" isRequired>
						<FormLabel>Email</FormLabel>
						<Input
							type="email"
							onChange={(event) => setEmail(event.target.value)}
						/>
					</FormControl>
					<FormControl id="password" isRequired>
						<FormLabel>Password</FormLabel>
						<Input
							type="password"
							onChange={(event) => setPassword(event.target.value)}
						/>
					</FormControl>
					<FormControl id="username" isRequired>
						<FormLabel>Username</FormLabel>
						<Input
							type="text"
							onChange={(event) => setUsername(event.target.value)}
						/>
					</FormControl>
					<FormControl id="name" isRequired>
						<FormLabel>Name</FormLabel>
						<Input
							type="text"
							onChange={(event) => setName(event.target.value)}
						/>
					</FormControl>
					<Button type="submit" colorScheme="teal" width="full">
						Create Account
					</Button>
					<Link href="/login">
						Already have an account?{' '}
						<span style={{ textDecoration: 'underline' }}>Login</span>
					</Link>
				</VStack>
			</form>
		</Box>
	);
};

export default SignUpForm;
