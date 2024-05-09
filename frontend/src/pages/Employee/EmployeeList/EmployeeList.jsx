import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmployeeList.css"; // Import CSS file
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import EmployeeEditForm from "./EmployeeEditForm";
const EmployeeList = () => {
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
        "http://localhost:1729/employee-api/get-all-employees"
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

  //edit
  const [editEmployee, setEditEmployee] = useState(null);

  const handleEdit = (employeeId) => {
    const employeeToEdit = employees.find(
      (employee) => employee.email === employeeId
    );
    setEditEmployee(employeeToEdit);
  };

  const updateEmployee = async (updatedEmployee, email) => {
    console.log(updateEmployee);
    try {
      await axios.put(
        `http://localhost:1729/employee-api/update-employee/${email}`,
        updatedEmployee
      );
      fetchEmployees();
      setShowSuccessModal(true);
      setModalMessage("Employee details updated successfully");
      setEditEmployee(null); // Reset editEmployee state after successful update
    } catch (error) {
      console.error("Error updating employee:", error);
      setShowErrorModal(true);
      setModalMessage("Error updating employee details");
    }
  };
  const handleCancelEdit = () => {
    setEditEmployee(null);
  };

  const handleDelete = async (employeeEmail) => {
    try {
      await axios.delete(
        `http://localhost:1729/employee-api/delete-employee/${employeeEmail}`
      );
      // Refetch employees after successful deletion
      fetchEmployees();
      console.log("Employee deleted successfully");
      setShowSuccessModal(true);
      setModalMessage("Employee deleted successfully");
    } catch (error) {
      console.error("Error deleting employee:", error);
      setShowErrorModal(true);
      setModalMessage("Error deleting employee");
    }
  };

  return (
    <div>
      <h1 className="text-3xl text-white font-semibold m-3 text-center">
        Employee Details
      </h1>

      <div className="overflow-x-auto p-4">
        <div className="row text-left">
          <div className="col-lg-4 p-2">
            <NavLink to="/createemp" className="fa nav-link text-white w-100">
              <button className="text-white btn btn-success w-100 p-2">
                Create Employee{" "}
              </button>
            </NavLink>
          </div>
          <div className="col-lg-4 p-2">
            <button className="text-white btn btn-gray text-xl w-100 p-2">
              Total Count : {employees.length}
            </button>
          </div>
          <div className="col-lg-4 text-right">
            <input
              id="search"
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              className="search-input w-5/6 p-2"
            />
            <label htmlFor="search" className="text-white">
              <FaSearch className="text-xl" />
            </label>
          </div>
        </div>
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
                  <div className="p-2">
                    <button
                      onClick={() => handleEdit(employee.email)}
                      className="w-100 mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => handleDelete(employee.email)}
                      className="w-100 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

      {editEmployee && (
        <Modal
          show={true}
          onHide={handleCancelEdit}
          size="xl"
          dialogClassName="modal-xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Employee Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EmployeeEditForm
              employee={editEmployee}
              onSave={updateEmployee}
              onCancel={handleCancelEdit}
            />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default EmployeeList;
