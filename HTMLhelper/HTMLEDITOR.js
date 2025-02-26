const apiUrl = "http://localhost:3000";

// 🔹 Register User
async function registerUser(email, password) {
    const res = await fetch(`${apiUrl}/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    alert(data.message);
}

// 🔹 Login User
async function loginUser(email, password) {
    const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    alert(data.message);
    if (data.success) loadProgress();
}

// 🔹 Logout User
async function logoutUser() {
    await fetch(`${apiUrl}/logout`, { credentials: "include" });
    alert("Logged out");
}

// 🔹 Save User Progress
async function saveProgress(progress) {
    const res = await fetch(`${apiUrl}/save-progress`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress })
    });
    const data = await res.json();
    alert(data.message);
}

// 🔹 Load User Progress
async function loadProgress() {
    const res = await fetch(`${apiUrl}/get-progress`, { credentials: "include" });
    const data = await res.json();
    
    if (data.success) {
        console.log("User Progress:", data.progress);
        document.getElementById("progress").innerText = JSON.stringify(data.progress, null, 2);
    }
}

// 🔹 Check Login Status
async function checkAuth() {
    const res = await fetch(`${apiUrl}/check-auth`, { credentials: "include" });
    const data = await res.json();
    if (data.authenticated) {
        loadProgress();
    }
}

// 🔹 Example Usage
document.getElementById("registerBtn").addEventListener("click", () => {
    registerUser("test@example.com", "password123");
});

document.getElementById("loginBtn").addEventListener("click", () => {
    loginUser("test@example.com", "password123");
});

document.getElementById("saveProgressBtn").addEventListener("click", () => {
    saveProgress({ level: 3, score: 200 });
});

document.getElementById("logoutBtn").addEventListener("click", logoutUser);

// 🔹 Run on Page Load
checkAuth();
