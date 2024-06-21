import { Card } from "primereact/card";
import { Button } from "primereact/button";
import "./VisiterRegister.css";
import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";

const VisiterRagister = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [visiterId, setVisiterId] = useState("");
  const [name, setFullName] = useState("");
  const [email, setEmailId] = useState("");
  const [mobile, setContactNo] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [exitDate, setExitDate] = useState("");
  const [file, setImage] = useState();

  const [fileName, setFileName] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    console.log(event, event.target.files[0].name, "file event");
    setImage(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };
  const handleBack = (event) => {
    console.log(event);
    navigate("/dashboard/visiter");
  };

  const formValidate = () => {
    let errors = {};

    // Employee ID validation
    if (!visiterId) {
      errors.visiterId = "Please Enter Visiter Id";
    } else if (!/^[a-zA-Z0-9]+$/.test(visiterId)) {
      errors.visiterId = "Visiter Id should contain only alphabets and numbers";
    }

    // Name validation
    if (!name) {
      errors.name = "Please enter visiter name";
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      errors.name = "Visiter name should contain only alphabets";
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
    if (!contactPerson) {
      errors.contactPerson = "Please Enter Contact Person Name";
    } else if (!/^[a-zA-Z\s]+$/.test(contactPerson)) {
      errors.contactPerson =
        "Contact Person name should contain only alphabets";
    }

    // Date of Joining validation
    if (!entryDate) {
      errors.entryDate = "Please select date of Entry";
    }
    if (!exitDate) {
      errors.exitDate = "Please select date of Exit";
    }

    // File validation
    if (!file) {
      errors.file = "Please select Image file";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    if (!formValidate()) return;
    event.preventDefault();
    const apiUrl = `${import.meta.env.VITE_REACT_API_URL}/visitorRegistration`;
    const formData = new FormData();
    formData.append("visiterId", visiterId);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", mobile);
    formData.append("contactPerson", contactPerson);
    formData.append("entryDate", entryDate);
    formData.append("exitDate", exitDate);
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        setLoading(false);
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Response from server:", data);
      setLoading(false);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Visiter Added Successfully",
      });
      setTimeout(() => {
        navigate("/dashboard/visiter");
      }, 3000);
    } 
    catch (error) {
      console.error("Error during API call:", error);
      toast.current.show({
        severity: "warn",
        summary: "Unsuccessful",
        detail: "Something went wrong",
        life: 3000,
      });
      setLoading(false);
    }
  };
  return (
    <>
      <div>
      {loading ? (
          <span className="loading">
            <ProgressSpinner />
          </span>
        ) : null}
        <Toast ref={toast}></Toast>
        <div>
          <label className="registerHeader">
            <i className="bi bi-chevron-left" onClick={handleBack}></i>
            {"Visiter Registration"}
          </label>
        </div>
        <hr style={{ width: "95%", marginLeft: "2%" }}></hr>

        <div className="registerDiv vh-100">
          <div className="cardDiv">
            <Card className="visiterRegisterCard">
              <h2 className="cardHeader">{"Visiter Registration"}</h2>
              <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-4">
                  <label htmlFor="inputEmpId" className="form-label formLabel">
                    Visiter Id :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputAddress"
                    placeholder="Enter Visiter Id"
                    value={visiterId}
                    onChange={(e) => {
                      setVisiterId(e.target.value);
                    }}
                  ></input>
                  {formErrors.visiterId && (
                    <div className="error-message">{formErrors.visiterId}</div>
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
                    placeholder="Enter Email Id"
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
                    placeholder="Enter Mobile No."
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
                  <label
                    htmlFor="contactPerson"
                    className="form-label formLabel"
                  >
                    Contact Person :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    placeholder="Enter Contact Person Name"
                    value={contactPerson}
                    onChange={(e) => {
                      setContactPerson(e.target.value);
                    }}
                  ></input>
                  {formErrors.contactPerson && (
                    <div className="error-message">
                      {formErrors.contactPerson}
                    </div>
                  )}
                </div>
                <div className="col-md-4">
                  <label htmlFor="DOJ" className="form-label formLabel">
                    Date of Entry :
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="inputCity"
                    value={entryDate}
                    onChange={(e) => {
                      setEntryDate(e.target.value);
                    }}
                  ></input>
                  {formErrors.entryDate && (
                    <div className="error-message">{formErrors.entryDate}</div>
                  )}
                </div>
                <div className="col-md-4">
                  <label htmlFor="DOJ" className="form-label formLabel">
                    Date of Exit :
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="inputCity"
                    value={exitDate}
                    onChange={(e) => {
                      setExitDate(e.target.value);
                    }}
                  ></input>
                  {formErrors.exitDate && (
                    <div className="error-message">{formErrors.exitDate}</div>
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
                  {formErrors.file && (
                    <div className="error-message">{formErrors.file}</div>
                  )}
                </div>
                <div className="col-12">
                  {/* <button type="submit" className="btn btn-primary">Register</button> */}
                  <Button
                    label={"Register Visiter"}
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
export default VisiterRagister;
