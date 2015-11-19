function redirectToGithub(){
  var currentUrl = window.location.href; 
  var redirectUrl = "https://github.com/login/oauth/authorize?client_id=4cb2e781eaea4040f99d&scope=repo&redirect_uri=" + 
  currentUrl + "auth/github";
  console.log(redirectUrl);
  window.location = redirectUrl;
}
