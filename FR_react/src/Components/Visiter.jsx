import { Link, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./Visiter.css";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";

import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
const Visiter = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [visiterData, setVisiterData] = useState([]);
  const [reloadData, setReloadData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [visiter, setVisiter] = useState([]);
  const [deleteVisiterDialog, setDeleteVisiterDialog] = useState(false);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_REACT_API_URL}/getVisitorReport`;
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
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_REACT_API_URL}/getVisitorRegistration`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network was not ok");
        }
        const data = await response.json();
  
        // Processing image data for each employee
        const processedData = await Promise.all(data.map(async (visiterData) => {
          if (
            visiterData.file &&
            visiterData.file.data &&
            visiterData.file.data.type === "Buffer" &&
            Array.isArray(visiterData.file.data.data) &&
            visiterData.file.data.data.length > 0
          ) {
            const uint8Array = new Uint8Array(visiterData.file.data.data);
            const blob = new Blob([uint8Array], { type: "image/png" });
            const imageUrl = URL.createObjectURL(blob);
            return { ...visiterData, imageUrl, file: undefined };
          } else {
            console.error("No valid image data found for employee:", visiterData);
            return visiterData;
          }
        }));
  
        setVisiterData(processedData);
        setLoading(false);
        console.log(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [reloadData]);


  const hideDeleteEmployeeDialog = () => {
    setDeleteVisiterDialog(false);
    setVisiter(null);
    toast.current.show({
      severity: "warn",
      summary: "Warning",
      detail: "Visiter Deletion Cancelled",
      life: 3000,
    });
  };
  const deleteProduct = async () => {
    try {
      setLoading(true);
      const id = visiter;
      console.log(id, "visiter ID for delete");
      const apiUrl = `${import.meta.env.VITE_REACT_API_URL}/deleteVisitorRegistration/${id}`;
  
      const response = await fetch(apiUrl, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      console.log("visiter deleted successfully");
  
      // Update employeeData state after successful deletion
      setReloadData((prevState) => !prevState);
      setLoading(false);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Visiter Deleted Successfully",
        life: 3000,
      });
  
      setDeleteVisiterDialog(false);
      setVisiter(null);
    } catch (error) {
      toast.current.show({
        severity: "danger",
        summary: "Unsuccessful",
        detail: "Something went wrong",
        life: 3000,
      });
      console.error(
        "There was a problem deleting the employee:",
        error.message
      );
    }
  };
  const confirmDeleteVisiter = (event) => {
    setVisiter(event._id);
    setDeleteVisiterDialog(true);
  };
  const imageBodyTemplate = (rowData) => {
    return (
      <div className="flex align-items-center gap-2">
        <img
          src={rowData.imageUrl}
          alt="Employee Image"
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
        <span>{rowData.name}</span>
      </div>
    );
  };
  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-trash"
          severity="danger"
          rounded
          outlined
          aria-label="trash"
          className="deleteBtn"
          onClick={() => confirmDeleteVisiter(rowData)}
        />
      </>
    );
 };
 const deleteProductDialogFooter = (
  <>
    <Button
      label="Cancel"
      icon="pi pi-times"
      className="rounded outlined"
      onClick={hideDeleteEmployeeDialog}
    />
    &nbsp;&nbsp;
    <Button
      label="Delete"
      icon="pi pi-check"
      severity="danger"
      className="rounded outlined"
      onClick={deleteProduct}
    />
  </>
);
  return (
    <>
      <div className="px-5 mt-3">
        <Toast ref={toast} />
        <div className="d-flex">
          <h3 className="justify-content-left">Visiter Data</h3>
        </div>
        <hr></hr>
        <Link
          to="/dashboard/VisiterRagister"
          className="btn btn-success addEmployee"
        >
          Add New Visiter
        </Link>
      </div>
      <br></br>

      <TabView className="tab">
        <TabPanel header="Visiter Attendance">
          <p className="m-0">
            <div className="mt-0 ml-5 mr-5" style={{ zoom: "85%" }}>
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
                <Column field="visitorId" header="Visiter ID"></Column>
                <Column field="name" header="Visiter Name"></Column>
                <Column field="contactPerson" header="Contact Person"></Column>
                <Column field="date" header="Date"></Column>
                <Column field="intime" header="Check-in"></Column>
                <Column field="outtime" header="Check-out"></Column>
                <Column field="totaltime" header="Total Time"></Column>
              </DataTable>
            </div>
          </p>
        </TabPanel>
        <TabPanel header="Visiter Details">
          <p className="m-0">
            <div className="mt-0 ml-5 mr-5" style={{ zoom: "85%" }}>
              <DataTable
                value={visiterData}
                loading={loading}
                tableStyle={{ minWidth: "50rem" }}
                size={"small"}
                style={{ borderRadius: "2px", border: "1px solid #3d3d3d" }}
                className="custom-data-table"
                stripedRows
                showGridlines
                scrollable
                paginator
                rows={10}
                dataKey="id" // Assuming "id" is a unique identifier in your data
                rowHover
              >
                <Column field="visitorId" header="Visiter ID"></Column>
                <Column
                  body={imageBodyTemplate}
                  header="Visiter Profile"
                  exportable={false}
                  style={{ width: "15rem" }}
                ></Column>
                {/* <Column field="name" header="Employee Name"></Column> */}
                <Column field="email" header="Email Id"></Column>
                <Column field="mobile" header="Contact No"></Column>
                <Column field="contactPerson" header="Contact Person"></Column>
                <Column field="entryDate" header="Entry Date"></Column>
                <Column field="exitDate" header="Exit Date"></Column>
                <Column
                  body={actionBodyTemplate}
                  header="Action"
                  exportable={false}
                  style={{ minWidth: "5rem" }}
                ></Column>
              </DataTable>
            </div>
            
      <Dialog
        visible={deleteVisiterDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm Delete"
        modal
        footer={deleteProductDialogFooter}
        onHide={hideDeleteEmployeeDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-4"
            style={{ fontSize: "2rem" }}
          />

          <span style={{ fontSize: "20px" }}>
            Are you sure you want to delete the employee
          </span>
        </div>
      </Dialog>
          </p>
        </TabPanel>
      </TabView>
    </>
  );
};
export default Visiter;
