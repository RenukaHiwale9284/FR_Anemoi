import { Card } from "primereact/card";
import "./Leave.css";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useState } from "react";
const Leave = () => {
  const leaveType = [{ leave: "SL/CL" }, { leave: "EL" }];
  const leaveDay = [
    { day: "Full Day" },
    { day: "1st Half" },
    { day: "2nd Half" },
  ];

  const [values, setValues] = useState({
    employeeName: "",
    leaveType: "",
    fromDate: "",
    fromType: "",
    toDate: "",
    toType: "",
    reasoneLeave:""
  });

  const handleSubmit =(event )=>{
    event.preventDefault();

    console.log("form state ", values);
  }
  return (
    <>
      <div className="px-5 mt-5">
        <div className="d-flex">
          <h3 className="justify-content-left">Leave</h3>
        </div>
        <hr></hr>
      </div>

      <div className="LeaveDiv">
        <Card title="Leave Request" className="LeaveCard">
          <hr className="hrLine"></hr>
          <form onSubmit={handleSubmit}>
            <div className="field grid">
              <label htmlFor="firstname3" className="col-fixed">
                Employee Name
              </label>
              <div className="col">
                <InputText
                  onChange={(e) => setValues({...values,employeeName:e .target.value})}
                  className="empInput p-inputtext-sm"
                  placeholder="Employee Name"
                />
              </div>
            </div>
            <div className="field grid">
              <label htmlFor="firstname3" className="col-fixed ">
                Leave Type<span style={{ color: "red" }}>*</span>
              </label>
              <div className="col ml-4">
                <Dropdown
                  options={leaveType}
                  value={values}
                  onChange={(e) => setValues({...values,leaveType:e.target.value})}
                  optionLabel="leave"
                  optionValue="leave"
                  placeholder="Select Leave Type"
                  className="w-full md:w-35rem"
                />
              </div>
            </div>
            <div className="field grid formgroup-inline">
              <label htmlFor="firstname3" className="col-fixed ">
                From Date<span style={{ color: "red" }}>*</span>
              </label>
              <div className="col ml-5">
                <Calendar
                  onChange={(e) => setValues({...values,fromDate:e.target.value})}
                  showIcon
                  placeholder="Select"
                />
              </div>
              <div className="col">
                <Dropdown
                  options={leaveDay}
                  value={values}
                  onChange={(e) => setValues({...values,fromType:e.target.value})}
                  optionLabel="day"
                  optionValue="day"
                  placeholder="Select"
                  className="w-full md:w-35rem"
                />
              </div>
              <label htmlFor="firstname3" className="col-fixed ">
                To Date<span style={{ color: "red" }}>*</span>
              </label>
              <div className="col">
                <Calendar
                 onChange={(e) => setValues({...values,toDate:e.target.value})}
                  showIcon placeholder="Select"
                />
              </div>
              <div className="col">
                <Dropdown
                  options={leaveDay}
                  value={values}
                  onChange={(e) => setValues({...values,toType:e.target.value})}
                  optionLabel="day"
                  optionValue="day"
                  placeholder="select"
                  className="w-full md:w-35rem"
                />
              </div>
            </div>
            <div className="field grid">
              <label htmlFor="firstname3" className="col-fixed">
                Reasone For Leave
              </label>
              <div className="col inputText">
                <InputTextarea
                  className="input"
                  onChange={(e) => setValues({...values,reasoneLeave:e.target.value})}
                  rows={3}
                  cols={85}
                  placeholder="Write a reasone of leave"
                />
              </div>
            </div>
            <div className="d-flex gap-3 justify-content-center">
              <Button
                label="Cancel"
                severity="warning"
                className="submitBtn p-button-sm"
                size="small"
              />
              <Button label="Submit" className="submitBtn p-button-sm"  size="small" />
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export default Leave;
