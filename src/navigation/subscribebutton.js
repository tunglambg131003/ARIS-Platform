// src/navigation/SubscribeButton.js
import React from 'react';
import { redirect, useRouter } from 'next/navigation';

const SubscribeButton = () => {
  const router = useRouter();

  const handleSubscribe = () => {
    router.push('/subscription');
  };

  return (
    <button onClick={handleSubscribe}>
      Subscribe
    </button>
  );
};

export default SubscribeButton;
