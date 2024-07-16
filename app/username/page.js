import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import SetUsernameForm from '@/src/page-layouts/user/SetUsernameForm';

const Username = async () => {
	return <SetUsernameForm />;
};

export default Username;
