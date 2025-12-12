import AppLayout from '@/layouts/app-layout';
import { type DashboardProps } from '@/types';
import { Head } from '@inertiajs/react';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Dashboard({
    total_customer = 0,
    total_agents = 0,
    total_transfer,
    country_services = 0,
    chart_data = [],
    last_five_transactions = [],
    mostActiveCustomers = [],
}: DashboardProps) {
    const transferAmount = total_transfer?.total_sent
        ? typeof total_transfer.total_sent === 'number'
            ? total_transfer.total_sent
            : parseFloat(String(total_transfer.total_sent)) || 0
        : 0;

    // Transform chart data for recharts
    const chartData = chart_data && chart_data.length > 0
        ? [...chart_data].reverse().map((item) => ({
            month_year: item.month_year,
            total: typeof item.total_paid === 'string' ? parseFloat(item.total_paid) : item.total_paid,
        }))
        : [];

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="p-4 md:p-6 lg:p-8">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here's what's happening with your dealership.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-blue-50">
                                <DollarSign className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex items-center gap-1 text-sm text-green-600">
                                <TrendingUp className="w-4 h-4" />
                                <span>+12.5%</span>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
                        <p className="text-gray-900">$284,590</p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-green-50">
                                <ShoppingCart className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex items-center gap-1 text-sm text-green-600">
                                <TrendingUp className="w-4 h-4" />
                                <span>+8.2%</span>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">Active Orders</p>
                        <p className="text-gray-900">47</p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-purple-50">
                                <Package className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="flex items-center gap-1 text-sm text-red-600">
                                <TrendingDown className="w-4 h-4" />
                                <span>-3.1%</span>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">Inventory Value</p>
                        <p className="text-gray-900">$1.2M</p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-orange-50">
                                <Users className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="flex items-center gap-1 text-sm text-green-600">
                                <TrendingUp className="w-4 h-4" />
                                <span>+18.7%</span>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">Total Customers</p>
                        <p className="text-gray-900">1,284</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-gray-900 mb-6">Sales Overview</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={[
                                { month: 'Jan', sales: 45000, orders: 23 },
                                { month: 'Feb', sales: 52000, orders: 28 },
                                { month: 'Mar', sales: 48000, orders: 25 },
                                { month: 'Apr', sales: 61000, orders: 32 },
                                { month: 'May', sales: 55000, orders: 29 },
                                { month: 'Jun', sales: 67000, orders: 35 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-gray-900 mb-6">Inventory by Category</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={[
                                { category: 'Sedans', count: 42 },
                                { category: 'SUVs', count: 38 },
                                { category: 'Trucks', count: 25 },
                                { category: 'Vans', count: 18 },
                                { category: 'Luxury', count: 12 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8b5cf6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-gray-900">Recent Orders</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-gray-600 text-sm">Order ID</th>
                                    <th className="px-6 py-3 text-left text-gray-600 text-sm">Customer</th>
                                    <th className="px-6 py-3 text-left text-gray-600 text-sm">Vehicle</th>
                                    <th className="px-6 py-3 text-left text-gray-600 text-sm">Status</th>
                                    <th className="px-6 py-3 text-left text-gray-600 text-sm">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-900">ORD-1234</td>
                                    <td className="px-6 py-4 text-gray-900">John Smith</td>
                                    <td className="px-6 py-4 text-gray-900">2024 Honda Accord</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                                            Processing
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">$28,500</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-900">ORD-1235</td>
                                    <td className="px-6 py-4 text-gray-900">Sarah Johnson</td>
                                    <td className="px-6 py-4 text-gray-900">2024 Toyota RAV4</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                                            Delivered
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">$32,900</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-900">ORD-1236</td>
                                    <td className="px-6 py-4 text-gray-900">Mike Davis</td>
                                    <td className="px-6 py-4 text-gray-900">2024 Ford F-150</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                                            Pending
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">$45,200</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-900">ORD-1237</td>
                                    <td className="px-6 py-4 text-gray-900">Emma Wilson</td>
                                    <td className="px-6 py-4 text-gray-900">2024 Tesla Model 3</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                                            Processing
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">$42,000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
