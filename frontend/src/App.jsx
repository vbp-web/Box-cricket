import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import TurfDetails from './pages/TurfDetails';
import BookingPage from './pages/BookingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import PaymentSuccess from './pages/PaymentSuccess';
import AdminDashboard from './pages/AdminDashboard';
import AdminAddTurf from './pages/AdminAddTurf';
import AdminBookings from './pages/AdminBookings';
import AdminManageSlots from './pages/AdminManageSlots';
import AdminOfflineBooking from './pages/AdminOfflineBooking';

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/turf/:id" element={<TurfDetails />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes */}
                        <Route
                            path="/booking"
                            element={
                                <ProtectedRoute>
                                    <BookingPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/payment-success"
                            element={
                                <ProtectedRoute>
                                    <PaymentSuccess />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Routes */}
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute adminOnly>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/add-turf"
                            element={
                                <ProtectedRoute adminOnly>
                                    <AdminAddTurf />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/edit-turf/:id"
                            element={
                                <ProtectedRoute adminOnly>
                                    <AdminAddTurf />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/bookings"
                            element={
                                <ProtectedRoute adminOnly>
                                    <AdminBookings />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/manage-slots"
                            element={
                                <ProtectedRoute adminOnly>
                                    <AdminManageSlots />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/offline-booking"
                            element={
                                <ProtectedRoute adminOnly>
                                    <AdminOfflineBooking />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
