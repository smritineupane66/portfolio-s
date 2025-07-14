// Fetch data from backend API and display it on the site
// Fetch backend API data and display it in the backend section
document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/smriti")
        .then((response) => response.json())
        .then((data) => {
            const backendSection = document.getElementById("backend-data");
            backendSection.innerHTML = `
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Role:</strong> ${data.role}</p>
                <p><strong>Message:</strong> ${data.message}</p>
            `;
        })
        .catch((error) => {
            console.error("API fetch error:", error);
        });
});


 
