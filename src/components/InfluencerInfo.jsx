import React, { useEffect, useState } from 'react'
import { backendConfig } from '../api/config';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';

const InfluencerInfoAdmin = () => {
    const [withdraws, setWithdraws] = useState([]);
    const influencerId = 50;
    const [user, setUser] = useState({
        depositors: 0,
        total: 0,
        average: 0,
    });
    const baseURL = backendConfig.serverURL;
    const { logout } = useAuth();

    useEffect(() => {
        const fetchUser = async () => {
            const data = {
                depositors: 10,
                total: 100,
                average: 10,
                fakeTotal: 7,
                fakeAverage: 5
            }
            setUser(data);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchWithdraws = async () => {
            const data = [
                { depositors: 10, total: 100, average: 10, fakeTotal: 7, fakeAverage: 5, createdAt: '2024-07-01' },
                { depositors: 20, total: 200, average: 10, fakeTotal: 7, fakeAverage: 5, createdAt: '2024-07-02' },
                { depositors: 20, total: 200, average: 10, fakeTotal: 7, fakeAverage: 5, createdAt: '2024-07-02' },
                { depositors: 20, total: 200, average: 10, fakeTotal: 7, fakeAverage: 5, createdAt: '2024-07-02' },
                { depositors: 20, total: 200, average: 10, fakeTotal: 7, fakeAverage: 5, createdAt: '2024-07-02' },
                { depositors: 20, total: 200, average: 10, fakeTotal: 7, fakeAverage: 5, createdAt: '2024-07-02' },
            ];
            setWithdraws(data);
        };
        fetchWithdraws();
    }, []);

    return (
        <section className='bg-gray-950 w-full h-screen p-6 overflow-y-auto'>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold text-white'>Influencer</h1>
                <button className='font-semibold bg-red-400 py-2 px-8 rounded-lg hover:bg-red-500'
                    onClick={() => { logout() }}>Sair</button>
            </div>
            <div className='flex flex-col items-center justify-center gap-6 pb-6 pt-6'>
                <div className='w-full bg-gray-900 p-6 rounded-xl grid gap-y-2'>
                    <span className='text-sm font-medium text-gray-400'>Depositantes</span>
                    <div className='text-3xl font-bold'>{user.depositors}</div>
                </div>
                <div className='w-full bg-gray-900 p-6 rounded-xl grid gap-y-2'>
                    <span className='text-sm font-medium text-gray-400'>Total Depositado</span>
                    <div className='text-3xl font-bold'>{user.total}</div>
                </div>
                <div className='w-full bg-gray-900 p-6 rounded-xl grid gap-y-2'>
                    <span className='text-sm font-medium text-gray-400'>Depósito Médio</span>
                    <div className='text-3xl font-bold'>{user.average}</div>
                </div>
            </div>
            <h2 className='text-2xl font-bold text-white mb-4'>Histório de Pagamentos</h2>
            <div className='overflow-x-auto whitespace-nowrap'>
                <table className='min-w-full bg-gray-900 text-white rounded-2xl overflow-x-auto'>
                    <thead>
                        <tr>
                            <th className='border-b py-4 px-3 bg-white/5 border-gray-700 first:rounded-tl-2xl last:rounded-tr-2xl'>Depositantes</th>
                            <th className='border-b py-4 px-3 bg-white/5 border-gray-700'>Total</th>
                            <th className='border-b py-4 px-3 bg-white/5 border-gray-700'>Média</th>
                            <th className='border-b py-4 px-3 bg-white/5 border-gray-700 last:rounded-tr-2xl'>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {withdraws.map((withdraw, index) => (
                            <tr key={index} className='even:bg-gray-750'>
                                <td className='border-b py-4 px-3 border-gray-700'>{withdraw.depositors}</td>
                                <td className='border-b py-4 px-3 border-gray-700'>R${withdraw.total}</td>
                                <td className='border-b py-4 px-3 border-gray-700'>R${withdraw.average}</td>
                                <td className='border-b py-4 px-3 border-gray-700'>{withdraw.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default InfluencerInfoAdmin