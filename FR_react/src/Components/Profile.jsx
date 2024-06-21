import "./Profile.css";
import profile_photo from "../assets/101.jpg";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TabView, TabPanel } from "primereact/tabview";
const Profile = () => {
  return (
    <>
      <div className="grid ">
        <div className="col-4 ">
          <h3 className="flex justify-content-center flex-wrap mt-3">
            Member Profile
          </h3>

          <div className="upc">
            <div className="gradiant"></div>
            <div className="profile-down">
              <img src={profile_photo} alt="profile"></img>
              <div className="profile-title flex justify-content-center flex-wrap">
                <h5>Name : Rutik Shinde</h5>&nbsp;&nbsp;
                <h5>Employee ID : AT211</h5>
              </div>
              <div className="profile-description">
                <span className="">
                  <h5>About :</h5>
                  <hr className="mt-1"></hr>
                  <h5>Date of joining : 03/10/2022</h5>
                  <h5>Department: IT</h5>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-8">
          <TabView>
            <TabPanel header="Attendance History" leftIcon="pi pi-calendar mr-2">
              <div className="mt-4">
                <DataTable tableStyle={{ minWidth: "50%" }}>
                  <Column field="date" header="Date"></Column>
                  <Column field="checkIn" header="CheckIn"></Column>
                  <Column field="checkOut" header="CheckOut"></Column>
                  <Column field="timeSpan" header="TimeSpan"></Column>
                  <Column field="ipAddress" header="IP Address"></Column>
                  <Column field="camera" header="Camera Name"></Column>
                </DataTable>
              </div>
            </TabPanel>
            <TabPanel header="Leave History" rightIcon="pi pi-user ml-2">

            </TabPanel>
          </TabView>
        </div>
      </div>
    </>
  );
};

export default Profile;
