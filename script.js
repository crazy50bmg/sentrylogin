// Copyright Sentry Login https://www.sentrylogin.com
// diagnostic debugging area

goMobile = false;
showSignUp = "YES"
mainLandingPageURL = "#"
msgOkBtnAction = "default";
Sentry_loginTkn = ""; // global
isUntouchedEmail = true; // global
isUntouchedPass = true; // global
hidePW = true; // global
alignment = "RIGHT"; // global
manner = "POP"; // global
url = ""; // global
Sentry_ip = ""; // global
isIE8 = false; // global
isOpen = false; // global

isPro = false;
if (typeof isProtected === 'undefined') {
  // isProtected is undefined
} else {
  isPro = isProtected;
}
if (isPro == false) {
  var ms = querySt("ms");
  if (ms) {
    if (ms != "") {
      isPro = true;
    }
  }
}

function break_iframe(url) {
  if (window.location != window.parent.location) {
    if (url) {
      top.location = url;
    } else {
      top.location = self.location.href;
    }
  }
}

function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
  // returns true if mobile, false otherwise
}

function initializeSentry() {
  //initialize Sentry Login aspects
  goMobile = isMobileDevice();

  // for testing, emulate mobile
  var mob = querySt("mob");
  if (mob == "1") {
    goMobile = true;
  }

  // store user selected colors globally in order to put them back after changeouts
  if (document.getElementById("Sentry_email")) {
    userSentry_emailTxtColor = document.getElementById("Sentry_email").style.color;
  } else {
    userSentry_emailTxtColor = "LightGray";
  }
  if (document.getElementById("Sentry_password")) {
    userSentry_passwordTxtColor = document.getElementById("Sentry_password").style.color;
  } else {
    userSentry_passwordTxtColor = "LightGray";
  }

  if (document.getElementById("Settings").getAttribute('showSignUp')) {
    showSignUp = document.getElementById("Settings").getAttribute('showSignUp');
    if (showSignUp == "YES") {
      // leave alone		
    } else {
      //set global variable showSignUp to NO
      showSignUp = "NO"; // in order to tell onClick not to go anywhere
      // change things
      if (document.getElementById("signUpLnk")) {
        document.getElementById("signUpLnk").innerHTML = " "; // replace with space
        document.getElementById("signUpLnk").style.cursor = "default"; // don't show hand pointer
      }
    }
  }

  // get ip address
  var ipUrl = "https://www.sentrylogin.com/sentry/ip.asp?ippw=2112hsur" + "&ms=" + new Date().getTime();
  invIP = createCrossDomainRequest();

  if (invIP) {
    if (isIE8) {
      invIP.onload = doIP;
      invIP.open("GET", ipUrl, false);
      invIP.send();

      // set some ie8 stuff
    } else {
      invIP.open("GET", ipUrl, false);
      invIP.send();
      Sentry_ip = invIP.responseText;
    }
  } else {
    alert("No ip Invocation Took Place");
  }

  var fp = querySt("fromProt");
  var bnc = querySt("bnc");
  var lng = querySt("lng");
  // store lng in cookie for global access (unless it's empty)
  if (lng != "") {
    duration = 30; // 
    createCookie("Sentry_lng", lng, duration);
  }
  if (bnc) {
    if (bnc == "1" && fp != "1") {
      // this is a bounce from bounce.asp
      var msg = "";
      var rsn = querySt("rsn");
      if (rsn) {
        if (rsn == "noOb" || rsn == "mtCk") {
          if (lng != "span") {
            msg = "";
          } else {
            msg = "";
          }
          //msgOkBtnAction = "showLogin";
          // pop up in non-logged-in state
          SentryPopUp();
        } else if (rsn == "ppal") {
          if (lng != "span") {
            msg = "You're not a member of that subscription.";
          } else {
            msg = "Usted no es un miembro de esa suscripci" + "&oacute;" + "n.";
          }
        } else if (rsn == "lvlo") {
          if (lng != "span") {
            msg = "Your member access level isn't high enough to view that page.";
          } else {
            msg = "Tu cuenta no tiene acceso para ver esta p" + "&acute;" + "gina.";
          }
        } else if (rsn == "sgOt") {
          if (lng != "span") {
            msg = "That page is reserved for another member only.";
          } else {
            msg = "Esa p" + "&acute;" + "gina est" + "&acute;" + " reservada a otro miembro.";
          }
        } else if (rsn == "regFail" || rsn == "regSpoof") {
          if (lng != "span") {
            msg = "Login expired. Please log in again.";
          } else {
            msg = "Sesi" + "&oacute;" + "n expir" + "&oacute;" + ". Vuelve a Ingresar.";
          }
          msgOkBtnAction = "showLogin";
        }
        if (msg != "") {
          // load msg into msgSpan
          document.getElementById("msgSpan").innerHTML = msg;
          // open the box
          SentryPopUp(2); // two means pop up in Messaging state
        }
      }
    }
  }
  // are they already logged in?
  isLoggedIn = false; // local
  Sentry_loginTkn = getCookie('Sentry_loginTkn');

  // TEMPORARY TEST!!  
  //Sentry_loginTkn = "test";
  // END Temporary test

  if (Sentry_loginTkn) {
    if (Sentry_loginTkn != "") {
      isLoggedIn = true;
    } else {
      // Sentry_loginTkn was empty string
      isLoggedIn = false;
    }
  } else {
    // Sentry_loginTkn not found
    isLoggedIn = false;
  }
  if (isLoggedIn == true) {
    Sentry_firstName = getCookie('Sentry_firstName');

    // TEMPORARY TEST!!  
    //Sentry_firstName = "Peter";
    // END Temporary test

    document.getElementById("helloName").innerHTML = Sentry_firstName;
    document.getElementById("welcomeBarName").innerHTML = Sentry_firstName;
    document.getElementById("SentryTrigger").style.display = "none";
    document.getElementById("SentryHello").style.display = "inline";
    if (document.getElementById("HelloLogout")) { // Jimdo support
      document.getElementById("HelloLogout").style.display = "inline";
    }
  } else {
    // not logged in, display differently
    document.getElementById("SentryTrigger").style.display = "inline";
    document.getElementById("SentryHello").style.display = "none";
    if (document.getElementById("HelloLogout")) { // Jimdo support
      document.getElementById("HelloLogout").style.display = "none";
    }
  }

  var a = document.getElementById("Settings");
  manner = a.getAttribute('MANNER');
  if (manner == "NORMAL") {
    // leave at default
  } else if (manner == "OPEN") {
    // Box should appear already popped up in the appropriate state
    if (isLoggedIn == true) {
      // pop up in welcome state
      SentryPopUp(1);
    } else {
      // pop up in non-logged-in state
      SentryPopUp();
    }
  }
} // end function initializeSentry

