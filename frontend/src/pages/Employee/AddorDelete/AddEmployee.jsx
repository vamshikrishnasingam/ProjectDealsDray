import React, { useState } from "react";
import { Form, Button, Row, Col, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddEmployee() {
  // Get the current date and time
  const currentDate = new Date();
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
  const [showErrorModal, setShowErrorModal] = useState(false); // State for error modal
  const [modalMessage, setModalMessage] = useState(""); // State for modal message
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [designation, setDesignation] = useState("");
  const [gender, setGender] = useState("");
  const [courses, setCourses] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If there are validation errors, update the errors state and return
    let hasErrors = false;
    const newErrors = {};
    if (!name) {
      newErrors.name = "* Name is required ";
      hasErrors = true;
    }
    if (!email) {
      newErrors.email = "* Email is required";
    }
    if (!mobileNo) {
      newErrors.mobileNo = "* Mobile number is required";
      hasErrors = true;
    }
    if (!designation) {
      newErrors.designation = "* Designation is required";
      hasErrors = true;
    }
    if (!gender) {
      newErrors.gender = "* Gender is required";
      hasErrors = true;
    }
    if (courses.length === 0) {
      newErrors.courses = "* Atleast one of the courses is required";
      hasErrors = true;
    }
    if (!image) {
      newErrors.image = "* Image is required";
      hasErrors = true;
    }
    if (hasErrors) {
      setErrors(newErrors);
      console.log(newErrors);
      return;
    }

    // Construct the employee object
    const employee = {
      name,
      email,
      mobileNo,
      designation,
      gender,
      courses,
      dateAdded: currentDate.toISOString().split("T")[0],
    };
    let fd = new FormData();
    //append newUser to form data
    fd.append("user", JSON.stringify(employee));
    //append selected file to form data
    fd.append("image", image);
    console.log(employee);
    console.log(image);
    axios
      .post("http://localhost:1729/employee-api/add-employee", fd)
      .then((response) => {
        if (response.status === 200) {
          // Show success modal
          setShowErrorModal(true);
          setModalMessage(response.data.message);
          console.log(response.data.message);
          // Optionally reset form fields or do other actions upon success
        } else {
          setShowSuccessModal(true); // Show error modal
          console.log(response.data.message);
          setModalMessage(response.data.message); // Set error message
        }
      })
      .catch((err) => {
        setShowErrorModal(true); // Show error modal
        console.log(err);
        if (err.response) {
          setModalMessage(err.response.data.message); // Set error message
        } else if (err.request) {
          setModalMessage("Network error. Please try again."); // Set error message for request error
        } else {
          setModalMessage("An unexpected error occurred. Please try again."); // Set error message for other errors
        }
      });
    setErrors({});
  };

  const handleFileUpload = (event) => {
    console.log("File selected");
    const file = event.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    // Clear validation error for the current field
    setErrors({ ...errors, ["image"]: "" });
  };

  const handleChange = (fieldName) => {
    // Clear validation error for the current field
    setErrors({ ...errors, [fieldName]: "" });
  };

  return (
    <div className="w-75 mx-auto text-white text-left bg-gray-800 rounded-5 border-1 p-4 m-4">
      <h2 className="mt-5 mb-4 text-center text-2xl">Add Employee Details</h2>
      <Form
        onSubmit={handleSubmit}
        className="mx-auto"
        enctype="multizpart/form-data"
      >
        <Row className="mb-3">
          <Col>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                handleChange("name");
              }}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </Col>
          <Col>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                handleChange("email");
              }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Label>Mobile No</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter mobile number"
              value={mobileNo}
              onChange={(e) => {
                setMobileNo(e.target.value);
                handleChange("mobileNo");
              }}
              pattern="[0-9]{10}"
            />
            {errors.mobileNo && (
              <p className="text-red-500 text-sm mt-1">{errors.mobileNo}</p>
            )}
          </Col>
          <Col>
            <Form.Label>Designation</Form.Label>
            <Form.Control
              as="select"
              value={designation}
              onChange={(e) => {
                setDesignation(e.target.value);
                handleChange("designation");
              }}
            >
              <option value="">Select Designation</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </Form.Control>
            {errors.designation && (
              <p className="text-red-500 text-sm mt-1">{errors.designation}</p>
            )}
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Label>Gender</Form.Label>
            <div className="d-flex">
              <Form.Check
                inline
                label="Male"
                type="radio"
                id="male"
                value="Male"
                checked={gender === "Male"}
                onChange={(e) => {
                  setGender(e.target.value);
                  handleChange("gender");
                }}
              />
              <Form.Check
                inline
                label="Female"
                type="radio"
                id="female"
                value="Female"
                checked={gender === "Female"}
                onChange={(e) => {
                  setGender(e.target.value);
                  handleChange("gender");
                }}
              />
            </div>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}
          </Col>
          <Col>
            <Form.Label>Course</Form.Label>
            <div>
              <Form.Check
                inline
                label="MCA"
                type="checkbox"
                id="mca"
                checked={courses.includes("MCA")}
                onChange={(e) => {
                  setCourses((courses) =>
                    e.target.checked
                      ? [...courses, "MCA"]
                      : courses.filter((course) => course !== "MCA")
                  );
                  handleChange("courses");
                }}
              />
              <Form.Check
                inline
                label="BCA"
                type="checkbox"
                id="bca"
                checked={courses.includes("BCA")}
                onChange={(e) => {
                  setCourses((courses) =>
                    e.target.checked
                      ? [...courses, "BCA"]
                      : courses.filter((course) => course !== "BCA")
                  );
                  handleChange("courses");
                }}
              />
              <Form.Check
                inline
                label="BSC"
                type="checkbox"
                id="bsc"
                checked={courses.includes("BSC")}
                onChange={(e) => {
                  setCourses((courses) =>
                    e.target.checked
                      ? [...courses, "BSC"]
                      : courses.filter((course) => course !== "BSC")
                  );
                  handleChange("courses");
                }}
              />
            </div>
            {errors.courses && (
              <p className="text-red-500 text-sm mt-1">{errors.courses}</p>
            )}
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Label>Image Upload (jpg/png)</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileUpload}
              accept="image/jpeg,image/png"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </Col>
          {imagePreview && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </div>
          )}
        </Row>

        <div className="text-center">
          <Button variant="success" type="submit" className="mt-3 w-25">
            Submit
          </Button>
        </div>
      </Form>

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
}

export default AddEmployee;
