
const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

const MONGO_URL = "mongodb://127.0.0.1:27017";
const DB_NAME = "CareerGuide";

app.use(express.json());
app.use(express.static(__dirname));

let studentsCollection;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Register student
app.post("/api/students", async (req, res) => {
    try {
        const { name, email, education, interest } = req.body;

        if (
            typeof name !== "string" || !name.trim() ||
            typeof email !== "string" || !email.trim() ||
            typeof education !== "string" || !education.trim() ||
            typeof interest !== "string" || !interest.trim()
        ) {
            return res.status(400).json({
                message: "Please fill in all fields."
            });
        }

        const student = {
            name: name.trim(),
            email: email.trim(),
            education: education.trim(),
            interest: interest.trim(),
            createdAt: new Date()
        };

        const result = await studentsCollection.insertOne(student);

        res.status(201).json({
            message: "Student registered successfully!",
            id: result.insertedId
        });
    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Unable to save student details."
        });
    }
});

// View student records for local testing
app.get("/api/students", async (req, res) => {
    try {
        const students = await studentsCollection
            .find({})
            .project({
                name: 1,
                email: 1,
                education: 1,
                interest: 1,
                createdAt: 1
            })
            .toArray();

        res.json(students);
    } catch (error) {
        console.error("Fetch error:", error);

        res.status(500).json({
            message: "Unable to fetch students."
        });
    }
});

async function startServer() {
    const client = new MongoClient(MONGO_URL);

    try {
        await client.connect();

        const db = client.db(DB_NAME);
        studentsCollection = db.collection("students");

        app.listen(PORT, () => {
            console.log(`CareerGuide running at http://localhost:${PORT}`);
            console.log("MongoDB connected to CareerGuide.students");
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        await client.close();
        process.exit(1);
    }
}

startServer();
