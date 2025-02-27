document.getElementById("logoutBtn").addEventListener("click", async function() {
            await fetch("http://localhost:3000/logout");
            window.location.href = "index.html";
        });

        async function checkAuth() {
            const response = await fetch("http://localhost:3000/check-auth");
            const data = await response.json();
            if (!data.authenticated) {
                window.location.href = "index.html";
            }
        }

        checkAuth();
    </script>
