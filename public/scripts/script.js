// Form checker
if (document.querySelector('form')) {
  const form = document.querySelector('form');
  const submitButton = document.querySelector('#submit');
  form.addEventListener('input', () => {
    if (form.checkValidity()) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  });
}
console.log(window.location.pathname)
// Loading Screen
function loading() {
  document.body.insertAdjacentHTML
  ('beforeend', '<div id="loader-container" class="loader-container"><div class="loader"></div></div>');
}
// Loaded Screen
function loaded() {
  document.getElementById('loader-container').remove()
}

// Signup page check
if (window.location.href.includes("signup.html")) {
  const subtitle = document.getElementById("signupSubtitle")
  const str = window.location.href.match(/#(.*)$/)[1];
  if (str == "Parent" || str == "Student") {
    subtitle.innerText = str + " Signup";
  } else {
    console.log(str)
    window.location.href = "index.html";
  }
}

// signup function
async function signup() {
  event.preventDefault();
  const eWarning = document.getElementById('eWarning');
  const pWarning = document.getElementById('pWarning');
  const eSpan = document.getElementById('eSpan');
  const pSpan = document.getElementById('pSpan');

  // Reset
  eWarning.style.display = 'none', pWarning.style.display = 'none';
  eSpan.style = 'margin-bottom: 25px;', pSpan.style = 'margin-bottom: 25px;';

  const formData = {
    "username": document.getElementById('fname').value + " "+ document.getElementById('lname').value,
    "email": document.getElementById('email').value,
    "password": document.getElementById('password').value,
    "confirmPassword": document.getElementById('cPassword').value,
    "userType": window.location.href.match(/#(.*)$/)[1].toLowerCase(),
  };

  let settings = {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    beforeSend: loading()
  }

  const response = await fetch("http://localhost:3000/register", settings);
  
  if (response.status === 400) {
    console.log("hihi")
    pWarning.style.display = 'block';
    pSpan.style = 'margin-bottom: 0px;';
    loaded()
  } else if (response.status === 409){
    console.log("byebye")
    eWarning.style.display = 'block';
    eSpan.style = 'margin-bottom: 0px;';
    loaded()
  } else if (response.status === 500) {
    console.error(response.json.message)
    loaded()
  } else if (response.ok) {
    window.location.href = "main.html";
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
    beforeSend: loading(),
  }

  const response = await fetch("http://localhost:3000/login", settings);

  if (response.ok) {
    let data = await response.json()
    localStorage.setItem('token', data.token);
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
  localStorage.setItem('token', null);
  window.location.replace(`/public/login.html`)
}

// Authentification check
fetch('http://localhost:3000/test', {headers: {"Authorization": "Bearer " + localStorage.getItem('token')}})
    .then(async response => {
      if (response.ok) {
        const data = await response.json()
        if (window.location.href.includes("login.html") || window.location.href.includes("signup") || window.location.href.includes("index")) {
          window.location.href = "main.html"
        } else {
          document.body.style.display = 'block';
          const userInfoDiv = document.getElementById('main-title');
          userInfoDiv.innerHTML += data.user.id.slice(0, 4);
        }
        return data;
      }

      throw new Error('Not authenticated');
    })
    .catch(error => {
      console.error('Error:', error);
      if (!window.location.href.includes("login.html") && !window.location.href.includes("signup") && !window.location.href.includes("index")) {
        window.location.href = '/public/login.html'; // Redirect to login
      } else {
        document.body.style.display = 'block';
      }
    });