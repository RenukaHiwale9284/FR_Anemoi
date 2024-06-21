import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link, useNavigate } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import "./Employee.css";
import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
const Empolyee = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [employeeData, setEmployeeData] = useState([]);
  const [reloadData, setReloadData] = useState(false);
  const [deleteEmployeeDialog, setDeleteEmployeeDialog] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const apiUrl = "http://192.168.1.2:8000/getEmpRegistration";
  //       const response = await fetch(apiUrl);
  //       if (!response.ok) {
  //         throw new Error("Network was not ok");
  //       }
  //       const data = await response.json();
  //       setEmployeeData(data);
  //       setLoading(false);
  //       console.log(data);
  //       data.forEach(async (employeeData) => {
  //         console.log("Employee:", employeeData);
  
  //         // Check if the employee object has an image data
  //         if (
  //           employeeData.file &&
  //           employeeData.file.data &&
  //           employeeData.file.data.type === "Buffer" &&
  //           Array.isArray(employeeData.file.data.data) &&
  //           employeeData.file.data.data.length > 0
  //         ) {
  //           // Create a new Uint8Array from the Buffer data
  //           const uint8Array = new Uint8Array(employeeData.file.data.data);
  
  //           // Create a Blob from the Uint8Array
  //           const blob = new Blob([uint8Array], { type: "image/png" });
  
  //           // Convert blob to data URL
  //           const imageUrl = URL.createObjectURL(blob);
  //           console.log("Image URL:", imageUrl);
  
  //           // Here you can update the employeeData object to include the image URL
  //           employeeData.imageUrl = imageUrl;
  //           // Remove the file property as it's no longer needed
  //           delete employeeData.file;
  //         } else {
  //           console.error(
  //             "No valid image data found for employee:",
  //             employeeData
  //           );
  //         }
  //       });
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   fetchData();
  // }, [reloadData]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_REACT_API_URL}/getEmpRegistration`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network was not ok");
        }
        const data = await response.json();
  
        // Processing image data for each employee
        const processedData = await Promise.all(data.map(async (employeeData) => {
          if (
            employeeData.file &&
            employeeData.file.data &&
            employeeData.file.data.type === "Buffer" &&
            Array.isArray(employeeData.file.data.data) &&
            employeeData.file.data.data.length > 0
          ) {
            const uint8Array = new Uint8Array(employeeData.file.data.data);
            const blob = new Blob([uint8Array], { type: "image/png" });
            const imageUrl = URL.createObjectURL(blob);
            return { ...employeeData, imageUrl, file: undefined };
          } else {
            console.error("No valid image data found for employee:", employeeData);
            return employeeData;
          }
        }));
  
        setEmployeeData(processedData);
        setLoading(false);
        console.log(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [reloadData]);
  
  const hideDeleteEmployeeDialog = () => {
    setDeleteEmployeeDialog(false);
    setEmployee(null);
    toast.current.show({
      severity: "warn",
      summary: "Warning",
      detail: "Employee Deleted Cancelled",
      life: 3000,
    });
  };

  const editProduct = (event) => {
    console.log(event._id, "hello ID");
    const employeeId = event._id;
    console.log(employeeId);
    navigate(`/dashboard/register/${employeeId}`);
    // history.push(`/dashboard/register/${employeeId}`);
  };

  const confirmDeleteEmployee = (event) => {
    setEmployee(event._id);
    setDeleteEmployeeDialog(true);
  };


  const deleteProduct = async () => {
    try {
      setLoading(true);
      const id = employee;
      console.log(id, "employee ID for delete");
      const apiUrl = `${import.meta.env.VITE_REACT_API_URL}/deleteEmpRegistration/${id}`;
  
      const response = await fetch(apiUrl, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      console.log("Employee deleted successfully");
  
      // Update employeeData state after successful deletion
      setReloadData((prevState) => !prevState);
      setLoading(false);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Employee Deleted",
        life: 3000,
      });
  
      setDeleteEmployeeDialog(false);
      setEmployee(null);
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
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2 editBtn"
          aria-label="pencil"
          onClick={() => editProduct(rowData)}
        />

        <Button
          icon="pi pi-trash"
          severity="danger"
          rounded
          outlined
          aria-label="trash"
          className="deleteBtn"
          onClick={() => confirmDeleteEmployee(rowData)}
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
          <h3 className="justify-content-left">Employee List</h3>
        </div>
        <hr></hr>
        <Link to="/dashboard/register" className="btn btn-success addEmployee">
          Add New Employee
        </Link>
      </div>
      <br></br>
      <div className="mt-5 ml-5 mr-5" style={{zoom:'85%'}}>
        <DataTable
          value={employeeData}
          loading={loading}
          tableStyle={{ minWidth: "50rem" }}
          size={"small"}
          style={{ borderRadius: "2px", border: "1px solid #3d3d3d" }}
          className="custom-data-table"
          stripedRows
          showGridlines
          paginator
          rows={10}
          dataKey="id" // Assuming "id" is a unique identifier in your data
          rowHover
        >
          <Column field="empid" header="Employee ID"></Column>
          <Column
            body={imageBodyTemplate}
            header="Employee Profile"
            exportable={false}
            style={{ width: "12rem" }}
          ></Column>
          {/* <Column field="name" header="Employee Name"></Column> */}
          <Column field="email" header="Email Id"></Column>
          <Column field="mobile" header="Contact No"></Column>
          <Column field="department" header="Department"></Column>
          <Column field="joiningdate" header="Date of Joining"></Column>
          <Column
            body={actionBodyTemplate}
            header="Action"
            exportable={false}
            style={{ minWidth: "10rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={deleteEmployeeDialog}
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
    </>
  );
};

export default Empolyee;
