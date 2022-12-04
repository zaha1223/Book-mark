const elUserLoginInpt = document.querySelector(".login-form__user-name");
const elUserPasswordInpt = document.querySelector(".login-form__user-password");
const elFormLogin = document.querySelector(".login-form");
const elErrorBox = document.querySelector(".error-box");
let URL_LOGIN = "https://reqres.in/api/login";

elFormLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(URL_LOGIN, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email: elUserLoginInpt.value,
      password: elUserPasswordInpt.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data?.token) {
        localStorage.setItem("token", data.token);
        window.location.replace("../user_page.html");
      } else {
        elErrorBox.classList.add("open");
      }
    })
    .catch((error) => {
      if (!data) {
        alert("Ma'lumotlar kelishi sekin");
      }
    });
});
