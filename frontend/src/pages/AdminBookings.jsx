import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Search, Filter, Download } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        paymentStatus: '',
        search: '',
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
    });

    useEffect(() => {
        fetchBookings();
    }, [pagination.page, filters]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('page', pagination.page);
            params.append('limit', pagination.limit);
            if (filters.status) params.append('status', filters.status);
            if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);

            const response = await api.get(`/bookings/admin/all?${params.toString()}`);
            setBookings(response.data.data.bookings);
            setPagination((prev) => ({
                ...prev,
                ...response.data.data.pagination,
            }));
        } catch (error) {
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'badge badge-warning',
            confirmed: 'badge badge-success',
            cancelled: 'badge badge-danger',
            completed: 'badge badge-info',
        };
        return badges[status] || 'badge';
    };

    const getPaymentBadge = (status) => {
        const badges = {
            pending: 'badge badge-warning',
            paid: 'badge badge-success',
            failed: 'badge badge-danger',
            refunded: 'badge badge-info',
        };
        return badges[status] || 'badge';
    };

    const handleDownloadInvoice = async (bookingId) => {
        try {
            const response = await api.get(`/bookings/${bookingId}/invoice`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${bookingId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Invoice downloaded');
        } catch (error) {
            toast.error('Failed to download invoice');
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                booking.bookingId.toLowerCase().includes(searchLower) ||
                booking.user?.name.toLowerCase().includes(searchLower) ||
                booking.user?.email.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
                    <p className="text-gray-600 mt-2">View and manage all turf bookings</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center mb-4">
                        <Filter size={20} className="mr-2" />
                        <h2 className="text-lg font-semibold">Filters</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    className="input-field pl-10"
                                    placeholder="Booking ID, Name, Email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Booking Status
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="input-field"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Status
                            </label>
                            <select
                                value={filters.paymentStatus}
                                onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
                                className="input-field"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={() => setFilters({ status: '', paymentStatus: '', search: '' })}
                                className="btn-secondary w-full"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="spinner"></div>
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">No bookings found</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Booking ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Turf
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date & Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Payment
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredBookings.map((booking) => (
                                            <tr key={booking._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {booking.bookingId}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm">
                                                        <div className="font-medium text-gray-900">
                                                            {booking.user?.name || 'N/A'}
                                                        </div>
                                                        <div className="text-gray-500">{booking.user?.email || 'N/A'}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">
                                                        {booking.turf?.name || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm">
                                                        <div className="text-gray-900">
                                                            {format(new Date(booking.date), 'MMM dd, yyyy')}
                                                        </div>
                                                        <div className="text-gray-500">
                                                            {booking.startTime} - {booking.endTime}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        ₹{booking.totalAmount}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={getStatusBadge(booking.status)}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={getPaymentBadge(booking.paymentStatus)}>
                                                        {booking.paymentStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {booking.paymentStatus === 'paid' && (
                                                        <button
                                                            onClick={() => handleDownloadInvoice(booking._id)}
                                                            className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                                                        >
                                                            <Download size={16} />
                                                            <span>Invoice</span>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination.pages > 1 && (
                                <div className="px-6 py-4 border-t flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                                            disabled={pagination.page === 1}
                                            className="btn-secondary disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                            disabled={pagination.page === pagination.pages}
                                            className="btn-secondary disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBookings;
