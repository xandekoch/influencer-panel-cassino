import { Outlet, Navigate } from 'react-router-dom'

const AuthLayout = () => {
    return (
            <section className='flex flex-1 justify-center items-center flex-col'>
                <Outlet />
            </section>
    )
}

export default AuthLayout