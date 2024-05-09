import { useState } from "react";
import { Form, Col, Row, Button } from "react-bootstrap";

const EmployeeEditForm = ({ employee, onSave, onCancel }) => {
  const [name, setName] = useState(employee.name);
  const [email, setEmail] = useState(employee.email);
  const [mobileNo, setMobileNo] = useState(employee.mobileNo);
  const [designation, setDesignation] = useState(employee.designation);
  const [gender, setGender] = useState(employee.gender);
  const [courses, setCourses] = useState(employee.courses);
  const [image, setImage] = useState(employee.image);
  const [imagePreview, setImagePreview] = useState(employee.image);

  const [errors, setErrors] = useState({});
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
  const handleSubmit = (e) => {
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
      newErrors.image = "*Image is required";
      hasErrors = true;
    }
    if (hasErrors) {
      setErrors(newErrors);
      console.log(newErrors);
      return;
    }

    const updatedEmployee = {
      name,
      email,
      mobileNo,
      designation,
      gender,
      courses,
      // Add any additional fields as needed
    };
    let fd = new FormData();
    //append newUser to form data
    fd.append("user", JSON.stringify(updatedEmployee));
    //append selected file to form data
    fd.append("image", image);
    console.log(updatedEmployee);
    console.log(image);
    onSave(fd, updatedEmployee.email);
    setErrors({});
  };

  const handleChange = (fieldName) => {
    // Clear validation error for the current field
    setErrors({ ...errors, [fieldName]: "" });
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="mx-auto"
      enctype="multipart/form-data"
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
            disabled
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
              name="gender"
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
              name="gender"
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
            placeholder="image/jpg"
            onChange={handleFileUpload}
            accept="image/jpeg,image/png"
          />
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
          {imagePreview && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </div>
          )}
        </Col>
      </Row>

      <div className="flex gap-6">
        <Button variant="primary" type="submit" className="mt-3">
          Submit
        </Button>
        <Button
          type="button"
          className="btn btn-secondary mt-3"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default EmployeeEditForm;
