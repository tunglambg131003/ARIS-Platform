import {
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	Box,
	Text,
} from '@chakra-ui/react';

const Sidebar = ({ isOpen, onClose }) => {
	<Drawer isOpen={true} placement="left" onClose={onClose}>
		<DrawerOverlay />
		<DrawerContent>
			<DrawerHeader>Choose action</DrawerHeader>
			<DrawerBody>
				<Box></Box>
			</DrawerBody>
		</DrawerContent>
	</Drawer>;
};

export default Sidebar;
