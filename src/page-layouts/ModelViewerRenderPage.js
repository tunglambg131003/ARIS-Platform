'use client';

import { useContext, useRef, useState } from 'react';
import {
	Flex,
	Button,
	Text,
	Slider,
	SliderThumb,
	SliderFilledTrack,
	SliderTrack,
	Heading,
	Input,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Tab,
	Tabs,
	TabList,
	TabPanels,
	TabPanel,
	InputGroup,
	InputRightAddon,
} from '@chakra-ui/react';
import QRCode from 'qrcode';
// import { FileContext } from '@/context/FileProvider';

const ModelSliders = ({ name, value, setValue }) => {
	return (
		<Flex width="100%" h={'50px'} alignItems="center" m={8} padding="16px">
			<Text width="100px" m="8px">
				{name}
			</Text>
			<Slider
				defaultValue={value}
				onChange={setValue}
				width="70%"
				ml="10px"
				min={0}
				max={1}
				step={0.01}
			>
				<SliderTrack>
					<SliderFilledTrack />
				</SliderTrack>
				<SliderThumb />
			</Slider>
			<Input
				value={value}
				onChange={(event) => setValue(event.target.value)}
				width="20%"
				ml="10px"
			/>
		</Flex>
	);
};

const FloatingExport = ({ modelId, onExport }) => {
	const [isOpen, setIsOpen] = useState(false);
	const onClose = () => setIsOpen(false);
	const ExportModal = () => {
		const [qrCodeUrl, setQrCodeUrl] = useState('');
		// const qrValue = `https://platform-development-phi.vercel.app/share/${modelId}`;
		const qrValue = `http://localhost:3000/share/${modelId}`;		
		const generateQRCode = async () => {
			try {
				const url = await QRCode.toDataURL(qrValue);
				setQrCodeUrl(url);
			} catch (error) {
				console.error('Error generating QR Code', error);
			}
		};
		const finalRef = useRef();
		const inputref = useRef();
		const copy = () => {
			inputref.current.select();
			document.execCommand('copy');
			console.log('copied');
		};
		return (
			<>
				<Modal
					isOpen={isOpen}
					onClose={onClose}
					finalFocusRef={finalRef}
					size={'3xl'}
				>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Export</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Tabs orientation="vertical">
								<TabList>
									<Tab>Download</Tab>
									<Tab>Share</Tab>
								</TabList>
								<TabPanels>
									<TabPanel>
										<Button onClick={onExport}>Download</Button>
									</TabPanel>
									<TabPanel>
										<Button onClick={generateQRCode}>Generate QR Code</Button>
										{qrCodeUrl && (
											<img
												src={qrCodeUrl}
												alt="QR Code"
												style={{ margin: '20px' }}
											/>
										)}
										<InputGroup></InputGroup>
									</TabPanel>
								</TabPanels>
							</Tabs>
						</ModalBody>
						<ModalFooter>
							<Button colorScheme="blue" mr={3} onClick={onClose}>
								Close
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</>
		);
	};
	return (
		<>
			<ExportModal />
			<Flex
				alignItems={'center'}
				padding="16px"
				width="600px"
				height="50px"
				justifyContent={'center'}
				// bgColor="darkgray"
				position="fixed"
				top="30"
				left={'50%'}
				transform="translateX(-50%)"
				borderRadius={'12px'}
				bgColor="gray.200"
				zIndex={100}
				// marginLeft={'auto'}
				// marginRight={'auto'}
				// translateX={'-50%'}
			>
				<Button
					fontSize={'15px'}
					height={'35px'}
					onClick={() => setIsOpen(true)}
				>
					Export
				</Button>
			</Flex>
		</>
	);
};

const ModelViewerRenderPage = ({ modelURL, viewOnly, modelId }) => {
	// const { fileData } = useContext(FileContext);
	const modelViewerRef = useRef(null);

	const SettingsSidebar = () => {
		const [metallic, setMetallic] = useState(0);
		const [roughness, setRoughness] = useState(0);
		const onChangeColor = () => {
			const [material] = modelViewerRef.current.model.materials;
			material.pbrMetallicRoughness.setBaseColorFactor('#ff0000');
		};
		const onMetallicSliderChange = (value) => {
			const [material] = modelViewerRef.current.model.materials;
			material.pbrMetallicRoughness.setMetallicFactor(value);
			setMetallic(value);
		};
		const onRoughnessSliderChange = (value) => {
			const [material] = modelViewerRef.current.model.materials;
			material.pbrMetallicRoughness.setRoughnessFactor(value);
			setRoughness(value);
		};

		return (
			<Flex
				width="20%"
				height="100%"
				bgColor="gray.200"
				flexDir={'column'}
				alignItems={'center'}
			>
				<Heading mt="50px">Settings</Heading>
				<ModelSliders
					name="Metallic-ness"
					value={metallic}
					setValue={onMetallicSliderChange}
				/>
				<ModelSliders
					name="Roughness"
					value={roughness}
					setValue={onRoughnessSliderChange}
				/>
				<Button onClick={onChangeColor}>
					<Text>Change Color</Text>
				</Button>
			</Flex>
		);
	};
	const onExport = async () => {
		const modelViewer = modelViewerRef.current;
		const glTF = await modelViewer.exportScene();
		const file = new File([glTF], 'export.glb');
		const link = document.createElement('a');
		link.download = file.name;
		link.href = URL.createObjectURL(file);
		link.click();
	};
	return (
		<>
			<FloatingExport modelId={modelId} onExport={onExport} />
			<Flex h="100vh" w="100vw" alignItems={'center'} justifyContent={'center'}>
				{/* {!viewOnly && <SettingsSidebar />} */}
				<model-viewer
					alt="3D file uploaded by user"
					src={modelURL}
					camera-controls
					style={{
						width: '90%',
						height: '90%',
					}}
					auto-rotate
					ar
					autoplay
					ref={modelViewerRef}
				>
					<Button
						slot="ar-button"
						variant={'ghost'}
						colorScheme="white"
						top="50px"
						// style="background-color: white; border-radius: 4px; border: none; position: absolute; top: 16px; right: 16px; "
					>
						👋 Activate AR
					</Button>
				</model-viewer>
			</Flex>
		</>
	);
};

export default ModelViewerRenderPage;
