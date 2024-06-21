// eslint-disable-next-line no-unused-vars
import React from "react";
import "./Dashboard.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from "../assets/logo.png"
const Dashboard = () => {
const navigate = useNavigate();
  const handleLogout=()=>{
    navigate('/')
  }
  return (
    <div className="container-fluid" style={{ overflow: "hidden" }}>
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-1 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100 sticky-top">
            <Link
              to="/dashboard"
              className="d-flex align-items-center pb-1 mb-md-1 mt-md-2 me-md-auto text-white text-decoration-none align-middle"
            >
              <img src={logo} alt="profile" className="logo-img" />
              <span className="fs-6 fw-bolder d-none d-sm-inline align-items-sm-start mb-4">
                Anemoi Technologies
              </span>
            </Link>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li className="w-100">
                <Link
                  to="/dashboard"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="fs-4 bi-speedometer2 ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/employee"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-people ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Manage Employees</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/visiter"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-person-fill-add ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Manage Visitor</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/category"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-clipboard2-data ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Attendance Report</span>
                </Link>
              </li>
              <li className="w-100" onClick={handleLogout}>
                <Link
                  to="/dashboard"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-power ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
          <div className="p-2 d-flex justify-content-center bg-dark text-white sticky-top">
            <h4>Employee Attendance System</h4>
          </div>
          <div className="OutletDiv">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
