const express = require('express');
const http = require('http');
const cors = require('cors');
const moment = require('moment');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const RegistrationRouter = require('./routers/registration');
const ReportRouter = require('./routers/report');
const VisitorRegistrationRouter = require('./routers/visitorRegistration');
const VisitorReportRouter = require('./routers/visitorReport')

const app = express();
const port = process.env.PORT || 8000;

const server = http.createServer(app);

// Initialize Socket.io
const io = socketIO(server);

// Connect to your MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/AttendanceNew', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to database!');
});

// Code for new report collection
const Attendance = require('./models/attendance');
const Registration = require('./models/registration');
const Report = require('./models/report');

// Run function every day at midnight
cron.schedule('0 * * * *', async  () => {
// cron.schedule('30 20 * * *', async () => {
  try {
    const report = await Attendance.find();
    const reportWithIntimeAndOuttime = {};

    for (let i = 0; i < report.length; i++) {
      const attendance = report[i];
      const key = `${attendance.empid}_${attendance.date}`;

      if (attendance.readerno === 1) {
        if (!reportWithIntimeAndOuttime[key]) {
          reportWithIntimeAndOuttime[key] = {
            empid: attendance.empid,
            name: '',
            department: '',
            date: attendance.date,
            intime: [], // Initialize as an empty array
            outtime: [], // Initialize as an empty array
            totaltime: null,
          };
        }

        if (
          reportWithIntimeAndOuttime[key].outtime.length ===
          reportWithIntimeAndOuttime[key].intime.length
        ) {
          reportWithIntimeAndOuttime[key].intime.push(attendance.time); // Add intime to the array
        }
      }

      if (attendance.readerno === 2) {
        if (reportWithIntimeAndOuttime[key]) {
          reportWithIntimeAndOuttime[key].outtime.push(attendance.time); // Add outtime to the array
        }
      }
    }

    const reportWithTotaltime = await Promise.all(
      Object.values(reportWithIntimeAndOuttime).map(async (attendance) => {
        const registration = await Registration.findOne({ empid: attendance.empid });
        const name = registration ? registration.name : '';
        const department = registration ? registration.department : '';
        // const attendanceDate = moment(attendance.date, 'MM-DD-YYYY');
        const attendanceDate = attendance ? attendance.date : '';
        // const formattedDate = attendanceDate.format('YYYY-MM-DD');

        const intimeArray = attendance.intime;
        const outtimeArray = attendance.outtime;

        let firstIntime, lastOuttime, totalMilliseconds = 0;

        if (intimeArray.length >= 1 && outtimeArray.length >= 1) {
          firstIntime = moment(`1970-01-01T${intimeArray[0]}`).format('HH:mm:ss');
          lastOuttime = moment(`1970-01-01T${outtimeArray[outtimeArray.length - 1]}`).format(
            'HH:mm:ss'
          );

          // Calculate total time between firstIntime and lastOuttime
          totalMilliseconds = moment(lastOuttime, 'HH:mm:ss').diff(
            moment(firstIntime, 'HH:mm:ss')
          );
        } else {
console.log('Insufficient intime or outtime entries');
      firstIntime = moment(`1970-01-01T${intimeArray[0]}`).format('HH:mm:ss');
      // If outtime is not available, set it to "00:00:00"
      lastOuttime = '00:00:00';
        }

        // Calculate break times in between
        const breakTimes = [];
        let totalBreakTimeMilliseconds = 0;

        for (let i = 0; i < outtimeArray.length - 1; i++) {
          const currentOuttime = new Date(`1970-01-01T${outtimeArray[i]}`);
          const nextIntime = new Date(`1970-01-01T${intimeArray[i + 1]}`);

          const breakTimeMilliseconds = nextIntime - currentOuttime;

          // Accumulate total break time
          totalBreakTimeMilliseconds += breakTimeMilliseconds;

          // Convert breakTimeMilliseconds to 'hh:mm' format
          const breakTimeHours = Math.floor(breakTimeMilliseconds / (60 * 60 * 1000));
          const breakTimeMinutes = Math.floor(
            (breakTimeMilliseconds % (60 * 60 * 1000)) / (60 * 1000)
          );

          const formattedBreakTime = `${String(breakTimeHours).padStart(2, '0')}:${String(
            breakTimeMinutes
          ).padStart(2, '0')}`;
          breakTimes.push(formattedBreakTime);
        }

        // Convert totalBreakTimeMilliseconds to 'hh:mm' format
        const totalBreakTimeHours = Math.floor(
          totalBreakTimeMilliseconds / (60 * 60 * 1000)
        );
        const totalBreakTimeMinutes = Math.floor(
          (totalBreakTimeMilliseconds % (60 * 60 * 1000)) / (60 * 1000)
        );

        const formattedTotalBreakTime = `${String(totalBreakTimeHours).padStart(2, '0')}:${String(
          totalBreakTimeMinutes
        ).padStart(2, '0')}`;

        const totalSeconds = totalMilliseconds / 1000;
        const totalMinutes = totalSeconds / 60;
        const totalHours = Math.floor(totalMinutes / 60); // Calculate total hours
        const remainingMinutes = Math.floor(totalMinutes % 60); // Calculate remaining minutes

        const formattedTotalTime = isNaN(totalHours) || isNaN(remainingMinutes)
          ? '00:00'
          : `${totalHours.toString().padStart(2, '0')}:${remainingMinutes
              .toString()
              .padStart(2, '0')}`;


              // Check if a report already exists for this empid and date              
                      const existingReport = await Report.findOne({ empid: attendance.empid, date: attendanceDate });               
                      if (existingReport) {              
                        // Update the existing report              
                        await Report.updateOne(             
                          { _id: existingReport._id },              
                          {              
                            intime: firstIntime,              
                            outtime: lastOuttime,              
                            totaltime: formattedTotalTime,              
                            breaktime: formattedTotalBreakTime,              
                          }              
                        );              
                      } else {              
                        // Insert a new report              
                        const result = await Report.create({              
                          empid: attendance.empid,              
                          name: name,              
                          department: department,              
                          date: attendanceDate,              
                          intime: firstIntime,              
                          outtime: lastOuttime,              
                          totaltime: formattedTotalTime,             
                          breaktime: formattedTotalBreakTime,              
                        });             
                        console.log(result);              
                      }              
                    })              
                  );

    // Emit a 'reportGenerated' event when a new report is generated
    // io.emit('reportGenerated', result);

    // console.log(result);
  } catch (err) {
    console.error(err);
  }
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(RegistrationRouter);
app.use(ReportRouter);
app.use(VisitorRegistrationRouter);
app.use(VisitorReportRouter);

// Start the server
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
