'use client';

import ProfileForm from './ProfileForm';
import classes from '../../styles/profile-form.module.css';

function UserProfile() {
	// const [isLoading, SetIsLoading] = useState(true);

	// useEffect(() => {
	//   getSession().then(session => {
	//     if(!session){
	//       window.location.href = '/auth';
	//     } else {
	//       SetIsLoading(false);
	//     }
	//   });
	// }, []);

	// if (isLoading) {
	//   return <p className={classes.profile}>Loading bitch wait</p>;
	// }

	async function changePasswordHandler(passwordData) {
		const response = await fetch('/api/user/change-password', {
			method: 'PATCH',
			body: JSON.stringify(passwordData),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const data = await response.json();

		console.log(data);
	}

	return (
		<section className={classes.profile}>
			<h1>Your User Profile</h1>
			<ProfileForm onChangePassword={changePasswordHandler} />
		</section>
	);
}

export default UserProfile;
