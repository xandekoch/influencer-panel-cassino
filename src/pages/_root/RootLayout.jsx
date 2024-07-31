import React from 'react'
import InfluencerInfo from '../../components/InfluencerInfo'
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

const RootLayout = () => {
    const {user} = useAuth();
    const isAdmin = user.isAdmin;

    return (
        isAdmin ? (
            <Outlet />
        ) : (
            <InfluencerInfo />
        )
    )
}

export default RootLayout