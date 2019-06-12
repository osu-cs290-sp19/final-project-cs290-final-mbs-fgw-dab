Hello Github!

Update 5 June:
-HTML just about finalized and copied to views/ folder. The original html file remains (DO NOT DETELE IT) but views/ has all the template variable locations so it is more up-to-date. 
-Also added css (this will be changed greatly later). 
-Functionality for search bar, adding questions+replies, and toggling 'hidden' class where appropriate needs to be implemented in index.js. 
-I may add a 404 page later. 
-The process of attaching replies to the appropriate question is difficult and we will need to discuss it in our meeting. 
-A blank space is at the top of the page when logged in in which the partial 'me.handlebars' needs to be added - this just shows your current username, and {{whoami}} needs to be passed in as an argument. 
-I can go over all this in more detail tomorrow.
~Deven

Adding Contents to Index JS! Hope this can be functional ASAP
- Login Functionality is In!
- Modals all Work
- Working on templating
- Searching to Come Soon!
~ Faaiq

Important note from Matthew:
To use the client-side portion of the authentication code, these includes are required in the header

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js"></script>
<script src="/clientauth.js" charset="utf-8"></script>

I added these to index.html

Note about MongoDB

To run the server now that it depends on MongoDB, you need to have the mongodb server running
in the background. You shouldn't need to do any setup besides starting the mongodb server


From Matthew:

I made some changes to the layout of the webpage; for example, there is now a seperate page for questions to reduce the business of the main page

In addition, I added CSS to answers, made the Pizza title a link to the homepage, and added titles to questions

Click on the title of a question to access the question's page
'