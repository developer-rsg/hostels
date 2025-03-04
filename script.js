document.addEventListener("DOMContentLoaded", function () {
    if (!localStorage.getItem("authToken")) {
        window.location.href = "login.html"; // Redirect if not logged in
    } else {
        fetchHostels(); // Load hostels after login
    }
});

// Fetch & Display Hostels
function fetchHostels() {
    fetch("http://localhost:8080/api/hostels")
    .then(response => response.json())
    .then(data => {
        displayHostels(data);
    })
    .catch(error => console.error("Error fetching hostels:", error));
}

function login() {
    let username = document.getElementById("login-username").value;
    let password = document.getElementById("login-password").value;

    // Simulating API call (replace with actual backend API)
    fetch("http://localhost:8080/api/users")
        .then(response => response.json())
        .then(users => {
            let user = users.find(u => u.username === username && u.password === password);
            if (user) {
                localStorage.setItem("loggedInUser", JSON.stringify(user)); // Store user in local storage
                window.location.href = "index.html"; // Redirect to homepage
            } else {
                document.getElementById("login-status").textContent = "Invalid username or password!";
            }
        })
        .catch(error => console.error("Error:", error));
}

// Display Hostels in UI
function displayHostels(hostels) {
    let container = document.getElementById("hostels-container");
    container.innerHTML = "";

    hostels.forEach(hostel => {
        let card = `
            <div class="col-md-4">
                <div class="card shadow-lg mb-4">
                    <img src="${hostel.imageUrl}" class="card-img-top" alt="${hostel.name}">
                    <div class="card-body">
                        <h5 class="card-title">${hostel.name}</h5>
                        <p class="text-muted">${hostel.location}</p>
                        <p>₹${hostel.price}/month | ⭐${hostel.rating}</p>
                        <button class="btn btn-success w-100" onclick="bookHostel(${hostel.id})">Book Now</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// Search & Filter Hostels
function searchHostels() {
    let location = document.getElementById("location").value;
    let minPrice = document.getElementById("minPrice").value;
    let maxPrice = document.getElementById("maxPrice").value;
    let minRating = document.getElementById("minRating").value;
    let wifi = document.getElementById("wifi").checked;
    let gym = document.getElementById("gym").checked;
    let food = document.getElementById("food").checked;

    let query = `?location=${location}&minPrice=${minPrice}&maxPrice=${maxPrice}&minRating=${minRating}&wifi=${wifi}&gym=${gym}&food=${food}`;

    fetch(`http://localhost:8080/api/hostels/filter${query}`)
    .then(response => response.json())
    .then(data => {
        displayHostels(data);
    })
    .catch(error => console.error("Error filtering hostels:", error));
}

// Book Hostel
function bookHostel(hostelId) {
    fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("authToken"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ hostelId }),
    })
    .then(response => response.json())
    .then(data => {
        alert("Booking successful! Check your email for confirmation.");
    })
    .catch(error => console.error("Error booking hostel:", error));
}

// Logout
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html"; // Redirect to login page
}

