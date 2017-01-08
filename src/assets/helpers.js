function init() {
  navController();
}

function navController() {
  const mBtn = document.querySelector('.menubutton');
  const navList = document.querySelector('.navlist');
  mBtn.addEventListener('click', function() {
    navList.classList.toggle('is-open');
  });
}

document.addEventListener('DOMContentLoaded', function() {
  init();
});
