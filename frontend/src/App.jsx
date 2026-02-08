import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Booking from './pages/Booking';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './pages/AdminLayout';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Customers from './pages/Customers';
import Invoices from './pages/Invoices';

// Public Layout Wrapper
const PublicLayout = ({ children }) => (
    <>
        <Header />
        {children}
        <Footer />
    </>
);

function App() {
    return (
        <BrowserRouter>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#333',
                        color: '#fff',
                        borderRadius: '10px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#22c55e',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                <Route path="/booking" element={<PublicLayout><Booking /></PublicLayout>} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="bookings" element={<Bookings />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="invoices" element={<Invoices />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