function msgOkBtn() {
  // user has clicked / hit enter on the OK button in the error message box
  // toggle visibility of some elements
  document.getElementById("messages").style.display = "none";
  // if user is logged in, show welcome

  // TEMPORARY TEST!!  
  //Sentry_loginTkn = "test";
  // END Temporary test

  // msgOkBtnAction contains global instructions
  if (msgOkBtnAction == "default") {
    if (Sentry_loginTkn) {
      if (Sentry_loginTkn != "") {
        // user is logged in
        //Sentry_showWelcome();
        SentryPopUp(1); // one means pop up in Welcome state
      } else {
        SentryPopDown();
      }
    } else {
      SentryPopDown();
    }
  } else if (msgOkBtnAction == "showLogin") {
    // let them log in
    msgOkBtnAction = "default"; // clear the action for next time
    SentryPopUp(); // no arg means pop up in un-logged-in state
  }
}

function doIP() {
  Sentry_ip = invIP.responseText;
}

function querySt(lookFor) {
  var wholeQS = window.location.search.substring(1);
  var nvPairs = wholeQS.split("&");
  var r;
  for (i = 0; i < nvPairs.length; i++) {
    r = nvPairs[i].split("=");
    if (r[0] == lookFor) {
      return r[1];
    }
  }
  // call thusly: var koko = querySt("koko");
}

