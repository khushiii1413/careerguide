
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();
const PORT = 3000;

const MONGODB_URI = "mongodb://127.0.0.1:27017";
const DB_NAME = "CareerGuide";

const client = new MongoClient(MONGODB_URI);

let careers;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// API status
app.get("/api", (req, res) => {
    res.json({
        message: "CareerGuide API is running!"
    });
});

// Get all careers
app.get("/api/careers", async (req, res) => {
    try {
        const data = await careers.find({}).toArray();
        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching careers",
            error: error.message
        });
    }
});

// Get one career by ID
app.get("/api/careers/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid career ID"
            });
        }

        const career = await careers.findOne({
            _id: new ObjectId(id)
        });

        if (!career) {
            return res.status(404).json({
                message: "Career not found"
            });
        }

        res.json(career);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching career",
            error: error.message
        });
    }
});

// Add a new career
app.post("/api/careers", async (req, res) => {
    try {
        const { title, description, skills } = req.body;

        if (!title || !description || !skills) {
            return res.status(400).json({
                message: "Title, description and skills are required"
            });
        }

        const newCareer = {
            title: title.trim(),
            description: description.trim(),
            skills: Array.isArray(skills) ? skills : [skills],
            createdAt: new Date()
        };

        const result = await careers.insertOne(newCareer);

        res.status(201).json({
            message: "Career added successfully",
            _id: result.insertedId,
            ...newCareer
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding career",
            error: error.message
        });
    }
});

// Update a career
app.put("/api/careers/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid career ID"
            });
        }

        const { title, description, skills } = req.body;
        const updateData = {};

        if (title !== undefined) updateData.title = title.trim();
        if (description !== undefined) {
            updateData.description = description.trim();
        }
        if (skills !== undefined) {
            updateData.skills = Array.isArray(skills) ? skills : [skills];
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "Provide at least one field to update"
            });
        }

        const result = await careers.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Career not found"
            });
        }

        res.json({
            message: "Career updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating career",
            error: error.message
        });
    }
});

// Delete a career
app.delete("/api/careers/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid career ID"
            });
        }

        const result = await careers.deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Career not found"
            });
        }

        res.json({
            message: "Career deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting career",
            error: error.message
        });
    }
});

// Add sample careers if collection is empty
async function seedCareers() {
    const count = await careers.countDocuments();

    if (count === 0) {
        const sampleCareers = [
            {
                title: "Software Developer",
                description: "Design and develop software applications.",
                skills: ["Java", "Python", "C++"]
            },
            {
                title: "AI / Machine Learning",
                description: "Build intelligent systems that learn from data.",
                skills: ["Python", "Machine Learning", "Statistics"]
            },
            {
                title: "Cyber Security",
                description: "Protect computers, networks and digital information.",
                skills: ["Networking", "Security", "Linux"]
            },
            {
                title: "Data Science",
                description: "Analyze data to find useful information and insights.",
                skills: ["Python", "Statistics", "SQL"]
            },
            {
                title: "Web Developer",
                description: "Create and maintain websites and web applications.",
                skills: ["HTML", "CSS", "JavaScript"]
            }
        ];

        await careers.insertMany(
            sampleCareers.map(career => ({
                ...career,
                createdAt: new Date()
            }))
        );

        console.log("Five sample careers added successfully!");
    }
}

// Connect MongoDB and start server
async function startServer() {
    try {
        await client.connect();

        const db = client.db(DB_NAME);
        careers = db.collection("careers");

        console.log("MongoDB Connected Successfully!");

        await seedCareers();

        app.listen(PORT, () => {
            console.log(
                `CareerGuide running at http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error("Server error:", error.message);
    }
}

startServer();