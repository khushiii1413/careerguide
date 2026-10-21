
const API_URL = "/api/careers";
const STUDENT_API_URL = "/api/students";


// ================= LOAD CAREERS FROM MONGODB =================

async function loadCareers() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load careers");
        }

        const careers = await response.json();

        const careerContainer = document.querySelector(
            "#careers .row"
        );

        if (!careerContainer) {
            console.error("Career container not found.");
            return;
        }

        // Keep the search input and its row intact.
        // Render cards only inside the career cards container.
        let cardsContainer = document.getElementById("careerCards");

        if (!cardsContainer) {
            cardsContainer = document.createElement("div");
            cardsContainer.id = "careerCards";
            cardsContainer.className = "row g-4";

            careerContainer.parentNode.appendChild(cardsContainer);
        }

        cardsContainer.innerHTML = "";

        careers.forEach(function (career) {
            const card = document.createElement("div");
            card.className = "col-md-4 career";

            const cardBody = document.createElement("div");
            cardBody.className = "card h-100 shadow-sm";

            const body = document.createElement("div");
            body.className = "card-body";

            const title = document.createElement("h5");
            title.className = "card-title";
            title.textContent = career.title || "Career";

            const description = document.createElement("p");
            description.className = "card-text";
            description.textContent = career.description || "";

            const skills = document.createElement("p");
            skills.className = "card-text";
            skills.textContent =
                "Skills: " +
                (Array.isArray(career.skills)
                    ? career.skills.join(", ")
                    : career.skills || "Not specified");

            body.appendChild(title);
            body.appendChild(description);
            body.appendChild(skills);

            cardBody.appendChild(body);
            card.appendChild(cardBody);
            cardsContainer.appendChild(card);
        });

        applyCareerSearch();

    } catch (error) {
        console.error("Career loading error:", error);
    }
}


// ================= CAREER SEARCH =================

function applyCareerSearch() {
    const searchInput = document.getElementById("search");

    if (!searchInput) return;

    const searchText = searchInput.value.toLowerCase();

    document.querySelectorAll(".career").forEach(function (career) {
        const text = career.innerText.toLowerCase();

        career.style.display =
            text.includes(searchText) ? "" : "none";
    });
}


// ================= STUDENT REGISTRATION =================

function setupStudentRegistration() {
    const studentForm = document.getElementById("studentForm");
    const message = document.getElementById("registrationMessage");

    if (!studentForm || !message) {
        console.error(
            "Student form or registration message element not found."
        );
        return;
    }

    studentForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const student = {
            name: studentForm.elements["name"].value.trim(),
            email: studentForm.elements["email"].value.trim(),
            education: studentForm.elements["education"].value,
            interest: studentForm.elements["interest"].value
        };

        if (
            !student.name ||
            !student.email ||
            !student.education ||
            !student.interest
        ) {
            message.textContent = "Please fill in all fields.";
            message.style.color = "red";
            return;
        }

        const submitButton = studentForm.querySelector(
            'button[type="submit"]'
        );

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Saving...";
        }

        message.textContent = "Saving your details...";
        message.style.color = "blue";

        try {
            const response = await fetch(STUDENT_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(student)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Unable to save registration."
                );
            }

            message.textContent =
                "Details Saved Successfully!";

            message.style.color = "green";

            studentForm.reset();

        } catch (error) {
            console.error("Registration error:", error);

            message.textContent =
                "Save failed: " + error.message;

            message.style.color = "red";

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Register Now";
            }
        }
    });
}


// ================= CONTACT FORM =================

function setupContactForm() {
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) return;

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const status = document.getElementById("contactStatus");

        if (status) {
            status.textContent =
                "Thank you! Your message has been submitted.";
            status.style.color = "green";
        } else {
            alert("Thank you! Your message has been submitted.");
        }

        contactForm.reset();
    });
}


// ================= START WEBSITE =================

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");

    if (searchInput) {
        searchInput.addEventListener("input", applyCareerSearch);
    }

    setupStudentRegistration();
    setupContactForm();
    loadCareers();
});
