function redirectToGithub(){
  var currentUrl = window.location.origin;
  var client_public_main = "4cb2e781eaea4040f99d";
  var client_public_local = "31500e1e887db90d5473";
  var client_public = (currentUrl.search(/localhost/) !== -1) ? 
    client_public_local : client_public_main;
  var redirectUrl = "https://github.com/login/oauth/authorize?client_id=" +
    client_public + "&scope=repo&redirect_uri=" + 
    currentUrl + "/auth/github";
  console.log(redirectUrl);
  window.location = redirectUrl;
}