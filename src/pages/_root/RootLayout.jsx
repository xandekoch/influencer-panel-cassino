import React from 'react'
import InfluencerInfo from '../../components/InfluencerInfo'
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
    const isAdmin = true;
    return (
        isAdmin ? (
            <Outlet />
        ) : (
            <InfluencerInfo />
        )
    )
}

export default RootLayout