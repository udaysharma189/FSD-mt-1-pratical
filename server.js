const express = require("express");
const app = express();
app.use(express.json());
let enrollments = [
    { id: 601, studentName: "Aarav Gupta", courseCode: "CS301", courseName: "Data Structures", semester: 3, attendance: 82 },
    { id: 602, studentName: "Meera Joshi", courseCode: "CS305", courseName: "Database Systems", semester: 3, attendance: 74 },
    { id: 603, studentName: "Kabir Khan", courseCode: "CS310", courseName: "Computer Networks", semester: 3, attendance: 91 }
];
let nextId = 604;
app.get("/api/enrollments", (req, res) => {
    res.status(200).json(enrollments);
});
app.post("/api/enrollments", (req, res) => {
    const { studentName, courseCode, courseName, semester, attendance } = req.body;

    if (!studentName || !courseCode || !courseName ||
        !Number.isInteger(semester) || semester <= 0 ||
        typeof attendance !== "number" || attendance < 0 || attendance > 100) {
        return res.status(400).json({ message: "Invalid data" });
    }

    const record = { id: nextId++, ...req.body };
    enrollments.push(record);
    res.status(201).json(record);
});
app.get("/api/enrollments/filter", (req, res) => {
    const result = enrollments.filter(
        e => e.semester === Number(req.query.semester)
    );
    res.json(result);
});
app.get("/api/enrollments/low-attendance", (req, res) => {
    res.json(enrollments.filter(e => e.attendance < 75));
});
app.get("/api/enrollments/:id", (req, res) => {
    const record = enrollments.find(
        e => e.id === Number(req.params.id)
    );

    if (!record)
        return res.status(404).json({ message: "Not found" });

    res.json(record);
});
app.put("/api/enrollments/:id", (req, res) => {
    const record = enrollments.find(
        e => e.id === Number(req.params.id)
    );

    if (!record)
        return res.status(404).json({ message: "Not found" });

    const { studentName, courseCode, courseName, semester, attendance } = req.body;

    if (!studentName || !courseCode || !courseName ||
        !Number.isInteger(semester) || semester <= 0 ||
        typeof attendance !== "number" || attendance < 0 || attendance > 100) {
        return res.status(400).json({ message: "Invalid data" });
    }

    Object.assign(record, req.body);
    res.json(record);
});
app.delete("/api/enrollments/:id", (req, res) => {
    const index = enrollments.findIndex(
        e => e.id === Number(req.params.id)
    );

    if (index === -1)
        return res.status(404).json({ message: "Not found" });

    enrollments.splice(index, 1);
    res.json({ message: "Deleted successfully" });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});