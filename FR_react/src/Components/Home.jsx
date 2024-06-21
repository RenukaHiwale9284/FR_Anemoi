// s
import "./Home.css";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import attendance_photo from "../assets/user.png";
const Home = () => {
  const [totalEmployee, setTotalEmployee] = useState();
  const [totalPresent, setTotalPresent] = useState();
  const [totalLate, setTotalLate] = useState();
  const [totalAbsent, setTotalAbsent] = useState();
  const [attendanceData, setAttendanceData] = useState([]);
  const [latestEntryData, setEntryData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // const socket = io.connect("http://192.168.1.2:8000/getAttendanceReport")
    // console.log(socket,"socket info");
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiUrl = `${import.meta.env.VITE_REACT_API_URL}/employeeCount`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network was not ok");
        }
        const data = await response.json();
        setTotalEmployee(data.count);
        console.log(data, "data from service");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    const GetData = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_REACT_API_URL}/presentEmployeesCount`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network was not ok");
        }
        const data = await response.json();
        setTotalPresent(data.count);
        console.log(data, "data from service");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    GetData();
    const GetDataLate = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_REACT_API_URL}/lateEmployeesCount`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network was not ok");
        }
        const data = await response.json();
        setTotalLate(data.count);
        console.log(data, "data from service");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    GetDataLate();
    const GetDataAbsent = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_REACT_API_URL}/absentEmployeesCount`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network was not ok");
        }
        const data = await response.json();
        setTotalAbsent(data.Count);
        console.log(data, "data from service Absent");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    GetDataAbsent();
    const getLatestEntry = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_REACT_API_URL}/getAttendanceReportNew`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network was not ok");
        }
        const data = await response.json();
        setEntryData(data);
        console.log(data, "data from service");
        console.log(data);
        data.forEach(async (employeeData) => {


          // Check if the employee object has an image data
          if (
            employeeData.file &&
            employeeData.file.data &&
            employeeData.file.data.type === "Buffer" &&
            Array.isArray(employeeData.file.data.data) &&
            employeeData.file.data.data.length > 0
          ) {
            // Create a new Uint8Array from the Buffer data
            const uint8Array = new Uint8Array(employeeData.file.data.data);

            // Create a Blob from the Uint8Array
            const blob = new Blob([uint8Array], { type: "image/png" });

            // Convert blob to data URL
            const imageUrl = URL.createObjectURL(blob);
            console.log("Image URL:", imageUrl);

            // Here you can update the employeeData object to include the image URL
            employeeData.imageUrl = imageUrl;
            // Remove the file property as it's no longer needed
            delete employeeData.file;
          } else {
            console.error(
              "No valid image data found for employee:",
              employeeData
            );
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getLatestEntry();
    const fetchAttendanceData = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_REACT_API_URL}/getAttendanceReport`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network was not ok");
        }
        const data = await response.json();
        setAttendanceData(data.slice(0, 6));
        setLoading(false);
        console.log(data, "data from service for Attendance");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAttendanceData();
  }, []);
  useEffect(() => {
    setLoading(true);
    const data = {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Attendance",
          data: [7, 10, 11, 12],
          backgroundColor: [
            "rgba(255, 159, 64, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
          ],
          borderColor: [
            "rgb(255, 159, 64)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
            "rgb(153, 102, 255)",
          ],
          borderWidth: 3,

        },
      ],

    };
    const options = {
      scales: {
        x: { beginAtZero: true },
        y: {
          beginAtZero: true,
        },
      },
    };
    setLoading(false);
    setChartData(data);
    setChartOptions(options);
  }, [setChartData]);

  return (
    <>
      <div style={{ zoom: "90%", overflow: "hidden" }}>
        {loading ? (
          <span className="loading">
            <ProgressSpinner />
          </span>
        ) : null}
        <div className="px-5 mt-3">
          <div className="d-flex">
            <h3 className="justify-content-left">Dashboard</h3>
          </div>
          <hr style={{ marginTop: '5px' }}></hr>
        </div>

        <div className="cardsDiv" >
          <Card title="Total Employees" className="totalEmp">
            <hr className="mt-1" style={{ marginTop: "-10%" }}></hr>
            <p className="m-0 flex">
              Total Count : &nbsp; &nbsp;<h3>{totalEmployee}</h3>
            </p>
          </Card>
          <Card title="Employees Present" className="presentEmp">
            <hr className="mt-1"></hr>
            <p className="m-0 flex">
              On Time : &nbsp; &nbsp;<h3>{totalPresent}</h3>
            </p>
            <br></br>
            <br></br>
            <br></br>
          </Card>
          <Card title="Late Employees" className="lateEmp">
            <hr className="mt-1"></hr>
            <p className="m-0 flex">
              Late Count : &nbsp; &nbsp;<h3>{totalLate}</h3>
            </p>
          </Card>
          <Card title="Absent Employees" className="absentEmp">
            <hr className="mt-1"></hr>
            <p className="m-0 flex">
              Absent Count : &nbsp; &nbsp;<h3>{totalAbsent}</h3>
            </p>
          </Card>
        </div>
        <hr></hr>
        <div className="main-container">
          <div className="col-5 summary-container">
            <h4 className="summary-title">Monthly Attendance Summary</h4>
            <div className="chartCard">
              <Chart type="bar" data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="col-7 attendees-container">
            <h4>Recent Attendees</h4>
            <div className="recentCard">
              <div className="entryCard">
                {latestEntryData.map((attendee, index) => (
                  <div key={index} className="profile-card">
                    <span className="d-flex">
                      <img src={attendee.imageUrl} alt="profile" className="profile-img" />
                      <h6 className="profile-name">{attendee.name}</h6>
                    </span>
                    <p>Date: {attendee.date}</p>
                    <p>In-Time: {attendee.intime}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
