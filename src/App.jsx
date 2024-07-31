import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthProvider';
import AuthLayout from './pages/_auth/AuthLayout';
import Login from './pages/_auth/Login';
import RootLayout from './pages/_root/RootLayout';
import InfluencersList from './components/InfluencersList';
import InfluencerInfoAdmin from './components/InfluencerInfoAdmin';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main className='App font-sans'>
      <Routes>
        {!isAuthenticated ? (
          <Route path='/' element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path='/*' element={<Login />} />
          </Route>
        ) : (
          <Route path='/' element={<RootLayout />}>
            <Route index element={<InfluencersList />} />
            <Route path='/influencer/:id' element={<InfluencerInfoAdmin />} />
          </Route>
        )}
      </Routes>
    </main>
  );
};

export default App;