//Adding More Code Below
//Faaiq WAQAR
var hiddenElems = document.getElementsByClassName('hidden');

var loginModal = document.getElementById('windowbg');
var loginMain = document.getElementById('loginwindowmain');
var loginButtons = document.getElementsByClassName('menuitemnologin');
var loginClose = document.getElementsByClassName('windowcancel');
var loginSubmit = document.getElementsByClassName('windowsubmit');

var logout = document.getElementsByClassName('logoutbutton');
var askQuestion = document.getElementsByClassName('askbutton');

var createModal = document.getElementById('createwindowbg');
var createMain = document.getElementById('createwindowmain');

var questionModal = document.getElementById('windowmain');

var usernameInput = document.getElementById('loginwindowusername');
var passwordInput = document.getElementById('loginwindowpassword');
var usernameCreate = document.getElementById('createwindowusername');
var passwordCreate = document.getElementById('createwindowpassword');
var questionInput = document.getElementById('windowtext');

var loggedOptions = document.getElementsByClassName('menuitemyeslogin');
var logoutOptions = document.getElementsByClassName('menuitemnologin');

window.onload = function(){
  if(isUserLoggedIn()){
    for(var i = 0; i < loggedOptions.length; i++){
      loggedOptions[i].classList.remove("hidden");
    }
    for(var i = 0; i < logoutOptions.length; i++){
      logoutOptions[i].classList.add("hidden");
    }
  }
};

askQuestion[0].addEventListener('click', openQuestionModal);
loginButtons[0].addEventListener('click', openLoginModal);
loginButtons[1].addEventListener('click', openCreateModal);
loginClose[0].addEventListener('click', closeQuestionModal);
loginClose[1].addEventListener('click', closeCreateModal);
loginClose[2].addEventListener('click', closeLoginModal);
loginSubmit[0].addEventListener('click', submitQuestionModal);
loginSubmit[1].addEventListener('click', submitCreateModal);
loginSubmit[2].addEventListener('click', submitLoginModal);
logout[0].addEventListener('click',submitLogout);


function openLoginModal(){
  // loginModal.classList.remove("hidden");
  loginMain.classList.remove("hidden");
}

function submitLoginModal(){
  var inUsername = usernameInput.value;
  var inPassword = passwordInput.value;
  loginUser(inUsername,inPassword,processLoginModal,errorLoginModal);
  // loginModal.classList.add("hidden");
  loginMain.classList.add("hidden");
}

function processLoginModal(){
  alert("Login Successful");
  for(var i = 0; i < loggedOptions.length; i++){
    loggedOptions[i].classList.remove("hidden");
  }
  for(var i = 0; i < logoutOptions.length; i++){
    logoutOptions[i].classList.add("hidden");
  }
}

function errorLoginModal(){
  alert("Login Failed, Username or Password Doesn't Match");
}

function closeLoginModal(){
  // loginModal.classList.add("hidden");
  loginMain.classList.add("hidden");
}

function openCreateModal(){
  // createModal.classList.remove("hidden");
  createMain.classList.remove("hidden");
}

function submitCreateModal(){
  var crUsername = usernameCreate.value;
  var crPassword = passwordCreate.value;
  signupUser(crUsername,crPassword,processCreateModal,errorCreateModal);
  // createModal.classList.add("hidden");
  createMain.classList.add("hidden");
}

function processCreateModal(){
  alert("Login Created Successfully");
}

function errorCreateModal(){
  alert("Login Creation Failed, Username Error");
}

function closeCreateModal(){
  // createModal.classList.add("hidden");
  createMain.classList.add("hidden");
}

function submitLogout(){
  alert("Logged Out");
  for(var i = 0; i < loggedOptions.length; i++){
    loggedOptions[i].classList.add("hidden");
  }
  for(var i = 0; i < logoutOptions.length; i++){
    logoutOptions[i].classList.remove("hidden");
  }
  logoutUser;
}

function openQuestionModal(){
  // loginModal.classList.remove("hidden");
  questionModal.classList.remove("hidden");
}

function submitQuestionModal(){
  // loginModal.classList.add("hidden");
  questionModal.classList.add("hidden");
  var question = questionInput.value;
  var author = getUserID();
  console.log(author);

  var body = {};
  body.author = author;
  body.text = question;
  body.title = "";
  body.tags = [];

  $.ajax({
    type: "POST",
    url: "/new/question",
    contentType: 'application/json',
    data: JSON.stringify(body)
  });

  location.reload(true);
}

function closeQuestionModal(){
  // loginModal.classList.add("hidden");
  questionModal.classList.add("hidden");
}
