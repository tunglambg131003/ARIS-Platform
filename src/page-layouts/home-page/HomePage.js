//src/page-layouts/HomePagesTest.js
'use client';

import React, { useState, useEffect, useContext } from 'react';
import classes from '../../../styles/HomePageTest.module.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import user from '../../theme/home_page/user.png';
import recent from '../../theme/home_page/recent.png';
import playlist from '../../theme/home_page/playlist.png';
import imageTracking from '../../theme/home_page/Image_Tracking.png';
import faceTracking from '../../theme/home_page/Face_Tracking.png';
import ModelViewer from '../../theme/home_page/Model_Viewer.png';
import editorBackground from '../../theme/home_page/Editor_Background.png';
import home from '../../theme/home_page/home.png';
import history from '../../theme/home_page/history.png';
import { FileContext } from '@/context/FileProvider';
import { useUploadModel } from '@/context/UploadModelContext';
import Sidebargeneral from '@/src/navigation/Sidebargeneral';

const ActivityCard = ({ activity }) => {
	return (
		<div>
			<h2>
				{activity.action}: {activity.modelName}
			</h2>
			<p>Date: {new Date(activity.date).toLocaleString()}</p>
		</div>
	);
};

function HomePageTest() {
	const router = useRouter();
	const { fileData } = useContext(FileContext);
	const { activities, setActivities } = useUploadModel();

	useEffect(() => {
		if (fileData) {
			const newActivity = {
				action: 'Uploaded',
				modelName: fileData.name,
				date: new Date(),
			};

			setActivities((prevActivities) => [...prevActivities, newActivity]);
		}
	}, [fileData, setActivities]);

	const modelViewer = () => {
		router.push('/upload');
	};
	const Editor = () => {
		router.push('/editor-three');
	};

	const asset = () => {
		router.push('/assetspage');
	};

	return (
		<div className={classes.myGlobalStyles}>
			<div className="dark-theme">
				<section>
					<section className={classes.main_container}>
						<section className={classes.main_content}>
							<h1 className={classes.section_title}>Home</h1>
							<section className={classes.main_grid}>
								<section
									className={classes.main_thumbnail}
									style={{ position: 'relative' }}
								>
									<button
										onClick={modelViewer}
										className={classes.thumbnail_box}
									>
										<Image
											src={ModelViewer} // Replace with the correct path to your image in the public folder
											alt="Descriptive text for the image"
											layout="fill" // Image will fill the parent container
										/>
									</button>
								</section>
								<section className={classes.main_canvas_heading}>
									<h2 className={classes.main_text}>
										<span>ModelViewer</span>
									</h2>
								</section>
							</section>
							<section className={classes.main_grid}>
								<section
									className={classes.main_thumbnail}
									style={{ position: 'relative' }}
								>
									<button onClick={Editor} className={classes.thumbnail_box}>
										<Image
											src={imageTracking} // Replace with the correct path to your image in the public folder
											alt="Descriptive text for the image"
											layout="fill" // Image will fill the parent container
										/>
									</button>
								</section>
								<section className={classes.main_canvas_heading}>
									<h2 className={classes.main_text}>
										<span>Image Tracking</span>
									</h2>
								</section>
							</section>
							<section className={classes.main_grid}>
								<section
									className={classes.main_thumbnail}
									style={{ position: 'relative' }}
								>
									<button onClick={Editor} className={classes.thumbnail_box}>
										<Image
											src={faceTracking} // Replace with the correct path to your image in the public folder
											alt="Descriptive text for the image"
											layout="fill" // Image will fill the parent container
										/>
									</button>
								</section>
								<section className={classes.main_canvas_heading}>
									<h2 className={classes.main_text}>
										<span>Face Tracking</span>
									</h2>
								</section>
							</section>
							<h1 className={classes.section_title}>Recent</h1>
							<section>
								{activities &&
									activities.map((activity, index) => (
										<ActivityCard key={index} activity={activity} />
									))}
							</section>
							<section className={classes.main_grid}>
								<section
									className={classes.main_thumbnail}
									style={{ position: 'relative' }}
								>
									<button onClick={Editor} className={classes.thumbnail_box}>
										<Image
											src={editorBackground} // Replace with the correct path to your image in the public folder
											alt="Descriptive text for the image"
											layout="fill" // Image will fill the parent container
										/>
									</button>
								</section>

								<section className={classes.main_canvas_heading}>
									<h2 className={classes.main_text}>
										<span>Editor</span>
									</h2>
								</section>
							</section>
						</section>
					</section>
					<Sidebargeneral onAssetClick={asset} />
					{}
				</section>
			</div>
		</div>
	);
}

export default HomePageTest;
