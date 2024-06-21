import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { format } from "date-fns";

import "./AddCategory.css";

const AddCategory = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const apiUrl = "http://192.168.1.2:8000/getEmpRegistration";
  //       const response = await fetch(apiUrl);
  //       if (!response.ok) {
  //         throw new Error("Network was not ok");
  //       }
  //       const data = await response.json();
  //       setEmpIdData(data);
  //       console.log(data, "data from service");
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   fetchData();
  // }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_REACT_API_URL}/getEmpRegistration`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network was not ok");
        }
        const data = await response.json();
        setEmpIdData(data);
        console.log(data, "data from service");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  
  const [empid, setEmpId] = useState(null);
  const [empidData, setEmpIdData] = useState([]);
  const [department, setDepartment] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const formValidate = () => {
    let errors = {};
    if (!startDate) {
      errors.startDate = "Please select the start date";
    }
    if (!endDate) {
      errors.endDate = "Please select the end date";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!formValidate()) return;

  //   const formattedStartDate = format(startDate, "yyyy-MM-dd");
  //   const formattedEndDate = format(endDate, "yyyy-MM-dd");

  //   const apiUrl = `http://192.168.1.2:8000/download-csv?empid=${empid}&department=${department}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;

  //   try {
  //     const response = await fetch(apiUrl, { method: "GET" });
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const csvData = await response.text();
  //     const blob = new Blob([csvData], { type: "text/csv" });
  //     const downloadLink = document.createElement("a");
  //     downloadLink.href = URL.createObjectURL(blob);
  //     downloadLink.download = "yourFileName.csv";
  //     document.body.appendChild(downloadLink);
  //     downloadLink.click();
  //     document.body.removeChild(downloadLink);
  //   } catch (error) {
  //     console.error("Error during API call:", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValidate()) return;
  
    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const formattedEndDate = format(endDate, "yyyy-MM-dd");
  
    const apiUrl = `${import.meta.env.VITE_REACT_API_URL}/download-csv?empid=${empid}&department=${department}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
  
    try {
      const response = await fetch(apiUrl, { method: "GET" });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const csvData = await response.text();
      const blob = new Blob([csvData], { type: "text/csv" });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "yourFileName.csv";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };
  
  const handleBack = () => {
    navigate("/dashboard/category");
  };

  const onEmpIdChange = (e) => {
    setEmpId(e.value);
  };

  const onDepartmentChange = (e) => {
    setDepartment(e.value);
  };

  const departmentData = [
    { departmentName: "IT" },
    { departmentName: "Operations" },
    { departmentName: "Human Resourse" },
    { departmentName: "Accounts" },
    { departmentName: "Sales" },
    { departmentName: "Finance" },
  ];

  return (
    <>
      <div>
        <label className="headerLabel1" onClick={handleBack}>
          <i className="bi bi-chevron-left"></i> Download Attendance Report
        </label>
        <hr style={{ width: "95%", marginLeft: "2%" }} />
      </div>

      <div className="d-flex justify-content-center align-items-center h-75">
        <div className="p-3 rounded w-50 border">
          <h4>Download Report</h4>
          <hr />
          <form onSubmit={handleSubmit}>
            <div className=" grid">
              <div className="field col-12 md:col-6">
                <label htmlFor="empid">Employee ID </label>
                <Dropdown
                  onChange={onEmpIdChange}
                  value={empid}
                  options={empidData}
                  optionLabel="empid"
                  optionValue="empid"
                  placeholder="Select Employee Id"
                  filter
                  className="w-full md:w-16rem"
                />
              </div>
              <div className="field col-12 md:col-6">
                <label htmlFor="empid">Department </label>
                <Dropdown
                  options={departmentData}
                  value={department}
                  onChange={onDepartmentChange}
                  optionLabel="departmentName"
                  optionValue="departmentName"
                  placeholder="Select Department"
                  filter
                  className="w-full md:w-16rem"
                />
              </div>
              <div className="field col-12 md:col-6">
                <label htmlFor="city">
                  Start Date<span style={{ color: "red" }}>*</span>
                </label>
                <Calendar
                  onChange={(e) => setStartDate(e.value)}
                  value={startDate}
                  showIcon
                  dateFormat="yy/mm/dd"
                  placeholder="Select Start Date"
                />
                {formErrors.startDate && (
                  <div className="error-message">{formErrors.startDate}</div>
                )}
              </div>
              <div className="field col-12 md:col-6">
                <label htmlFor="city">
                  End Date<span style={{ color: "red" }}>*</span>
                </label>
                <Calendar
                  onChange={(e) => setEndDate(e.value)}
                  value={endDate}
                  showIcon
                  placeholder="Select End Date"
                  dateFormat="yy/mm/dd"
                  styleClass="calender"
                />
                {formErrors.endDate && (
                  <div className="error-message">{formErrors.endDate}</div>
                )}
              </div>
            </div>
            <Button
              label="Download"
              type="submit"
              className="downloadBtn p-button-sm"
              size="small"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default AddCategory;
