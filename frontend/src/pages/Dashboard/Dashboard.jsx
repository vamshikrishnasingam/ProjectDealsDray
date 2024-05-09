import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Dashboard() {
  // Mock data for total employees count and recent activities
  const totalEmployees = 100;
  const recentActivities = [
    { id: 1, description: "Adding New Employees" },
    { id: 2, description: "Editing Info" },
    { id: 3, description: "Deleting Details" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto p-6"
    >
      <h1 className="text-3xl text-white font-semibold mb-6 text-center">
        Welcome to Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-5">
        {/* Summary section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-100 rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <p className="text-gray-700">
            Admin Command Center is a sophisticated yet user-friendly dashboard
            designed to provide administrators with comprehensive insights and
            powerful tools for managing various aspects of the organization.
          </p>
        </motion.div>

        {/* Recent activities section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-100 rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <ul className="list-disc flex flex-col items-center pl-6">
            {recentActivities.map((activity) => (
              <motion.li
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {activity.description}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Analytics section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-200 rounded-lg p-6 mb-6 m-5"
      >
        <h2 className="text-xl font-semibold mb-4">Analytics</h2>
        <p className="text-gray-700">Analytics data will be displayed here.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-100 rounded-lg p-6 m-5"
      >
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <ul className="space-y-4">
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <Link
              to="/createemp"
              className="block text-blue-500 hover:underline"
            >
              <div className="flex items-center">
                <span className="text-lg mr-2">+</span>
                <span>Add Employee</span>
              </div>
            </Link>
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Link
              to="/employeelist"
              className="block text-blue-500 hover:underline"
            >
              <div className="flex items-center">
                <span className="text-lg mr-2">👥</span>
                <span>Manage Employees</span>
              </div>
            </Link>
          </motion.li>
          {/* Add more action items as needed */}
        </ul>
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;