function createCookie(cname, cvalue, exdays) {
  // Version 2, changed: 4/14/2014
  // call thusly: createCookie('username','testcookie',7);
  // 0.021 of a day is about 30 minutes
  cvalue = escape(cvalue);
  var d = new Date();
  var expires;
  if (exdays) {
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    expires = "expires=" + d.toGMTString();
    // was: document.cookie = cname + "=" + cvalue + "; " + expires;
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
  } else {
    // default to 3 hours
    exdays = 0.126;
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    expires = "expires=" + d.toGMTString();
    // was: document.cookie = cname + "=" + cvalue + "; " + expires;
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
  }
}

function eraseCookie(name) {
  // call thusly: eraseCookie('username');
  createCookie(name, "", -1);
}

function getCookie(cookie_name) {
  // call thusly: x = getCookie('username');
  var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
  if (results) {
    return (unescape(results[2]));
  } else {
    return null;
  }
}

function LogOut(goto) {
  eraseCookie('Sentry_loginTkn');
  eraseCookie('Sentry_memberPpl_ID');
  eraseCookie('Sentry_member_ID');
  eraseCookie('Sentry_memberAccessLvl');
  eraseCookie('Sentry_firstName');
  eraseCookie('Sentry_lastName');
  eraseCookie('Sentry_psist');
  eraseCookie('Sentry_sendEmTo');

  eraseCookie('Sentry%5FloginTkn'); // for ASP and PHP interconnectivity
  eraseCookie('Sentry_lng');

  if (goto) {
    if (goto != "") {
      // go to url
      top.location = goto;
      location.reload();
    } else {
      // goto is required for Wix
    }
  } else {
    // goto is required for Wix
  }
}

function wipeOrNot(theID) {
  if (theID == "Sentry_email" && isUntouchedEmail == true) {
    document.getElementById(theID).value = ""; //wipe it	
  }
  if (theID == "Sentry_password" && isUntouchedPass == true) {
    document.getElementById(theID).value = ""; //wipe it	
  }
}

function removeSpaces(string, theID) {
  var str = "";
  // do not act upon a message string
  if (string != "E-mail is required" && string != "Password is required") {
    str = string.split(' ').join('');
  }
  return str;
}

function Sentry_onfocus(theID) {
  wipeOrNot(theID);
  if (theID == "Sentry_password") {
    if (hidePW == true) {
      PWHide();
    }
  }
}

function Sentry_onkeydown(theEvent, theID) {
  // only using onkeydown to handle IE because it beeps when you hit Enter key

  // listen for Enter Key
  if (!(theEvent.which)) { // filter out Chrome, etc.
    var keynum
    if (window.event) { // IE
      keynum = theEvent.keyCode;
      if (keynum == "13") { // 13 is Enter Key
        // only submit the form if theID is Sentry_email, Sentry_password or Sentry_button
        if (theID == "Sentry_email" || theID == "Sentry_password" || theID == "Sentry_button") {
          // first, blur the calling field by focusing elsewhere
          document.getElementById("Sentry_button").focus();
          sentryLogin(); // submit the form
        } else if (theID == "Stay") {
          // person just hit the enter key to select the psist radio btn
          document.getElementById("psist").check = true;
        } else if (theID == "msgOkBtn") {
          msgOkBtn();
        }
      }
    }
  }
}

function Sentry_onkeyup(theValue, theID, theEvent) {
  // listen for Enter Key
  var keynum
  if (theEvent.which) { // Netscape/Firefox/Opera
    keynum = theEvent.which;
  }
  if (keynum == "13") { // 13 is Enter Key
    // only submit the form if theID is Sentry_email, Sentry_password or Sentry_button
    if (theID == "Sentry_email" || theID == "Sentry_password" || theID == "Sentry_button") {
      // first, blur the calling field by focusing elsewhere
      document.getElementById("Sentry_button").focus();
      sentryLogin(); // submit the form
    } else if (theID == "Stay") {
      // person just hit the enter key to select the psist radio btn
      document.getElementById("psist").checked = true;
    } else if (theID == "msgOkBtn") {
      msgOkBtn();
    }
  } else { // it's some other key
    if (theID == "Sentry_email") {
      isUntouchedEmail = false;
    }
    if (theID == "Sentry_password") {
      if (document.getElementById("Sentry_password").value != "") {
        isUntouchedPass = false;
      } else {
        isUntouchedPass = true;
      }
    }
  }
}

