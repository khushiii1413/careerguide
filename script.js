// Career Search

document.getElementById("search")
.addEventListener("keyup", function() {

    let searchText =
        this.value.toLowerCase();

    let careers =
        document.querySelectorAll(".career");

    careers.forEach(function(career) {

        let text =
            career.innerText.toLowerCase();

        if (text.includes(searchText)) {

            career.style.display = "block";

        } else {

            career.style.display = "none";

        }

    });

});


// Contact Form

document.getElementById("contactForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    alert("Thank you! Your message has been submitted.");

    this.reset();

});
