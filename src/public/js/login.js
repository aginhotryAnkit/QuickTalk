gsap.to("#logo", { opacity: 1, y: -10, duration: 1, ease: "bounce" });
gsap.from("form input, button", {
  opacity: 0,
  y: 20,
  duration: 0.6,
  stagger: 0.2,
});

console.log("sd");

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Form ka default reload behavior rokna

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    // ✅ Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{6,}$/; // At least 6 characters

    if (!emailRegex.test(email)) {
      errorMessage.textContent = "Invalid email format";
      errorMessage.classList.remove("hidden");
      return;
    }
    if (!passwordRegex.test(password)) {
      errorMessage.textContent = "Password must be at least 6 characters";
      errorMessage.classList.remove("hidden");
      return;
    }

    // ✅ Backend API Call
    try {
      const response = await fetch("/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // ✅ If login successful, redirect user
      window.location.href = "/dashboard"; // Change to the actual dashboard route
    } catch (error) {
      errorMessage.textContent = error.message;
      errorMessage.classList.remove("hidden");
    }
  });
