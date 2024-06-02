//app/render/page.js
'use client';
// import RenderPage from '../../src/pages/RenderPage';
// import ModelViewerRenderPage from '@/src/page-layouts/ModelViewerRenderPage';
import { useParams } from 'next/navigation';
import RenderPage from '@/src/page-layouts/RenderPage';

export default function App() {
	const { model_id } = useParams();
	// return <RenderPage />;
	return <RenderPage modelId={model_id} />;
}
