const apiUrl = "http://localhost:3000";

async function checkAuth() {
    const res = await fetch(`${apiUrl}/check-auth`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    if (data.authenticated) {
        const user = await fetchUserData();
        document.getElementById("welcome-message").innerText = `Welcome, ${user.email}!`;
        document.getElementById("loading").style.display = 'none';  // Hide loading message
    } else {
        window.location.href = "/login.html";  // Redirect to login if not authenticated
    }
}

async function fetchUserData() {
    const res = await fetch(`${apiUrl}/get-user`, {
        method: "GET",
        credentials: "include"
    });

    const data = await res.json();
    return data.user;
}

async function logout() {
    const res = await fetch(`${apiUrl}/logout`, {
        method: "GET",
        credentials: "include"
    });

    const data = await res.json();
    if (data.success) {
        window.location.href = "/login.html";  // Redirect to login after logout
    } else {
        alert("Logout failed.");
    }
}

// Run checkAuth when the page loads
window.onload = checkAuth;
