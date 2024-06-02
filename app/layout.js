//app/layout.js

import { Providers } from './providers';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import './globals.css';

export default async function RootLayout({ children }) {
	const session = await getServerSession(authOptions);
	return (
		<html lang="en">
			<head>
				<title>ARIS Web View</title>
				<script
					type="module"
					src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.1.1/model-viewer.min.js"
					async
				></script>
			</head>
			<body>
				<Providers session={session}>{children}</Providers>
			</body>
		</html>
	);
}
