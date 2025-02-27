const apiUrl = "http://localhost:3000";

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    document.getElementById("message").innerText = data.message;

    if (data.success) {
        // ✅ Redirect to the dashboard correctly
        window.location.href = "/Dashboard.html";  
    }
}
