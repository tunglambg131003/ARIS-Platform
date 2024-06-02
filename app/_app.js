import { FileContextProvider } from "@/context/FileProvider";
import { ChakraProvider } from '@chakra-ui/react';

function MyApp({ Component, pageProps }) {
	return (
		<FileContextProvider>
			<ChakraProvider>
				<Component {...pageProps} />
			</ChakraProvider>
		</FileContextProvider>
	);
}

export default MyApp;
