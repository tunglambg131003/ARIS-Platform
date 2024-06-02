import ModelViewerRenderPage from '@/src/page-layouts/ModelViewerRenderPage';

const test = () => {
	return (
		<ModelViewerRenderPage viewOnly modelURL={'/scene.glb'} modelId={'123'} />
	);
};

export default test;
