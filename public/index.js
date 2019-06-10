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
var tagInput = document.getElementById('windowtags');

var loggedOptions = document.getElementsByClassName('menuitemyeslogin');
var logoutOptions = document.getElementsByClassName('menuitemnologin');

var itemSearch = document.querySelector('input[type="text"]');

var createCancel = document.getElementsByClassName('createwindowcancel');
var createSend = document.getElementsByClassName('createwindowsubmit');
var loginCancel = document.getElementsByClassName('loginwindowcancel');
var loginSend = document.getElementsByClassName('loginwindowsubmit');
var questionCancel = document.getElementsByClassName('windowcancel');
var questionSend = document.getElementsByClassName('windowsubmit');
var answerCancel = document.getElementsByClassName('answerwindowcancel');
var answerSend = document.getElementsByClassName('answerwindowsubmit');
var answerModal = document.getElementById('answerwindowmain');
var answerButton = document.getElementsByClassName('windowanswer');

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

itemSearch.addEventListener('input', searchAll);
askQuestion[0].addEventListener('click', openQuestionModal);
loginButtons[0].addEventListener('click', openLoginModal);
loginButtons[1].addEventListener('click', openCreateModal);
questionCancel[0].addEventListener('click', closeQuestionModal);
createCancel[0].addEventListener('click', closeCreateModal);
loginCancel[0].addEventListener('click', closeLoginModal);
questionSend[0].addEventListener('click', submitQuestionModal);
createSend[0].addEventListener('click', submitCreateModal);
loginSend[0].addEventListener('click', submitLoginModal);
answerCancel[0].addEventListener('click', closeAnswerModal);
answerSend[0].addEventListener('click', submitAnswerModal);
logout[0].addEventListener('click',submitLogout);
for(var i = 0; i < answerButton.length; i++){
  answerButton[i].addEventListener('click', openAnswerModal);
}

var pizzaTags = document.getElementsByClassName('taglink');
for (var i = 0; i < pizzaTags.length; i++){
  pizzaTags[i].addEventListener('click', function(){ tagSearch(i) });
}
// pizzaTags[0].addEventListener('click', tagSearch);

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
  logoutUser();
}

function openQuestionModal(){
  // loginModal.classList.remove("hidden");
  questionModal.classList.remove("hidden");
}

function submitQuestionModal(){
  // loginModal.classList.add("hidden");
  questionModal.classList.add("hidden");
  var str = tagInput.value;
  var tags = str.split(" ");
  var question = questionInput.value;
  var author = getUserID();
  console.log(author);

  var body = {};
  body.author = author;
  body.text = question;
  body.title = "";
  body.tags = tags;

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

function searchAll(){
  //Tags, Names, Contents
  resetSearch();
  var authors = document.getElementsByClassName('questionauthor');
  var questions = document.getElementsByClassName('questiontext');
  var articles = document.getElementsByClassName('question');
  var inputSearch = document.getElementById('menusearchtext');

  for(var i = 0; i < articles.length; i++){
    if(!questions[i].innerText.includes(inputSearch.value) && !authors[i].innerText.includes(inputSearch.value)){
        articles[i].classList.add("searchhidden");
    }
  }
  // for(var i = 0; i < pizzaTags.length; i++){
  //   if(pizzaTags[i].innerText.includes(inputSearch.value)){
  //     articles[i].classList.remove("searchhidden");
  //
  //   }
}

function resetSearch(){
  var resSearch = document.getElementsByClassName('searchhidden');
  for(var i = 0; i < resSearch.length; i++){
    resSearch[i].classList.remove('searchhidden');
    i--;
  }
}

function tagSearch(index){
  console.log(index);
  var inputSearch = document.getElementById('menusearchtext');
  inputSearch.value = pizzaTags[index-1].innerText;
  console.log(inputSearch.value);
  searchAll();
}

function openAnswerModal(){
  answerModal.classList.remove("hidden");
}

function submitAnswerModal(){
  // loginModal.classList.add("hidden");
  // questionModal.classList.add("hidden");
  // var str = tagInput.value;
  // var tags = str.split(" ");
  // var question = questionInput.value;
  // var author = getUserID();
  // console.log(author);
  //
  // var body = {};
  // body.author = author;
  // body.text = question;
  // body.title = "";
  // body.tags = tags;
  //
  // $.ajax({
  //   type: "POST",
  //   url: "/new/question",
  //   contentType: 'application/json',
  //   data: JSON.stringify(body)
  // });
}

function closeAnswerModal(){
answerModal.classList.add("hidden");
}