function Sentry_onblur(theValue, theID) {
  if (theID == "Sentry_email" || theID == "Sentry_password") {
    var str = removeSpaces(theValue, theID);
    document.getElementById(theID).value = str;
    if (str == "") {
      if (theID == "Sentry_email") {
        isUntouchedEmail = true;
        document.getElementById("Sentry_email").style.color = userSentry_emailTxtColor; // stored globally
        document.getElementById("Sentry_email").value = "E-mail Address";
      }
      if (theID == "Sentry_password") {
        isUntouchedPass = true;
        //clear the pw fields
        document.getElementById("Sentry_password").value = "";
        document.getElementById("Sentry_password").style.color = userSentry_passwordTxtColor; // stored globally
        document.getElementById("Sentry_password").value = "Password";
        PWShow();
      }
    }
  } else if (theID == "Sentry_button") {
    // set the email and password input txt color back to user selected color in case we made them red
    document.getElementById("Sentry_email").style.color = userSentry_emailTxtColor; // stored globally
    document.getElementById("Sentry_password").style.color = userSentry_passwordTxtColor; // stored globally
  }
}

function Sentry_onClick(theID) {
  switch (theID) {
    case "unHideSpan":
      // toggle the checked state of unHide checkbox
      if (document.getElementById("unHide").checked == true) {
        document.getElementById("unHide").checked = false;
        // toggle the lock image and unlock image
        document.getElementById("iconShowPassword").style.display = "none";
        document.getElementById("iconPassword").style.display = "block";
        //change the wording shown
        document.getElementById("unHideSpan").innerHTML = "Show";
        // hide the password 
        hidePW = true; // so onfocus shows the bullets not words
        if (isUntouchedPass == false) {
          PWHide();
        }
      } else {
        document.getElementById("unHide").checked = true;
        // toggle the lock image and unlock image
        document.getElementById("iconShowPassword").style.display = "block";
        document.getElementById("iconPassword").style.display = "none";
        //change the wording shown
        document.getElementById("unHideSpan").innerHTML = "Hide";
        // reveal the password
        hidePW = false; // so onfocus shows the words not bullets
        PWShow();
      }
      break;
    case "psistSpan":
      // toggle the checked state of psist checkbox
      if (document.getElementById("psist").checked == true) {
        document.getElementById("psist").checked = false;
        document.getElementById("psist").focus();
      } else {
        document.getElementById("psist").checked = true;
        document.getElementById("psist").focus();
      }
      break;
    case "psist":
      document.getElementById("psist").focus();
      break;
    case "myProfile":
      var Sentry_ID = document.getElementById("Sentry_ID").value;
      var univ = document.getElementById("univ").value;
      var url = "https://www.sentrylogin.com/sentry/member_myAccount.asp?Site_ID=" + Sentry_ID + "&univ=" + univ; // univ will only be 1 in PayPal accounts			
      // if token is set, send it also
      Sentry_loginTkn = getCookie('Sentry_loginTkn');
      if (Sentry_loginTkn) {
        if (Sentry_loginTkn != "") {
          // get Sentry_member_ID too
          Sentry_member_ID = getCookie('Sentry_member_ID');
          Ppl_ID = getCookie('Sentry_memberPpl_ID');
          if (Ppl_ID == 0) {
            Ppl_ID = "";
          }
          url = url + "&ajax=1&m=" + Sentry_member_ID + "&Ppl_ID=" + Ppl_ID + "&tk=" + Sentry_loginTkn;
        }
      }
      //alert("The profile is located at: " + url);
      top.location = url;
      break;
    case "xout":
      // xout was clicked
      // close the whole login box by calling SentryPopDown() which will toggle it away
      
      
            var frame = window.frameElement;  // Get the <iframe> element of the window
window.alert("Here we go...");
if (frame) {   // If the window is in an <iframe>, change its source
    window.alert(frame.name);
} else {
  window.alert("Nope");
  
}
      
      
      
      
      //SentryPopDown();
      break;
    case "forgotSpan":
      // Forgot was clicked
      // using a custom tag attribute so the webmaster has more customizability
      lnk = document.getElementById("forgotSpan").getAttribute('lnk');
      top.location = lnk;
      break;
    case "Sentry_button":
      // submit the form
      sentryLogin();
      break;
    case "msgOkBtn":
      // user has clicked the OK button in the error msg box
      // call function so we aren't repeating code
      msgOkBtn();
      break;
    case "EnterMember":
      // user has clicked the Enter Member Area link
      // hide the login box
      SentryPopDown();
      // go to the URL in mainLandingPageURL, even if it just contains the default #
      top.location = mainLandingPageURL;
      break;
    case "signUpLnk":
      // user has clicked the sign up link
      // hide the login box and go to the signup URL unless global showSignUp is set to NO 
      if (showSignUp == "YES") {
        SentryPopDown();
        Sentry_ID = document.getElementById("Sentry_ID").value;
        top.location = "https://www.sentrylogin.com/sentry/member_signup_list.asp?Site_ID=" + Sentry_ID;
      }
      break;
    default:
      // nothing here
  } // close switch
}

