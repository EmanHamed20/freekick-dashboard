const Dashboard = () => {
    return (
        <div className="w-full my-5">
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold text-primary-600">$12,426</p>
                    <p className="text-xs text-green-600 mt-2">↑ 12% from last month</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Bookings</h3>
                    <p className="text-3xl font-bold text-primary-600">248</p>
                    <p className="text-xs text-green-600 mt-2">↑ 8% from last month</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Users</h3>
                    <p className="text-3xl font-bold text-primary-600">1,426</p>
                    <p className="text-xs text-green-600 mt-2">↑ 15% from last month</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                            <p className="font-medium text-gray-800">New booking at Al Mariyah</p>
                            <p className="text-sm text-gray-500">2 hours ago</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Confirmed
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                            <p className="font-medium text-gray-800">Venue request submitted</p>
                            <p className="text-sm text-gray-500">5 hours ago</p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                            Pending
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="font-medium text-gray-800">Payment received</p>
                            <p className="text-sm text-gray-500">1 day ago</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            Completed
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;