import { Card } from "primereact/card";
import { Button } from "primereact/button";
import "./Register.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";

const Register = () => {
  const { employeeId } = useParams();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const apiUrl = `http://192.168.1.2:8000/getEmpRegistrationById/${employeeId}`;
  //       const response = await fetch(apiUrl);
  //       if (!response.ok) {
  //         throw new Error("Network was not ok");
  //       }
  //       const data = await response.json();
  //       data;
  //       setEmpId(data.empid);
  //       setFullName(data.name);
  //       setEmailId(data.email);
  //       setContactNo(data.mobile);
  //       setDepartment(data.department);
  //       setDoj(data.joiningdate);
  //       setFileName(data.file.filename)
  //       if (data.file && data.file.data.data && data.file.filename) {
  //         const reader = new FileReader();
  //         reader.onloadend = () => {
  //           setImage(reader.result);
  //           setFileName(data.file.filename);
  //         };
  //         reader.readAsDataURL(
  //           new Blob([Uint8Array.from(data.file.data.data)])
  //         );
  //         setFileName(data.file.filename);
  //       }
  //       console.log(data, "data from service");
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [employeeId]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiUrl = `${import.meta.env.VITE_REACT_API_URL}/getEmpRegistrationById/${employeeId}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network was not ok");
        }
        const data = await response.json();
        setEmpId(data.empid);
        setFullName(data.name);
        setEmailId(data.email);
        setContactNo(data.mobile);
        setDepartment(data.department);
        setDoj(data.joiningdate);
        setFileName(data.file.filename)
        if (data.file && data.file.data.data && data.file.filename) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImage(reader.result);
            setFileName(data.file.filename);
          };
          reader.readAsDataURL(
            new Blob([Uint8Array.from(data.file.data.data)])
          );
          setFileName(data.file.filename);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [employeeId]);
  
  const toast = useRef(null);
  const [empid, setEmpId] = useState("");
  const [name, setFullName] = useState("");
  const [email, setEmailId] = useState("");
  const [mobile, setContactNo] = useState("");
  const [department, setDepartment] = useState("");
  const [joiningdate, setDoj] = useState("");
  const [file, setImage] = useState();
  const [fileName, setFileName] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const handleInputChange = (event) => {
    console.log(event, event.target.files[0].name, "file evwent");
    setImage(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };
  // const [isFormFilled, setIsFormFilled] = useState(false);
  const navigate = useNavigate();

  // const checkFormValid = () => {

  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   const isEmailValid = emailRegex.test(email);

  //   // Validate phone number format (you can customize this validation)
  //   const phoneRegex = /^\d{10}$/;
  //   const isPhoneValid = phoneRegex.test(mobile);
  //   if (
  //     empid === ""||empid===null &&
  //     name === ""||name===null &&
  //     isEmailValid &&
  //     isPhoneValid &&
  //     department=== ""||department===null&&
  //     joiningdate === ""||joiningdate ===null
  //   ) {
  //     setIsFormFilled(false);
  //   } else {
  //     setIsFormFilled(true);
  //   }
  // };

  const formValidate = () => {
    let errors = {};

    // Employee ID validation
    if (!empid) {
      errors.empid = "Please enter Employee Id";
    } else if (!/^[a-zA-Z0-9]+$/.test(empid)) {
      errors.empid = "Employee Id should contain only alphabets and numbers";
    }

    // Name validation
    if (!name) {
      errors.name = "Please enter employee name";
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      errors.name = "Name should contain only alphabets";
    }

    // Email validation
    if (!email) {
      errors.email = "Please enter email";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(email)
    ) {
      errors.email = "Please enter a valid email";
    }

    // Mobile number validation
    if (!mobile) {
      errors.mobile = "Please enter mobile number";
    } else if (!/^[6-9]\d{9}$/.test(mobile)) {
      errors.mobile = "Please enter a valid 10-digit mobile number";
    }

    // Department validation
    if (!department) {
      errors.department = "Please select department";
    }

    // Date of Joining validation
    if (!joiningdate) {
      errors.joiningdate = "Please select date of joining";
    }

    // File validation
    if (!file) {
      errors.file = "Please select file";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   const isFormValid = formValidate();
  //   if (isFormValid) {
  //     setLoading(true);
  //     const apiUrl = "http://192.168.1.2:8000/empRegistration";
  //     const formData = new FormData();
  //     // formData.append("userName", values.userName);
  //     // formData.append("password", values.password);
  //     formData.append("empid", empid);
  //     formData.append("name", name);
  //     formData.append("email", email);
  //     formData.append("mobile", mobile);
  //     formData.append("department", department);
  //     formData.append("joiningdate", joiningdate);
  //     formData.append("file", file);

  //     // Log the form data
  //     for (var pair of formData.entries()) {
  //       console.log(pair[0] + ": " + pair[1]);
  //     }

  //     try {
  //       const response = await fetch(apiUrl, {
  //         method: "POST",
  //         body: formData,
  //       });

  //       if (!response.ok) {
  //         setLoading(false);
  //         toast.current.show({
  //           severity: "error",
  //           summary: "Unsuccessful",
  //           detail: "Something went wrong",
  //           life: 3000,
  //         });
  //         throw new Error("Network response was not ok");
  //       }
  //       setLoading(false);
  //       const data = await response.json();
  //       console.log("Response from server:", data);
  //       toast.current.show({
  //         severity: "success",
  //         summary: "Successful",
  //         detail: "Employee Added Successfully",
  //         life: 3000,
  //       });
  //       setTimeout(() => {
  //         navigate("/dashboard/employee");
  //       }, 2000);
  //     } catch (error) {
  //       setLoading(false);
  //       console.error("Error during API call:", error);
  //       toast.current.show({
  //         severity: "error",
  //         summary: "Unsuccessful",
  //         detail: "Something went wrong",
  //         life: 3000,
  //       });
  //     }
  //   }
  // };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
// formValidate();
//     const apiUrl = employeeId
//       ? `http://192.168.1.2:8000/updateEmpRegistrationNew/${employeeId}`
//       : "http://192.168.1.2:8000/empRegistration";

//     const formData = new FormData();
//     formData.append("empid", empid);
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("mobile", mobile);
//     formData.append("department", department);
//     formData.append("joiningdate", joiningdate);
//     formData.append("file", file);

//     try {
//       setLoading(true)
//       const response = await fetch(apiUrl, {
//         method: employeeId ? "PUT" : "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         setLoading(false)
//         throw new Error("Network response was not ok");
//       }

//       const data = await response.json();
//       console.log("Response from server:", data);
//       setLoading(false)
//       toast.current.show({
//         severity: "success",
//         summary: "Successful",
//         detail: employeeId
//           ? "Employee Updated Successfully"
//           : "Employee Added Successfully",
//         life: 3000,
//       });

//       setTimeout(() => {
//         navigate("/dashboard/employee");
//       }, 3000);
//     } catch (error) {
//       console.error("Error during API call:", error);
//       toast.current.show({
//         severity: "warn",
//         summary: "Unsuccessful",
//         detail: "Something went wrong",
//         life: 3000,
//       });
//     }
//   };
const handleSubmit = async (event) => {
  event.preventDefault();
  if (!formValidate()) return;
  
  const apiUrl = employeeId
    ? `${import.meta.env.VITE_REACT_API_URL}/updateEmpRegistrationNew/${employeeId}`
    : `${import.meta.env.VITE_REACT_API_URL}/empRegistration`;

  const formData = new FormData();
  formData.append("empid", empid);
  formData.append("name", name);
  formData.append("email", email);
  formData.append("mobile", mobile);
  formData.append("department", department);
  formData.append("joiningdate", joiningdate);
  formData.append("file", file);

  try {
    setLoading(true)
    const response = await fetch(apiUrl, {
      method: employeeId ? "PUT" : "POST",
      body: formData,
    });

    if (!response.ok) {
      setLoading(false)
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Response from server:", data);
    setLoading(false)
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: employeeId
        ? "Employee Updated Successfully"
        : "Employee Added Successfully",
      life: 3000,
    });

    setTimeout(() => {
      navigate("/dashboard/employee");
    }, 3000);
  } catch (error) {
    console.error("Error during API call:", error);
    toast.current.show({
      severity: "warn",
      summary: "Unsuccessful",
      detail: "Something went wrong",
      life: 3000,
    });
  }
};

  const handleBack = (event) => {
    console.log(event);
    navigate("/dashboard/employee");
  };
  return (
    <>
      <div>
        {loading ? (
          <span className="loading">
            <ProgressSpinner />
          </span>
        ) : null}
        <Toast ref={toast} />
        <div>
          <label className="headerLabel1">
            <i className="bi bi-chevron-left" onClick={handleBack}></i>
            {employeeId ? "Update Employee Details" : "Employee Registration"}
          </label>
        </div>
        <hr style={{ width: "95%", marginLeft: "2%" }}></hr>
        <div className="RegisterDiv vh-100">
          <div className="cardDiv">
            <Card className="registerCard">
              <h2 className="cardHeader">
                {employeeId ? "Update Employee Details" : "Register"}
              </h2>
              <form className="row g-3" onSubmit={handleSubmit}>
                {/* <div className="col-md-6">
              <label htmlFor="inputEmail4" className="form-label formLabel">
                Username :
              </label>
              <input
                type="input"
                className="form-control"
                id="inputEmail4"
                placeholder="Enter User Name"
                onChange={(e) =>
                  setValues({ ...values, userName: e.target.value })
                }
              ></input>
            </div>
            <div className="col-md-6">
              <label htmlFor="inputEmail4" className="form-label formLabel">
                Password :
              </label>
              <input
                type="input"
                className="form-control"
                id="inputEmail4"
                placeholder="Enter User Password"
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
              ></input>
            </div> */}
                <div className="col-4">
                  <label htmlFor="inputEmpId" className="form-label formLabel">
                    Employee Id :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputAddress"
                    placeholder="Enter Full Name"
                    value={empid}
                    onChange={(e) => {
                      setEmpId(e.target.value);
                    }}
                  ></input>
                  {formErrors.empid && (
                    <div className="error-message">{formErrors.empid}</div>
                  )}
                </div>
                <div className="col-8">
                  <label
                    htmlFor="inputAddress"
                    className="form-label formLabel"
                  >
                    Full Name :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputAddress"
                    placeholder="Enter Full Name"
                    value={name}
                    onChange={(e) => {
                      setFullName(e.target.value);
                    }}
                  ></input>
                  {formErrors.name && (
                    <div className="error-message">{formErrors.name}</div>
                  )}
                </div>
                <div className="col-md-4">
                  <label htmlFor="inputCity" className="form-label formLabel">
                    Email Id :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={email}
                    onChange={(e) => {
                      setEmailId(e.target.value);
                    }}
                  ></input>
                  {formErrors.email && (
                    <div className="error-message">{formErrors.email}</div>
                  )}
                </div>
                <div className="col-md-4">
                  <label htmlFor="inputCity" className="form-label formLabel">
                    Contact No. :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={mobile}
                    onChange={(e) => {
                      setContactNo(e.target.value);
                    }}
                  ></input>
                  {formErrors.mobile && (
                    <div className="error-message">{formErrors.mobile}</div>
                  )}
                </div>
                <div className="col-md-4">
                  <label htmlFor="Depatment" className="form-label formLabel">
                    Deparment :
                  </label>
                  <select
                    id="inputState"
                    className="form-select"
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                    }}
                  >
                    <option value="" disabled>
                      Choose Department...
                    </option>
                    <option value="IT">IT</option>
                    <option value="Operations">Operations</option>
                    <option value="Human Resourse">Human Resourse</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                  </select>
                  {formErrors.department && (
                    <div className="error-message">{formErrors.department}</div>
                  )}
                </div>
                <div className="col-md-4">
                  <label htmlFor="DOJ" className="form-label formLabel">
                    Date of joining :
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="inputCity"
                    value={joiningdate}
                    onChange={(e) => {
                      setDoj(e.target.value);
                    }}
                  ></input>
                  {formErrors.joiningdate && (
                    <div className="error-message">
                      {formErrors.joiningdate}
                    </div>
                  )}
                </div>
                <div className="col-md-4">
                  <label htmlFor="image" className="form-label formLabel">
                    Upload Image :
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="inputCity"
                    name="image"
                    onChange={handleInputChange}
                  ></input>
                  <span className="d-flex">
                    {" "}
                    {fileName && (
                      <p style={{ color: "red" }}>Selected File: {fileName}</p>
                    )}{" "}
                    {file && (
                      <img
                        src={file}
                        alt="Uploaded Image"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </span>

                  {formErrors.file && (
                    <div className="error-message">{formErrors.file}</div>
                  )}
                </div>
                <div className="col-12">
                  {/* <button type="submit" className="btn btn-primary">Register</button> */}
                  <Button
                    label={employeeId ? "Update" : "Submit"}
                    type="submit"
                    className="submitBtn p-button-sm"
                    // disabled={!isFormFilled}
                  />
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};
export default Register;
