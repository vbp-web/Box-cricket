import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    TrendingUp,
    Calendar,
    DollarSign,
    Users,
    Plus,
    LayoutGrid,
    ClipboardList,
    UserPlus
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/bookings/admin/stats');
            setStats(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Revenue',
            value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`,
            icon: DollarSign,
            color: 'bg-green-500',
            textColor: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: "Today's Revenue",
            value: `₹${stats?.todayRevenue?.toLocaleString() || 0}`,
            icon: TrendingUp,
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Total Bookings',
            value: stats?.totalBookings || 0,
            icon: ClipboardList,
            color: 'bg-purple-500',
            textColor: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: "Today's Bookings",
            value: stats?.todayBookings || 0,
            icon: Calendar,
            color: 'bg-orange-500',
            textColor: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        {
            title: 'Upcoming Bookings',
            value: stats?.upcomingBookings || 0,
            icon: Users,
            color: 'bg-indigo-500',
            textColor: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
        },
        {
            title: 'Cancelled Bookings',
            value: stats?.cancelledBookings || 0,
            icon: Calendar,
            color: 'bg-red-500',
            textColor: 'text-red-600',
            bgColor: 'bg-red-50',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <Link
                        to="/admin/add-turf"
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4"
                    >
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Plus size={24} className="text-primary-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Manage Turf</h3>
                            <p className="text-sm text-gray-600">Update turf information</p>
                        </div>
                    </Link>

                    <Link
                        to="/admin/manage-slots"
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4"
                    >
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Calendar size={24} className="text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Manage Slots</h3>
                            <p className="text-sm text-gray-600">Add or delete slots</p>
                        </div>
                    </Link>

                    <Link
                        to="/admin/offline-booking"
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4"
                    >
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <UserPlus size={24} className="text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Offline Booking</h3>
                            <p className="text-sm text-gray-600">Book for walk-ins</p>
                        </div>
                    </Link>

                    <Link
                        to="/admin/bookings"
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ClipboardList size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Manage Bookings</h3>
                            <p className="text-sm text-gray-600">View all bookings</p>
                        </div>
                    </Link>

                    <Link
                        to="/"
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4"
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <LayoutGrid size={24} className="text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">View Turf Page</h3>
                            <p className="text-sm text-gray-600">See customer view</p>
                        </div>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                                        <Icon size={24} className={stat.textColor} />
                                    </div>
                                </div>
                                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                                <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-4">Quick Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-3">Revenue Breakdown</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total Earnings</span>
                                    <span className="font-semibold text-green-600">
                                        ₹{stats?.totalRevenue?.toLocaleString() || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Today's Earnings</span>
                                    <span className="font-semibold text-blue-600">
                                        ₹{stats?.todayRevenue?.toLocaleString() || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Average per Booking</span>
                                    <span className="font-semibold text-purple-600">
                                        ₹{stats?.totalBookings > 0
                                            ? Math.round(stats.totalRevenue / stats.totalBookings).toLocaleString()
                                            : 0
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-700 mb-3">Booking Statistics</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Completed</span>
                                    <span className="font-semibold text-green-600">
                                        {stats?.totalBookings - stats?.upcomingBookings - stats?.cancelledBookings || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Upcoming</span>
                                    <span className="font-semibold text-blue-600">
                                        {stats?.upcomingBookings || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Cancelled</span>
                                    <span className="font-semibold text-red-600">
                                        {stats?.cancelledBookings || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
