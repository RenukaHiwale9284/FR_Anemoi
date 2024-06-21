import { Link } from "react-router-dom";
 import { Button } from 'primereact/button';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import "./Category.css";

const Category = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  // useEffect(() => {

  //   const fetchData = async () => {
  //     try {
  //       const apiUrl = "http://192.168.1.2:8000/getAttendanceReport";
  //       const response = await fetch(apiUrl);
  //       if (!response.ok) {
  //         throw new Error("Network was not ok");
  //       }
  //       const data = await response.json();
  //       setAttendanceData(data);
  //       setLoading(false)
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
        const apiUrl = `${import.meta.env.VITE_REACT_API_URL}/getAttendanceReport`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network was not ok");
        }
        const data = await response.json();
        setAttendanceData(data);
        setLoading(false);
        console.log(data, "data from service");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  
  return (
    <>
      <div className="px-5 mt-3">
        <div className="d-flex">
          <h3 className="justify-content-left">Attendance Report</h3>
        </div>
        <hr></hr>
        <Link to="/dashboard/addCategory" className="btn btn-success addCategory">
        <i className="bi bi-download"></i>&nbsp; Download Report
      </Link>
      </div>
      <div></div>
      <br></br>
      <div className="mt-5 ml-5 mr-5">
      <DataTable
          value={attendanceData}
          loading={loading}
          tableStyle={{ minWidth: "50rem" }}
          style={{ borderRadius: "2px", border: "1px solid #3d3d3d" }}
          size={"small"}
          showGridlines
          paginator
          rows={8}
          dataKey="id" // Assuming "id" is a unique identifier in your data
          rowHover
          className="custom-data-table"
          >
             <Column field="empid" header="Employee ID"></Column>
             <Column field="name" header="Employee Name"></Column>
             <Column field="date" header="Date"></Column>
             <Column field="intime" header="Check-in"></Column>
             <Column field="outtime" header="Check-out"></Column>
             <Column field="breaktime" header="Break Time"></Column>
             <Column field="totaltime" header="Total Time"></Column>
           
            </DataTable>
      </div>

    </>
  );
};

export default Category;
