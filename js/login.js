$(document).ready(function () {
  // Trigger login on Enter key press
  $("#email, #password").on("keypress", function (event) {
    if (event.key === "Enter" || event.keyCode === 13) {
      event.preventDefault();
      login();
    }
  });

  $("#loginForm").on("keypress", function (event) {
    if (event.key === "Enter" || event.keyCode === 13) {
      event.preventDefault();
      login();
    }
  });

  // Handle flipping left
  $(".flip-left").click(function () {
    $(".flip-card").removeClass("flipped-right").addClass("flipped-left");
  });

  // Handle flipping right
  $(".flip-right").click(function () {
    $(".flip-card").removeClass("flipped-left").addClass("flipped-right");
  });
});

// Function to log in
function login() {
  const email = $("#email").val();
  const password = $("#password").val();

  if (!email || !password) {
    showAlert("Please provide both your email and password.");
    return;
  }

  $.ajax({
    url: "./php/login.php",
    method: "POST",
    data: { email, password },
    success: handleSuccess,
  });
}

// Handle success after login
function handleSuccess(result) {
  if (typeof result === "object") {
    localStorage.setItem("logged_user", JSON.stringify(result));

    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    let redirectURL = "";

    if (logged_user) {
      // Checking user's role and redirecting accordingly
      switch (logged_user[0].role) {
        case "student":
          redirectURL = "student_dashboard.html";
          break;
        case "tutor":
          redirectURL = "tutor.html";
          break;
        case "secretariat":
          redirectURL = "secretariat.html";
          break;
        default:
          redirectURL = "index.html";
      }
    }

    showSuccessNotification();

    setTimeout(() => {
      navigateTo(redirectURL);
    }, 2500);
  } else if (result == "2") {
    showError("Invalid email or password.");
  } else {
    showError("An unexpected error occurred.");
  }
}


function navigateTo(url) {
  window.location.assign(url);
}

function showAlert(message) {
  const errorNotification = document.getElementById("errorNotification");
  errorNotification.innerText = message;
  errorNotification.classList.remove("hidden");
}

function showError(message) {
  const errorNotification = document.getElementById("errorNotification");
  errorNotification.innerText = message;
  errorNotification.classList.remove("hidden");

  setTimeout(() => {
    errorNotification.classList.add("hidden");
  }, 2500);
}

function showSuccessNotification() {
  const notification = document.getElementById("fadingSuccessNotification");
  notification.classList.remove("hidden");

  setTimeout(() => {
    notification.classList.add("fade-out");
  }, 500);

  setTimeout(() => {
    notification.classList.add("hidden");
    notification.classList.remove("fade-out");
  }, 2500);
}
