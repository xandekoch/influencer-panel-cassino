import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { getInfluencers } from '../api/authApi';

const InfluencersList = () => {
    const [influencers, setInfluencers] = useState([]);
    const navigate = useNavigate();
    const {logout, token} = useAuth(); 

    useEffect(() => {
        const fetchData = async () => {
            const data = await getInfluencers(token);
            setInfluencers(data);
        };
        fetchData();
    }, []);

    return (
        <section className='bg-gray-950 w-full h-screen p-6 overflow-auto'>
            <div className='flex items-center justify-between mb-4'>
                <h1 className='text-2xl font-bold text-white'>Influencer</h1>
                <button className='font-semibold bg-red-400 py-2 px-8 rounded-lg hover:bg-red-500'
                    onClick={() => { logout() }}>Sair</button>
            </div>
            <table className='min-w-full bg-gray-900 text-white rounded-2xl overflow-hidden'>
                <thead>
                    <tr className='bg-gray-900'>
                        <th className='py-4 px-3 border-b bg-white/5 border-gray-700 first:rounded-tl-2xl last:rounded-tr-2xl'>Email</th>
                        <th className='py-4 px-3 border-b bg-white/5 border-gray-700 first:rounded-tl-2xl last:rounded-tr-2xl'>Cadastro</th>
                    </tr>
                </thead>
                <tbody>
                    {influencers.map((influencer, index) => (
                        <tr key={index} onClick={() => navigate(`/influencer/${influencer.id}?email=${influencer.email}`)}>
                            <td className='py-4 px-3 border-b border-gray-700'>{influencer.email}</td>
                            <td className='py-4 px-3 border-b border-gray-700'>{influencer.created_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    )
}

export default InfluencersList;