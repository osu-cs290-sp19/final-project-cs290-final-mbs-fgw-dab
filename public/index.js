//Adding More Code Below
//Faaiq WAQAR
var hiddenElems = document.getElementsByClassName('hidden');

var loginModal = document.getElementById('loginwindowbg');
var loginMain = document.getElementById('loginwindowmain');
var loginButtons = document.getElementsByClassName('menuitemnologin');
var loginClose = document.getElementsByClassName('windowscancel');
var loginSubmit = document.getElementsByClassName('windowsubmit');

var createModal = document.getElementById('createwindowbg');
var createMain = document.getElementById('createwindowmain');

var usernameInput = document.getElementById('loginwindowusername');
var passwordInput = document.getElementById('loginwindowpassword');
var usernameCreate = document.getElementById('createwindowusername');
var passwordCreate = document.getElementById('createwindowpassword');

loginButtons[0].addEventListener('click', openLoginModal);
loginButtons[1].addEventListener('click', openCreateModal);
loginSubmit[1].addEventListener('click', submitCreateModal);
loginSubmit[2].addEventListener('click', submitLoginModal);

function openLoginModal(){
  loginModal.classList.remove("hidden");
  loginMain.classList.remove("hidden");
}

function submitLoginModal(){
  var inUsername = usernameInput.value;
  var inPassword = passwordInput.value;
  loginUser(inUsername,inPassword,processLoginModal,errorLoginModal);
  loginModal.classList.add("hidden");
  loginMain.classList.add("hidden");
}

function processLoginModal(){
  alert("Login Successful");
}

function errorLoginModal(){
  alert("Login Failed, Username or Password Doesn't Match");
}

function closeLoginModal(){
  loginModal.classList.add("hidden");
  loginMain.classList.add("hidden");
}

function openCreateModal(){
  createModal.classList.remove("hidden");
  createMain.classList.remove("hidden");
}

function submitCreateModal(){
  var crUsername = usernameCreate.value;
  var crPassword = passwordCreate.value;
  signupUser(crUsername,crPassword,processCreateModal,errorCreateModal);
  createModal.classList.add("hidden");
  createMain.classList.add("hidden");
}

function processCreateModal(){
  alert("Login Created Successfully");
}

function errorCreateModal(){
  alert("Login Creation Failed, Username Error");
}

function closeCreateModal(){

}
