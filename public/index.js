//Adding More Code Below
//Faaiq WAQAR
var saveElement;
var hiddenElems = document.getElementsByClassName('hidden');

var background = document.getElementById('windowbg');
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

var itemSearch = document.getElementById('menusearchtext')

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
	document.getElementById("whoami").innerHTML = 'Logged in as ' + getUsername()
  }
};

if (itemSearch != undefined){
	itemSearch.addEventListener('input', searchAll);
}
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
  answerButton[i].addEventListener('click', function(event){ openAnswerModal(event)});
}

var pizzaTags = document.getElementsByClassName('taglink');
for (var i = 0; i < pizzaTags.length; i++){
  pizzaTags[i].addEventListener('click', function(event){ tagSearch(event) });
}
// pizzaTags[0].addEventListener('click', tagSearch);

function openLoginModal(){
  // loginModal.classList.remove("hidden");
  loginMain.classList.remove("hidden");
  background.classList.remove("hidden");
}

function submitLoginModal(){
  var inUsername = usernameInput.value;
  var inPassword = passwordInput.value;
  loginUser(inUsername,inPassword,processLoginModal,errorLoginModal);
  // loginModal.classList.add("hidden");
  loginMain.classList.add("hidden");
  background.classList.add("hidden");
  usernameInput.value = "";
  passwordInput.value = "";
}

function processLoginModal(){
  alert("Login Successful");
  for(var i = 0; i < loggedOptions.length; i++){
    loggedOptions[i].classList.remove("hidden");
  }
  for(var i = 0; i < logoutOptions.length; i++){
    logoutOptions[i].classList.add("hidden");
  }
  document.getElementById("whoami").innerHTML = 'Logged in as ' + getUsername()
}

function errorLoginModal(){
  alert("Login Failed, Username or Password Doesn't Match");
}

function closeLoginModal(){
  // loginModal.classList.add("hidden");
  background.classList.add("hidden");
  loginMain.classList.add("hidden");
  usernameInput.value = "";
  passwordInput.value = "";
}

function openCreateModal(){
  // createModal.classList.remove("hidden");
  createMain.classList.remove("hidden");
  background.classList.remove("hidden");
}

function submitCreateModal(){
  var crUsername = usernameCreate.value;
  var crPassword = passwordCreate.value;
  signupUser(crUsername,crPassword,processCreateModal,errorCreateModal);
  // createModal.classList.add("hidden");
  background.classList.add("hidden");
  createMain.classList.add("hidden");
  usernameCreate.value = "";
  passwordCreate.value = "";
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
  background.classList.add("hidden");
  usernameCreate.value = "";
  passwordCreate.value = "";
}

function submitLogout(){
  alert("Logged Out");
  for(var i = 0; i < loggedOptions.length; i++){
    loggedOptions[i].classList.add("hidden");
  }
  for(var i = 0; i < logoutOptions.length; i++){
    logoutOptions[i].classList.remove("hidden");
  }
  document.getElementById("whoami").innerHTML = 'Not logged in'
  logoutUser(function(){});
}

function openQuestionModal(){
  // loginModal.classList.remove("hidden");
  questionModal.classList.remove("hidden");
  background.classList.remove("hidden");
}

function submitQuestionModal(){
  // loginModal.classList.add("hidden");
  questionModal.classList.add("hidden");
  background.classList.add("hidden");
  var str = tagInput.value;
  var tags = str.split(" ");
  var question = questionInput.value;
  var author = getUserID();
  console.log(author);
  tagInput.value = "";
  questionInput.value = "";

  var body = {};
  body.author = author;
  body.text = question;
  body.title = document.getElementById("newquestiontitle").value;
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
  background.classList.add("hidden");
  tagInput.value = "";
  questionInpu.value = "";
}

function searchAll(){
  //Tags, Names, Contents
  resetSearch();
  var articles = document.getElementsByClassName('question');
  var inputSearch = document.getElementById('menusearchtext').value.toLowerCase();

  for(var i = 0; i < articles.length; i++){
    articles[i].classList.add("searchhidden");

	var content = articles[i].getElementsByClassName('questioncontent')[0]
	var author = content.getElementsByClassName('questionauthor')[0].innerText
	var text = content.getElementsByClassName('questiontext')[0].innerText
	var title = content.getElementsByClassName('questiontitle')[0].innerText

    if(title.toLowerCase().includes(inputSearch) || text.toLowerCase().includes(inputSearch) || author.toLowerCase().includes(inputSearch)){
      articles[i].classList.remove("searchhidden");
    }else{
		var tags = articles[i].getElementsByClassName('questioncontent')[0].getElementsByClassName('tag')[0].getElementsByClassName('taglist')[0].childNodes;

		console.log(tags)

		for (var j = 0; j < tags.length; j++){
			if (tags[j].nodeType == 1){

				var tag = tags[j].getElementsByClassName('taglink')[0]
				console.log(tag)

				if (tag.innerText.toLowerCase() == inputSearch){
				  articles[i].classList.remove("searchhidden");
				}
			}
		}
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

function tagSearch(event){
  var tagText = event.target.innerText
  var inputSearch = document.getElementById('menusearchtext');
  inputSearch.value = tagText
  console.log(inputSearch.value);
  searchAll();
}

function openAnswerModal(event){
  answerModal.classList.remove("hidden");
  background.classList.remove("hidden");
  saveElement = event.target.getAttribute('data-question-id')
}

function submitAnswerModal(){
  answerModal.classList.add("hidden");
  background.classList.add("hidden");
  var reply = document.getElementById('answerwindowtext');
  var response = reply.value;
  reply.value = "";
  // loginModal.classList.add("hidden");
  // questionModal.classList.add("hidden");
  // var str = tagInput.value;
  // var tags = str.split(" ");
  // var question = questionInput.value;
  var author = getUserID();
  // console.log(author);
  //
  var body = {};
  body.author = author;
  body.text = response;
  body.parent = saveElement;
  // body.title = "";
  // body.tags = tags;
  //
  $.ajax({
    type: "POST",
    url: "/new/answer",
    contentType: 'application/json',
    data: JSON.stringify(body),
	success: function(){
		location.reload(true)
	}
  });
}

function closeAnswerModal(){
  var reply = document.getElementById('answerwindowtext');
  answerModal.classList.add("hidden");
  background.classList.add("hidden");
  reply.value = "";
}

function goToHomepage(){
	window.location = '/'
}