function Sentry_onmouseover(theID) {

}

function Sentry_onmouseout(theID) {

}

function createCrossDomainRequest(url) {
  var request;
  isIE8 = window.XDomainRequest ? true : false;
  if (isIE8) {
    request = new window.XDomainRequest();
  } else {
    if (window.XMLHttpRequest) {
      request = new XMLHttpRequest();
    } else {
      // code for IE6, IE5
      request = new ActiveXObject("Microsoft.XMLHTTP");
    }
  }
  return request;
}

function callOtherDomain() {
  if (invocationLB) {
    if (isIE8) {
      invocationLB.onload = outputResult;
      invocationLB.open("GET", url, true);
      invocationLB.send();
    } else {
      invocationLB.open('GET', url, true);
      invocationLB.onreadystatechange = handler;
      invocationLB.send();
    }
  } else {
    alert("No Invocation Took Place");
  }
}

function handler(evtXHR) {
  if (invocationLB.readyState == 4) {
    if (invocationLB.status == 200) {
      outputResult();
    } else {
      alert("Invocation Errors Occured. Status is: " + invocationLB.status + "and URL contains: " + url);
    }
  }
}

function outputResult() {
  var response = invocationLB.responseText;
  rspArrayLB = response.split('~');
  if (rspArrayLB[0]) {
    if (rspArrayLB[0] == "newLogin") {
      //login succeeded
      Sentry_loginTkn = rspArrayLB[1];
      Sentry_sendEmTo = rspArrayLB[2]; // could be space
      Sentry_memberPpl_ID = rspArrayLB[3]; // could be 0
      Sentry_member_ID = rspArrayLB[4];
      Sentry_memberAccessLvl = rspArrayLB[5]; // could be 0
      Sentry_firstName = rspArrayLB[6];
      Sentry_lastName = rspArrayLB[7];
      Sentry_psist = rspArrayLB[8]; // could be 0

      var duration;
      if (Sentry_psist == "1") {
        duration = 30; // 30 days
      } else {
        //  0.021 = 30 minutes
        duration = 0.126; // about 3 hours
      }

      createCookie("Sentry_loginTkn", Sentry_loginTkn, duration);
      createCookie("Sentry_memberPpl_ID", Sentry_memberPpl_ID, duration);
      createCookie("Sentry_member_ID", Sentry_member_ID, duration);
      createCookie("Sentry_memberAccessLvl", Sentry_memberAccessLvl, duration);
      createCookie("Sentry_firstName", Sentry_firstName, duration);
      createCookie("Sentry_lastName", Sentry_lastName, duration);
      createCookie("Sentry_psist", Sentry_psist, duration);

      // hide Wobbler
      document.getElementById("wobbler").style.display = "none";

      // if Sentry_sendEmTo isn't space, redirect to landing page
      if (Sentry_sendEmTo != " ") {
        createCookie("Sentry_sendEmTo", Sentry_sendEmTo, duration);
        var e = Sentry_sendEmTo.indexOf("?");
        if (e == -1) {
          theLoc = Sentry_sendEmTo + "/&ms=" + new Date().getTime();
          break_iframe(theLoc);
        } else {
          theLoc = Sentry_sendEmTo + "?ms=" + new Date().getTime();
          break_iframe(theLoc);
        }
      } else {
        //not being redirected
        // call Sentry_showWelcome() function
        SentryPopUp(1); // welcome state
      }
    } else if (rspArrayLB[0] == "FAIL") {
      // rspArrayLB[0] contained FAIL

      // hide Wobbler
      document.getElementById("wobbler").style.display = "none";

      // get values						
      var Members_ID = rspArrayLB[1]; // could be space
      var Site_ID = rspArrayLB[2]; // never empty
      var Reason = rspArrayLB[3]; // never empty
      var deactReason = rspArrayLB[4]; // could be space
      var lng = rspArrayLB[5]; // could be space

      var msg = "";
      if (Reason == "pastLoginLimit") {
        if (lng != "span") {
          msg = "You've reached your login limit.";
        } else {
          msg = "Has alcanzado el l" + "&iacute;" + "mite de inicio de sesi" + "&oacute;" + "n.";
        }
      } else if (Reason == "MbrExpired") {
        if (lng != "span") {
          msg = "Your account is expired.";
        } else {
          msg = "Su cuenta ha caducado.";
        }
      } else if (Reason == "MbrInact") {
        if (lng != "span") {
          msg = "Your account is not active.";
        } else {
          msg = "Su cuenta no est" + "&aacute;" + "activa.";
        }
      } else if (Reason == "PWnoMatch" || Reason == "noMbr") {
        if (lng != "span") {
          msg = "Username or Password was incorrect.";
          msgOkBtnAction = "showLogin";
        } else {
          msg = "Usuario o Contrase" + "&ntilde;" + "a es incorrecto.";
        }
      } else if (Reason == "SitePastLoginLimit") {
        if (lng != "span") {
          msg = "Our Sentry account has reached its login limit.";
        } else {
          msg = "Nuestra cuenta Sentry ha alcanzado su l" + "&iacute;" + "mite de inicio de sesi" + "&oacute;" + "n.";
        }
      } else if (Reason == "SiteExpired") {
        if (lng != "span") {
          msg = "Our Sentry account has expired.";
        } else {
          msg = "Nuestra cuenta Sentry ha expirado.";
        }
      } else if (Reason == "StInact") {
        if (lng != "span") {
          msg = "Our Sentry account is not active.";
        } else {
          msg = "Nuestra cuenta Sentry no est" + "&aacute;" + "activo.";
        }
      } else if (Reason == "noSite") {
        if (lng != "span") {
          msg = "Our Sentry account not found.";
        } else {
          msg = "Nuestra cuenta Sentry no encontrado.";
        }
      }
      // load msg into msgSpan
      document.getElementById("msgSpan").innerHTML = msg;
      // open the box
      SentryPopUp(2); // two means pop up in Messaging state
    } else {
      // rspArrayLB[0] contained an unauthorized value

      // hide Wobbler
      document.getElementById("wobbler").style.display = "none";

      // create msg 
      msg = "An error occurred. Error code: unauthResponse rspArrayLB[0] contained: " + rspArrayLB[0];
      // load msg into msgSpan
      document.getElementById("msgSpan").innerHTML = msg;
      // open the box
      SentryPopUp(2); // two means pop up in Messaging state
    }
  } // if(rspArrayLB[0])
  else {
    // rspArrayLB[0] did not exist, could be server error

    // hide Wobbler
    document.getElementById("wobbler").style.display = "none";

    // create msg
    msg = "An error occurred. Error code: noArray";
    // load msg into msgSpan
    document.getElementById("msgSpan").innerHTML = msg;
    // open the box
    SentryPopUp(2); // two means pop up in Messaging state
  } //  end if(rspArrayLB[0])
} // end function outputResult	

