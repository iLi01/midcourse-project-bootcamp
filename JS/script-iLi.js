// nav-bar
const button = document.getElementById("nav-expand-button");
const nav = document.getElementById("main-nav");

button.addEventListener("click", () => {
  nav.classList.toggle("open");
});

//modal
const modal = document.getElementById("my-modal");
const btn = document.getElementById("events-btn");
const span = document.getElementsByClassName("close")[0];

span.onclick = function () {
  console.log("clicked");
  modal.style.display = "none";
};

window.onclick = function (e) {
  if (e.target == modal) {
    modal.style.display = "none";
  }
};

// $(function () {
//   $("a[href*=#reccomended-drinks]").on("click", function (e) {
//     e.preventDefault();
//     $("html, body").animate(
//       { scrollTop: $($(this).attr("href")).offset().top },
//       500,
//       "linear"
//     );
//   });
// });
