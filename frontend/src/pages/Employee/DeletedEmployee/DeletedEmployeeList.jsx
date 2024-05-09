import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DeletedEmployeeList.css"; // Import CSS file
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const DeletedEmployeeList = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
  const [showErrorModal, setShowErrorModal] = useState(false); // State for error modal
  const [modalMessage, setModalMessage] = useState(""); // State for modal message
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState({ field: null, ascending: true });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:1729/employee-api/get-deleted-employees"
      );
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSort = (field) => {
    const ascending = sortBy.field === field ? !sortBy.ascending : true;
    const sortedEmployees = [...filteredEmployees].sort((a, b) => {
      const aValue = a[field].toLowerCase();
      const bValue = b[field].toLowerCase();
      if (aValue < bValue) return ascending ? -1 : 1;
      if (aValue > bValue) return ascending ? 1 : -1;
      return 0;
    });
    setFilteredEmployees(sortedEmployees);
    setSortBy({ field, ascending });
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filteredData = employees.filter((employee) =>
      Object.values(employee).some((val) =>
        val.toString().toLowerCase().includes(value)
      )
    );
    setFilteredEmployees(filteredData);
  };

  const handleRestore = async (employeeEmail) => {
    // Implement your delete logic here
    try {
      await axios.post(
        `http://localhost:1729/employee-api/restore-employee/${employeeEmail}`
      );
      // Refetch employees after successful deletion
      fetchEmployees();
      console.log("Employee Restored successfully");
      setShowSuccessModal(true); // Show success modal
      setModalMessage("Employee Restored successfully");
    } catch (error) {
      console.error("Error Restoring employee:", error);
      setShowErrorModal(true); // Show error modal
      setModalMessage("Error Restoring employee"); // Set error
    }
  };

  return (
    <div>
      <h1 className="text-3xl text-white font-semibold p-2 text-center">
        Deleted Employee Details
      </h1>
      <div className="overflow-x-auto p-4">
        <table className="w-full border-collapse table-auto employee-table bg-gray-200">
          <thead>
            <tr className="bg-gray-400">
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("ID")}
              >
                ID {sortBy.field === "ID" && (sortBy.ascending ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name {sortBy.field === "name" && (sortBy.ascending ? "↑" : "↓")}
              </th>
              <th className="px-4 py-2">Image</th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email{" "}
                {sortBy.field === "email" && (sortBy.ascending ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("mobileNo")}
              >
                Mobile No{" "}
                {sortBy.field === "mobileNo" && (sortBy.ascending ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("designation")}
              >
                Designation{" "}
                {sortBy.field === "designation" &&
                  (sortBy.ascending ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("gender")}
              >
                Gender{" "}
                {sortBy.field === "gender" && (sortBy.ascending ? "↑" : "↓")}
              </th>
              <th className="px-4 py-2 cursor-pointer">Courses</th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort("dateAdded")}
              >
                Date Added{" "}
                {sortBy.field === "dateAdded" && (sortBy.ascending ? "↑" : "↓")}
              </th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, index) => (
              <tr key={employee.email}>
                <td className="border px-4 py-2">{employee.ID}</td>
                <td className="border px-4 py-2">{employee.name}</td>
                <td className="border px-4 py-2">
                  <img
                    src={employee.image}
                    alt="Employee"
                    className="rounded-4 border border-dark"
                    width={150}
                    height={150}
                  />
                </td>
                <td className="border px-4 py-2">{employee.email}</td>
                <td className="border px-4 py-2">{employee.mobileNo}</td>
                <td className="border px-4 py-2">{employee.designation}</td>
                <td className="border px-4 py-2">{employee.gender}</td>
                <td className="border px-4 py-2">
                  {employee.courses.join(",")}
                </td>
                <td className="border px-4 py-2">{employee.dateAdded}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleRestore(employee.email)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Restore
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modals for success and error messages */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowSuccessModal(false);
              navigate("/employeelist");
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showErrorModal}
        onHide={() => {
          setShowErrorModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              setShowErrorModal(false);
              navigate("/employeelist");
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeletedEmployeeList;
