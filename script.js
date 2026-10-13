
const API_URL = "/api/careers";

// Load careers from MongoDB API
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

        careerContainer.innerHTML = "";

        careers.forEach(function(career) {
            const card = document.createElement("div");
            card.className = "col-md-4 career mb-4";

            const title = document.createElement("h4");
            title.textContent = career.title;

            const description = document.createElement("p");
            description.textContent = career.description || "";

            const skills = document.createElement("p");
            skills.textContent =
                "Skills: " + (career.skills || []).join(", ");

            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(skills);

            careerContainer.appendChild(card);
        });

        applyCareerSearch();

    } catch (error) {
        console.error("Career loading error:", error);
    }
}


// Career Search
function applyCareerSearch() {
    const searchInput = document.getElementById("search");

    if (!searchInput) return;

    const searchText = searchInput.value.toLowerCase();

    document.querySelectorAll(".career").forEach(function(career) {
        const text = career.innerText.toLowerCase();

        career.style.display =
            text.includes(searchText) ? "" : "none";
    });
}

const searchInput = document.getElementById("search");

if (searchInput) {
    searchInput.addEventListener("input", applyCareerSearch);
}


// Contact Form
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();

        alert("Thank you! Your message has been submitted.");

        this.reset();
    });
}


// Start the website functionality
loadCareers();
