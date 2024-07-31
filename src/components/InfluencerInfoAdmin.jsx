import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { backendConfig } from '../api/config';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';
import { createInfluencerWithdraw, getInfluencerInfo, updateFakeAverageBackend, getInfluencerWithdrawHistory } from '../api/authApi';
import toast, { Toaster } from 'react-hot-toast';

const InfluencerInfoAdmin = () => {
    const {user, token} = useAuth(); 
    const [isEditing, setIsEditing] = useState(false);
    const [withdraws, setWithdraws] = useState([]);
    const influencerId = window.location.pathname.split('/').pop();
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const [userData, setUserData] = useState({
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
            console.log(influencerId);
            const response = await getInfluencerInfo(influencerId, token);
            console.log(response);
            console.log(response.sumOfDeposits);
            console.log(response.depositorsAmount);
            const sumOfDeposits = parseFloat(response.sumOfDeposits);;
            console.log('sumOf', sumOfDeposits);
            const data = {
                depositors: response.depositorsAmount,
                total: isNaN(sumOfDeposits) ? '0.00' : sumOfDeposits.toFixed(2),
                average: isNaN(sumOfDeposits / response.depositorsAmount) ? '0.00' : (sumOfDeposits / response.depositorsAmount).toFixed(2),
                fakeTotal: isNaN(response.fake_average * response.depositorsAmount) ? '0.00' : (response.fake_average * response.depositorsAmount).toFixed(2),
                fakeAverage: isNaN(response.fake_average) ? '0.00' : response.fake_average.toFixed(2),
            };
            setUserData(data);
        };
        fetchUser();
    }, [isEditing]);

    useEffect(() => {
        const fetchWithdraws = async () => {
            const response = await getInfluencerWithdrawHistory(influencerId, token);
            console.log(response)

            const formattedData = response.map(item => ({
                depositorsAmount: item.depositors_amount,
                total: parseFloat(item.sum_of_deposits).toFixed(2),
                average: parseFloat(item.sum_of_deposits / item.depositors_amount).toFixed(2),
                fakeAverage: parseFloat(item.fake_average).toFixed(2),
                fakeTotal: parseFloat(item.fake_average * item.depositors_amount).toFixed(2),
                createdAt: item.created_at
            }));
            console.log(formattedData);
            console.log(formattedData[0].total);;
            
            setWithdraws(formattedData);
        };
        fetchWithdraws();
    }, []);

    const updateFakeAverage = async () => {
        try {
            await updateFakeAverageBackend(influencerId, token, input);
            setIsEditing(false);
            toast.success('Média Fake atualizada com sucesso!');
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setIsEditing(false);
            toast.error('Erro ao atualizar a Média Fake.');
        }
    };

    const payInfluencer = async () => {
        try {
            const response = await createInfluencerWithdraw(influencerId, token);
            toast.success('Influencer pago com sucesso!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Erro ao pagar influencer.');
            setIsEditing(false);
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
                    <div className='text-3xl font-bold'>{userData.depositors}</div>
                </div>
                <div className='w-full bg-gray-900 p-6 rounded-xl grid gap-y-2'>
                    <span className='text-sm font-medium text-gray-400'>Total Depositado</span>
                    <div className='text-3xl font-bold'>R${userData.total}</div>
                </div>
                <div className='w-full bg-gray-900 p-6 rounded-xl grid gap-y-2'>
                    <span className='text-sm font-medium text-gray-400'>Depósito Médio</span>
                    <div className='text-3xl font-bold'>R${userData.average}</div>
                </div>
                <div className='w-full bg-gray-900 p-6 rounded-xl grid gap-y-2'>
                    <span className='text-sm font-medium text-red-400'>Total Depositado Fake</span>
                    <div className='text-3xl font-bold'>R${userData.fakeTotal}</div>
                </div>
                <div className='w-full relative bg-gray-900 p-6 rounded-xl flex justify-between items-start'>
                    <div className='grid gap-y-2'>
                        <span className='text-sm font-medium text-red-400'>Depósito Médio Fake</span>
                        <div className='text-3xl font-bold'>R${userData.fakeAverage}</div>
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
                                onClick={() => {updateFakeAverage()}}
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
                                <td className='border-b py-4 px-3 border-gray-700'>R${withdraw.fakeAverage}</td>
                                <td className='border-b py-4 px-3 border-gray-700'>R${withdraw.fakeAverage}</td>
                                <td className='border-b py-4 px-3 border-gray-700'>{withdraw.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="w-full mt-6 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-12 rounded-md flex items-center justify-center"
            onClick={() => {payInfluencer()}}>
                Realizar Pagamento
            </button>
            <Toaster />
        </section>
    )
}

export default InfluencerInfoAdmin