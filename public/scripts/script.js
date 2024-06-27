// Loading Screen
function loading() {
  document.body.insertAdjacentHTML
  ('beforeend', '<div id="loader-container" class="loader-container"><div class="loader"></div></div>');
}
// Loaded Screen
function loaded() {
  console.log("im here")
  document.getElementById('loader-container').remove()
}



// signup function
async function signup() {
  event.preventDefault();
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('cPassword');
  const eWarning = document.getElementById('eWarning');
  const pWarning = document.getElementById('pWarning');
  const eSpan = document.getElementById('eSpan');
  const pSpan = document.getElementById('pSpan');

  // Reset
  eWarning.style.display, pWarning.style.display = 'none';
  eSpan.style, pSpan.style = 'margin-bottom: 25px;';

  if (password.value === confirmPassword.value) {
    pWarning.style.display = 'none';
    pSpan.style = 'margin-bottom: 25px;';

    if (document.URL.includes("signupStudent.html")) {
      temp = 'student'
    }
    if (document.URL.includes("signupParent.html")) {
      temp = 'parent'
    }

    const formData = {
      "username": document.getElementById('fname').value + " "+ document.getElementById('lname').value,
      "email": document.getElementById('email').value,
      "password": document.getElementById('password').value,
      "userType": temp,
    };

    let settings = {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      beforeSend: loading()
    }

    console.log(formData)
    const response = await fetch("http://localhost:3000/CreateUsers", settings);
    
    if (response.status === 409){
      eWarning.style.display = 'block';
      eSpan.style = 'margin-bottom: 0px;';
      loaded()
    } else if (response.status === 500) {
      console.error(response.json.message)
      loaded()
    } else if (response.ok) {
      window.location.href = "main.html";
    }
  } else {
    pWarning.style.display = 'block';
    pSpan.style = 'margin-bottom: 0px;';
  }
}

// login function
async function login() {
  event.preventDefault();
  const lWarning = document.getElementById('lWarning');
  const pSpan = document.getElementById('pSpan');
  
  const formData = {
    "email": document.getElementById('email').value,
    "password": document.getElementById('password').value
  };

  let settings = {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    credentials: 'include',
    beforeSend: loading(),
  }

  if (window.location.port == 3000) {
    loaded()
    window.location.href = "main.html";
    return
  }

  console.log(formData)
  const response = await fetch("http://localhost:3000/login", settings);

  if (response.ok) {
    loaded()
    window.location.href = "main.html";
  } else {
    lWarning.style.display = 'block';
    pSpan.style = 'margin-bottom: 0px;';
    loaded()
  }
}

// logout function
async function logout() {
  let settings = {
    method: "DELETE", 
    credentials: 'include',
  }
  
  if (window.location.port == 3000) {
    window.location.href = "login.html";
    return
  }

  await fetch("http://localhost:3000/logout", settings);
  window.location.replace(`/public/login.html`)
}

// Authentification check
if (!window.location.href.includes("login.html") && !window.location.href.includes("signup") && window.location.port != 3000) {
  fetch('http://localhost:3000/currentUser', {credentials: `include`})
      .then(response => {
        if (response.ok) {
          document.body.style.display = 'block';
          return response.json();
        }
        throw new Error('Not authenticated');
      })
      .then(user => {
        // Display the user information
        const userInfoDiv = document.getElementById('main-title');
        userInfoDiv.innerHTML += user.username;
      })
      .catch(error => {
        console.error('Error:', error);
        window.location.href = '/public/login.html'; // Redirect to login
      });
} else {
  document.body.style.display = 'block';
}
