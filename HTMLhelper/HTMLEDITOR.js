const apiUrl = "http://localhost:3000";

        async function register() {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const res = await fetch(`${apiUrl}/register`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            document.getElementById("message").innerText = data.message;
        }

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
                window.location.href = "dashboard.html";
            }
        }