function sentryLogin() {
  // clear msgs if any
  document.getElementById("msgSpan").innerHTML = ".";

  var doSend = true;
  var Sentry_email = document.getElementById("Sentry_email").value;
  var Sentry_password = document.getElementById("Sentry_password").value;
  var psist;
  if (document.getElementById("psist").checked == true) {
    psist = "1";
  } else {
    psist = "0";
  }
  var Sentry_ID = document.getElementById("Sentry_ID").value;
  var s = Sentry_email.indexOf("@");
  if (s == -1) {
    if (Sentry_email.length == 0 || isUntouchedEmail == true) {
      document.getElementById("Sentry_email").value = "E-mail is required";
      document.getElementById("Sentry_email").style.color = "Red";
      //other validation here
      doSend = false;
    }
  }
  if (Sentry_password.length == 0 || isUntouchedPass == true) {
    document.getElementById("Sentry_password").value = "Password is required";
    document.getElementById("Sentry_password").style.color = "Red";
    doSend = false;
  }
  if (doSend == true) {
    // hide other elements and show Wobbler
    document.getElementById("SentryFormGroup").style.display = "none";
    document.getElementById("messages").style.display = "none";
    document.getElementById("EnterMember").style.display = "none";
    document.getElementById("SentryHelloGroup").style.display = "block";
    document.getElementById("wobbler").style.display = "block";

    pwStr = Sentry_password;

    //alert("Temporary pause...");

    invocationLB = createCrossDomainRequest();
    url = "https://www.sentrylogin.com/sentry/NoSockets/loginActionAJAX.asp?Sentry_ID=" + Sentry_ID + "&e=" + Sentry_email + "&p=" + pwStr + "&psist=" + psist + "&ip=" + Sentry_ip + "&ms=" + new Date().getTime();
    callOtherDomain();
  } // end if(doSend == true)
} //  end function sentryLogin()

