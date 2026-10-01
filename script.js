const menu = document.querySelector(".menu");
const nav = document.querySelector("#navLinks");
menu?.addEventListener("click", () => nav.classList.toggle("open"));
document.querySelectorAll("#navLinks a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});
