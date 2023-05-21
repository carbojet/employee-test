const mongoose = require("mongoose");
const connectString =
  "mongodb+srv://carbojet:dejavu35@cluster0.4rimq8i.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(connectString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    //if connect
    console.log("database Connected");
  })
  .catch((error) => {
    //if got any error to conenct
    console.log(`something went wrong ${error}`);
  });

//employee schema
const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },
  emailAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return /^[\w-]+(\.[\w-])+*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
      },
    },
    message: "Invalid EMail address",
  },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
});
const Employee = mongoose.model("Employee", employeeSchema);

//department schema
const departmentSchema = new mongoose.Schema({
  departmentName: { type: String, required: true },
});
const Department = mongoose.model("Department", departmentSchema);

module.exports = { Employee, Department };
