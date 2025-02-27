const apiUrl = "http://localhost:3000";

async function register() {
    try {
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;

        const res = await fetch(`${apiUrl}/register`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        document.getElementById("message").innerText = data.message;
    } catch (error) {
        document.getElementById("message").innerText = "❌ Error registering.";
        console.error("Register error:", error);
    }
}

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    document.getElementById("message").innerText = data.message;

    if (data.success) {
        window.location.href = data.redirect; // Redirect to /dashboard
    }
}



        const data = await res.json();
        document.getElementById("message").innerText = data.message;

        if (data.success) {
            window.location.href = "dashboard.html";
        }
    } catch (error) {
        document.getElementById("message").innerText = "❌ Error connecting to server.";
        console.error("Login error:", error);
    }
}

async function checkAuth() {
    try {
        const res = await fetch(`${apiUrl}/check-auth`, { credentials: "include" });
        const data = await res.json();

        if (!data.authenticated) {
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Auth check error:", error);
    }
}
