Hello Github!

Update 28 May:
Added basic html file. Overall layout is similar to tweeter and hopefully somewhat understandable. The questions are similar to twits except they have reply sub-articles that can be added. Things to do with javascript:
-toggle 'hidden' on windowbg and windowmain in the questionwindow, createwindow, and loginwindow articles when the ask, create account, and login buttons are pushed, respectively
-toggle 'hidden' when the cancel button on any of the above windows is pushed
-add login/create account functionality for the appropriate buttons (let me know how I can help with this)
-filter questions with searchbar
-add ability to add new questions to main
-add ability to append replies to question articles
-more stuff I'm forgetting
Things for me to do:
-hide items with hidden flag
-add a tag system
-css! (make it look not hideous)
-show that you're logged in
-answer any questions you all have about the html
-more stuff I'm forgetting
~Deven


Important note from Matthew:
To use the client-side portion of the authentication code, these includes are required in the header

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js"></script>
<script src="/clientauth.js" charset="utf-8"></script>

I added these to index.html

Note about MongoDB

To run the server now that it depends on MongoDB, you need to have the mongodb server running
in the background. You shouldn't need to do any setup besides starting the mongodb server