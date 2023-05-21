const express = require("express");
const rateLimit = require("express-rate-limit");
const { Department, Employee } = require("./db");
const app = express();
const port = 5000;
require("./db");

const limited = rateLimit({
  windowMs: 5000,
  max: 5,
});

app.use(limited);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//add employee end point
app.post("/employee", async (req, res) => {
  try {
    const { firstName, lastName, emailAddress, departmentId } = req.body;

    //checking department is exist or not
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ error: "Department Not Found !" });
    }

    //create emp
    const employee = new Employee({
      firstName,
      lastName,
      emailAddress,
      departmentId,
    });
    const savedEmployee = await employee.save();

    res.status(200).json(savedEmployee);
  } catch (error) {
    console.error("Faild to create Employee : ", error);
    res.status(500).json({ error: "Faild to create Employee" });
  }
});

app.get("/employee", async (req, res) => {
  try {
    const { firstName, lastName, emailAddress, departmentName } = req.query;
    const filter = {};

    if (firstName) {
      filter.first_name = { $regex: firstName, $options: "i" };
    }
    if (lastName) {
      filter.lastName = { $regex: lastName, $options: "i" };
    }
    if (emailAddress) {
      filter.emailAddress = { $regex: emailAddress, $options: "i" };
    }

    if (departmentName) {
      const departments = await Department.find({
        departmentName: { $regex: departmentName, $options: "i" },
      });
      const departmentIds = departments.map((department) => {
        department._id;
      });
      filter.department = { $in: departmentIds };
    }

    const employees = await Employee.find(filter).populate("department");
    res.json(employees);
  } catch (error) {
    console.error("Failed to fetch Employee Data", error);
    res.status(500).json({ error: "Failed to fetch Employee Data" });
  }
});

app.post("/department", async (req, res) => {
  try {
    const { departmentName } = req.body;
    const existingDepartment = await Department.findOne({ departmentName });
    if (existingDepartment) {
      return res
        .status(409)
        .json({ error: "Department Is Exist already in database" });
    }

    const department = new Department({ departmentName });
    const savedDepartment = await department.save();

    res.status(201).json(savedDepartment);
  } catch (error) {
    console.error("Failed to create detaprtment", error);
    res.status(500).json({ error: "Failed to create detaprtment" });
  }
});

app.get("/department", async (req, res) => {
  try {
    const { departmentName } = req.query;
    const filter = {};

    if (departmentName) {
      filter.departmentName = { $regex: departmentName, $options: "i" };
    }

    const departments = await Department.find(filter);
    res.json(departments);
  } catch (error) {
    console.error("faild to get departmetn list");
    res.status(500).json({ error: "faild to get departmetn list" });
  }
});

app.listen(port, () => {
  console.log(`server is running ${port}`);
});