function PWShow() {
  document.getElementById("Sentry_password").setAttribute('type', 'text');
}

function PWHide() {
  document.getElementById("Sentry_password").setAttribute('type', 'password');
}

function SentryPopUp(state) {
  if (document.getElementById("SentryOutermost").className == "before") {
    document.getElementById("SentryOutermost").className = "after";
    // make overlay visible
    document.getElementById("SentryOverlay").style.display = "block";

    // fix for Squarespace z-index issue:
    // we hide the nav while our box is up, and show it again on pop down
    if (document.getElementById("header")) {
      // store the header display setting as it is now
      //origHeaderDisplay = document.getElementById("header").style.display;
      //document.getElementById("header").style.display = "none";
      //alert('topNav hidden');
    }
  }
  // OLD get the width
  //var boxWidth = document.getElementById("SentryOutermost").clientWidth;
  //var boxHeight = document.getElementById("SentryOutermost").clientHeight;
  // do the positioning math
  //myLeft = (Math.round(window.innerWidth / 2) - Math.round(boxWidth / 2));
  //myTop = (Math.round(window.innerHeight / 2) - Math.round(boxHeight / 2));
  // format as string
  //myLeft = myLeft + 'px';
  //myTop = myTop + 'px';
  // set top and left
  //document.getElementById("SentryOutermost").style.left = myLeft;
  //document.getElementById("SentryOutermost").style.top = myTop;

  // shrink sizes if mobile
  if (goMobile == true) {
    document.getElementById("SentryOutermost").style.width = "290px";
    document.getElementById("SentryFooterBar").style.width = "290px";
    document.getElementById("SentryLoginBox").style.width = "290px";
    document.getElementById("SentryHelloGroup").style.width = "290px";
    document.getElementById("EnterMember").style.width = "290px";
    document.getElementById("EnterMember").style.backgroundPosition = "10px 0px";
    if (document.getElementById("signUpLnk")) {
      document.getElementById("signUpLnk").style.width = "100px";
      if (showSignUp == "YES") {
        // check to be sure there is anything inside first
        aStr = document.getElementById("signUpLnk").innerHTML;
        if (aStr != "" && aStr != " ") {
          document.getElementById("signUpLnk").innerHTML = "Sign Up";
        }
      }
    }
    document.getElementById("txtLogOut").style.width = "100px";
    document.getElementById("txtLogOut").style.paddingRight = "5px";
    document.getElementById("txtLogOut").style.paddingLeft = "5px";
    document.getElementById("Title").style.width = "240px";
    document.getElementById("Welcome").style.width = "240px";

    document.getElementById("Sentry_email").style.fontSize = "24px";
    document.getElementById("Sentry_email").style.color = "Black";

    document.getElementById("Sentry_password").style.fontSize = "24px";
    document.getElementById("Sentry_password").style.color = "Black";

    document.getElementById("forgotSpan").style.marginLeft = "6px";

    document.getElementById("forgotSpan").style.width = "45px";

    document.getElementById("forgotSpan").style.fontSize = "13px";

    document.getElementById("unHideSpan").style.marginLeft = "47px";

    document.getElementById("unHideSpan").style.fontSize = "13px";

    document.getElementById("psistLabel").style.fontSize = "13px";
    document.getElementById("psistLabel").style.width = "90px";
    document.getElementById("psistLabel").style.padding = "0";
    document.getElementById("psistLabel").style.paddingLeft = "22px";
    document.getElementById("psistLabel").style.textIndent = "0";

    document.getElementById("Sentry_button").style.marginLeft = "5px";
    document.getElementById("msgOkBtn").style.marginLeft = "0px";
    document.getElementById("messages").style.paddingLeft = "5px";
    document.getElementById("messages").style.paddingRight = "5px";
    document.getElementById("msgSpan").style.display = "block";
    document.getElementById("msgSpan").style.marginLeft = "10px";
    document.getElementById("iconProfile").style.marginLeft = "2px";
    document.getElementById("myProfile").style.paddingRight = "22px";

    document.getElementById("myProfile").style.fontSize = "14px";

    if (document.getElementById("signUpLnk")) {
      document.getElementById("signUpLnk").style.fontSize = "14px";
    }
    document.getElementById("txtLogOut").style.fontSize = "14px";

    document.getElementById("xout").style.width = "60px";
  }

  // set default PRE-logged-in appearance
  document.getElementById("SentryFormGroup").style.display = "block";
  document.getElementById("SentryHelloGroup").style.display = "none";
  if (document.getElementById("signUpLnk")) {
    document.getElementById("signUpLnk").style.display = "block";
  }
  document.getElementById("txtLogOut").style.display = "none";
  document.getElementById("Title").style.display = "block";
  document.getElementById("Welcome").style.display = "none";
  if (state) { // now check state
    if (state == 1) {
      // show popup in the logged-in (welcome) state
      // hide the form group
      document.getElementById("SentryFormGroup").style.display = "none";
      // and show the hello group
      document.getElementById("SentryHelloGroup").style.display = "block";
      if (document.getElementById("signUpLnk")) {
        // hide the signUpLnk span
        document.getElementById("signUpLnk").style.display = "none";
      }
      // show the Log Out span
      document.getElementById("txtLogOut").style.display = "block";
      // hide the Title Bar
      document.getElementById("Title").style.display = "none";
      // show the Welcome title bar
      document.getElementById("Welcome").style.display = "block";
      document.getElementById("EnterMember").style.display = "block";
      document.getElementById("messages").style.display = "none";
      // assign the link, if any, to EnterMember ( mainLandingPageURL global variable )
      Sentry_sendEmTo = getCookie('Sentry_sendEmTo');

      // TEMPORARY TEST!!  
      //Sentry_sendEmTo = "http://www.disneyland.com/";
      // END Temporary test

      if (Sentry_sendEmTo) {
        if (Sentry_sendEmTo != "" && isPro != true) {
          var e = Sentry_sendEmTo.indexOf("?");
          if (e == -1) {
            var url = Sentry_sendEmTo + "/&ms=" + new Date().getTime();
          } else {
            var url = Sentry_sendEmTo + "?ms=" + new Date().getTime();
          }
          // assign here
          mainLandingPageURL = url;
        } else {
          mainLandingPageURL = Sentry_sendEmTo; // added 3/6/2015
        }
      }
    } else if (state == 2) {
      // show popup in the Messaging state
      // hide other elements and show Messages
      document.getElementById("SentryFormGroup").style.display = "none";
      document.getElementById("EnterMember").style.display = "none";
      document.getElementById("messages").style.display = "block";
      document.getElementById("SentryHelloGroup").style.display = "block";
      document.getElementById("wobbler").style.display = "none";
    }
  }
}

function SentryPopDown() {
  document.getElementById("SentryOutermost").className = "before";
  // make overlay invisible
  document.getElementById("SentryOverlay").style.display = "none";

  // fix for Squarespace z-index issue:
  // we hide the nav while our box is up, and show it again on pop down
  //if(document.getElementById("header")){
  //	document.getElementById("header").style.display = origHeaderDisplay;
  //}		
}
