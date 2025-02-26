document.getElementById("registerForm").addEventListener("submit", async function(event) {
            event.preventDefault();
            const email = document.getElementById("regEmail").value;
            const password = document.getElementById("regPassword").value;

            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();
            document.getElementById("registerMessage").textContent = result.message;
        });

        document.getElementById("loginForm").addEventListener("submit", async function(event) {
            event.preventDefault();
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();
            document.getElementById("loginMessage").textContent = result.message;

            if (result.success) {
                window.location.href = "dashboard.html";
            }
        });

        document.getElementById("logoutBtn").addEventListener("click", async function() {
            await fetch("http://localhost:3000/logout");
            alert("Logged out!");
        });
