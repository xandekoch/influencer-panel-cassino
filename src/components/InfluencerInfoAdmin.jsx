import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { backendConfig } from '../api/config';
import axios from 'axios';

const InfluencerInfoAdmin = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [withdraws, setWithdraws] = useState([]);
    const influencerId = window.location.pathname.split('/').pop();
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const [user, setUser] = useState({
        depositors: 0,
        total: 0,
        average: 0,
        fakeTotal: 0,
        fakeAverage: 0,
    });
    const baseURL = backendConfig.serverURL;
    const navigate = useNavigate();
    const [input, setInput] = useState();

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
                { depositorsAmount: 10, total: 100, average: 10, fakeTotal: 7, fakeAverage: 5, createdAt: '2024-07-01' },
                { depositorsAmount: 20, total: 200, average: 10, fakeTotal: 7, fakeAverage: 5, createdAt: '2024-07-02' },
                { depositorsAmount: 20, total: 200, average: 10, fakeTotal: 7, fakeAverage: 5, createdAt: '2024-07-02' },
                { depositorsAmount: 20, total: 200, average: 10, fakeTotal: 7, fakeAverage: 5, createdAt: '2024-07-02' },
                { depositorsAmount: 20, total: 200, average: 10, fakeTotal: 7, fakeAverage: 5, createdAt: '2024-07-02' },
                { depositorsAmount: 20, total: 200, average: 10, fakeTotal: 7, fakeAverage: 5, createdAt: '2024-07-02' },
            ];
            setWithdraws(data);
        };
        fetchWithdraws();
    }, []);

    const updateFakeAverage = async () => {
        try {
            const response = await axios.post(
                `${baseURL}/api/updateFakeAverage`,
                { 'authorization': `Bearer ${token}` },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    params: {
                        influencerId,
                        fakeAverage: input,
                    }
                });
            setTransactions(response.data.transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const payInfluencer = async () => {
        try {
            const response = await axios.post(
                `${baseURL}/api/payInfluencer`,
                { 'authorization': `Bearer ${token}` },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    params: {
                        influencerId,
                    }
                });
            setTransactions(response.data.transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    return (
        <section className='bg-gray-950 w-full h-screen p-6 overflow-y-auto'>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold text-white'>Influencer</h1>
                <button className='underline font-medium text-gray-400 hover:text-gray-200'
                    onClick={() => { navigate("/") }}>Voltar</button>
            </div>
            <h2 className='text-lg font-semibold mt-2 text-gray-400'>{email}</h2>
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
                <div className='w-full bg-gray-900 p-6 rounded-xl grid gap-y-2'>
                    <span className='text-sm font-medium text-red-400'>Total Depositado Fake</span>
                    <div className='text-3xl font-bold'>{user.fakeTotal}</div>
                </div>
                <div className='w-full relative bg-gray-900 p-6 rounded-xl flex justify-between items-start'>
                    <div className='grid gap-y-2'>
                        <span className='text-sm font-medium text-red-400'>Depósito Médio Fake</span>
                        <div className='text-3xl font-bold'>{user.fakeAverage}</div>
                    </div>
                    <button className='underline font-medium text-gray-400 hover:text-gray-200'
                        onClick={() => { setIsEditing(!isEditing) }}>{!isEditing ? "Editar" : "Fechar"}</button>
                    {isEditing && (
                        <div className='right-4 bottom-0 absolute flex items-center gap-3 bg-gray-700 p-2 rounded-lg'>
                            <input
                                type='text'
                                onChange={(e) => { setInput(e.target.value)}}
                                className='w-36 p-2 rounded bg-gray-900 text-white'
                            />
                            <button
                                onClick={updateFakeAverage}
                                className='p-2 bg-blue-500 text-white rounded hover:bg-blue-700'
                            >
                                Enviar
                            </button>
                        </div>
                    )}
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
                            <th className='border-b py-4 px-3 bg-white/5 border-gray-700 text-red-400'>Total Fake</th>
                            <th className='border-b py-4 px-3 bg-white/5 border-gray-700 text-red-400'>Média Fake</th>
                            <th className='border-b py-4 px-3 bg-white/5 border-gray-700 last:rounded-tr-2xl'>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {withdraws.map((withdraw, index) => (
                            <tr key={index} className='even:bg-gray-750'>
                                <td className='border-b py-4 px-3 border-gray-700'>{withdraw.depositorsAmount}</td>
                                <td className='border-b py-4 px-3 border-gray-700'>R${withdraw.total}</td>
                                <td className='border-b py-4 px-3 border-gray-700'>R${withdraw.average}</td>
                                <td className='border-b py-4 px-3 border-gray-700'>R${withdraw.fakeTotal}</td>
                                <td className='border-b py-4 px-3 border-gray-700'>R${withdraw.fakeAverage}</td>
                                <td className='border-b py-4 px-3 border-gray-700'>{withdraw.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="w-full mt-6 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-12 rounded-md flex items-center justify-center"
            onClick={payInfluencer}>
                Realizar Pagamento
            </button>
        </section>
    )
}

export default InfluencerInfoAdmin