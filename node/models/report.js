const mongoose = require('mongoose')
mongoose.set('strictQuery', true);


const reportSchema = mongoose.Schema({
date:String,
empid:String,
name:String,
department:String,
intime:String,
outtime:String,
totaltime:String,
breaktime:String,
// status: { type: String, default: 'absent' } 
// camreraLocation:String
})
        
    
const Report = mongoose.model('Report',reportSchema)

module.exports= Report
