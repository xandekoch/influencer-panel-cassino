import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthProvider';
import { login } from '../../api/authApi';


const schema = z.object({
    email: z.string(),
    password: z.string().min(6, 'Mínimo 6 caracteres').max(50, 'Máximo de 50 caracteres')
});

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { authenticate } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const session = await login(data);
            authenticate(session);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-full h-screen bg-gray-950 flex items-center justify-center'>
            <div className="py-8 px-8 w-96 mx-3 bg-gray-900 rounded-xl flex flex-col items-center gap-6">
                <div className='flex flex-col items-center gap-2 font-bold text-xl'>
                    <img src="/assets/logo.png" width={'60px'} alt="" />
                    <h1>Central do Influenciador</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
                    <div>
                        <input
                            type="email"
                            id="email"
                            placeholder='Email'
                            {...register('email')}
                            className={`w-full bg-gray-800 rounded-md py-2 px-3 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <input
                            type="password"
                            id="password"
                            placeholder='Senha'
                            {...register('password')}
                            className={`w-full rounded-md bg-gray-800 py-2 px-3 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center">
                        {isLoading ? (
                            <img src='/assets/loader.svg' width={'24px'}/>
                        ) : (
                            'Entrar'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
