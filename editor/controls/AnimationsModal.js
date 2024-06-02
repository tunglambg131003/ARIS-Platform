import React from 'react';
import {
	Modal,
	ModalBody,
	ModalFooter,
	ModalOverlay,
	ModalHeader,
	ModalContent,
	ModalCloseButton,
	Switch,
	FormControl,
	FormLabel,
	Flex,
	Button,
} from '@chakra-ui/react';

const AnimationsModal = ({
	isOpen,
	onClose,
	enableAnimations,
	setEnableAnimations,
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<ModalHeader>Animations</ModalHeader>
				<ModalBody>
					<FormControl as={Flex}>
						<FormLabel htmlFor="animations-switch" mr={8}>
							Enable Animations
						</FormLabel>
						<Switch
							size="lg"
							id="animations-switch"
							isChecked={enableAnimations}
							onChange={() => setEnableAnimations(!enableAnimations)}
						/>
					</FormControl>
				</ModalBody>
				<ModalFooter>
					<Button colorScheme={'teal'} onClick={onClose}>
						Save Changes
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AnimationsModal;
