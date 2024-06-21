// eslint-disable-next-line no-unused-vars

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
// import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Dashboard from "./Components/Dashboard";
import Home from "./Components/Home";
import Empolyee from "./Components/Empolyee";
import Category from "./Components/Category";
import Profile from "./Components/Profile";
import AddCategory from "./Components/AddCategory";
import Leave from "./Components/Leave";
import Visiter from "./Components/Visiter";
import VisiterRagister from "./Components/VisiterRagister";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login></Login>}></Route>
        {/* <Route path='/register' element={<Register></Register>}></Route> */}
        <Route path="/dashboard" element={<Dashboard></Dashboard>}>
          <Route path="" element={<Home></Home>}></Route>
          <Route
            path="/dashboard/register"
            element={<Register></Register>}
          ></Route>
          <Route
            path="/dashboard/register/:employeeId"
            element={<Register></Register>}
          />
          <Route
            path="/dashboard/employee"
            element={<Empolyee></Empolyee>}
          ></Route>
          <Route
            path="/dashboard/VisiterRagister"
            element={<VisiterRagister></VisiterRagister>}
          ></Route>
          <Route
            path="/dashboard/visiter"
            element={<Visiter></Visiter>}
          ></Route>
          <Route
            path="/dashboard/category"
            element={<Category></Category>}
          ></Route>
          <Route
            path="/dashboard/profile"
            element={<Profile></Profile>}
          ></Route>
          <Route path="/dashboard/leave" element={<Leave></Leave>}></Route>
          <Route
            path="/dashboard/addCategory"
            element={<AddCategory></AddCategory>}
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
