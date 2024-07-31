import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const InfluencersList = () => {
    const [influencers, setInfluencers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulando um fetch de dados do backend
        const fetchData = async () => {
            const data = [
                { id: 90, email: 'influencer1@example.com', createdAt: '2024-07-01' },
                { id: 97, email: 'influencer2@example.com', createdAt: '2024-07-02' },
                { id: 108, email: 'influencer3@example.com', createdAt: '2024-07-03' },
                { id: 114, email: 'influencer4@example.com', createdAt: '2024-07-03' },
            ];
            setInfluencers(data);
        };
        fetchData();
    }, []);

    return (
        <section className='bg-gray-950 w-full h-screen p-6 overflow-auto'>
            <h1 className='text-2xl font-bold text-white mb-4'>Lista de Influenciadores</h1>
            <table className='min-w-full bg-gray-900 text-white rounded-2xl overflow-hidden'>
                <thead>
                    <tr className='bg-gray-900'>
                        <th className='py-4 px-3 border-b bg-white/5 border-gray-700 first:rounded-tl-2xl last:rounded-tr-2xl'>Email</th>
                        <th className='py-4 px-3 border-b bg-white/5 border-gray-700 first:rounded-tl-2xl last:rounded-tr-2xl'>Cadastro</th>
                    </tr>
                </thead>
                <tbody>
                    {influencers.map((influencer) => (
                        <tr key={influencer.id} onClick={() => navigate(`/influencer/${influencer.id}?email=${influencer.email}`)}>
                            <td className='py-4 px-3 border-b border-gray-700'>{influencer.email}</td>
                            <td className='py-4 px-3 border-b border-gray-700'>{influencer.createdAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    )
}

export default InfluencersList;