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
  window.location.replace(`login.html`)
}

// Authentification check
fetch('http://localhost:3000/test', {headers: {"Authorization": "Bearer " + localStorage.getItem('token')}})
    .then(async response => {
      if (response.ok) {
        const data = await response.json()
        console.log(data.user)
        localStorage.setItem('user', JSON.stringify(data.user));
        // console.log(JSON.parse(localStorage.getItem('user')).id)
        if (window.location.href.includes("login.html") || window.location.href.includes("signup") || window.location.href.includes("index")) {
          window.location.href = "main.html"
        } else {
          document.body.style.display = 'block';
        }
        return data;
      }

      throw new Error('Not authenticated');
    })
    .catch(error => {
      console.error('Error:', error);
      localStorage.setItem('info', null);
      if (!window.location.href.includes("login.html") && !window.location.href.includes("signup") && !window.location.href.includes("index")) {
        window.location.href = '/public/login.html'; // Redirect to login
      } else {
        document.body.style.display = 'block';
      }
    });

// main page
if (window.location.href.includes("main.html")) {
  const userInfoDiv = document.getElementById('main-title');
  userInfoDiv.innerHTML += data.user.id.slice(0, 4);
}

// ADMIN MAIN PAGE
// =================================
document.addEventListener('DOMContentLoaded', () => {
  fetchClasses();

  const form = document.getElementById('createClassForm');
  form.addEventListener('submit', function(event) {
      event.preventDefault();
      createClass();
  });
});

async function fetchClasses() {
  try {
      console.log('Fetching classes...');
      const response = await fetch('http://localhost:3000/classes');
      console.log('Response status:', response.status);
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      const classList = document.getElementById('class-list');
      if (!classList) {
          console.error('class-list element not found in the DOM');
          return;
      }
      classList.innerHTML = ''; // Clear existing content

      if (data.length === 0) {
          console.log('No classes found');
          classList.innerHTML = '<p>No classes available.</p>';
          return;
      }

      data.forEach((classItem) => {
          const classElement = document.createElement('div');
          classElement.className = 'col';
          classElement.innerHTML = `
              <div class="card h-100">
                  <div class="card-body">
                      <h5 class="card-title"><a href="class.html?class_id=${classItem.classID}">${classItem.className}</a> (${classItem.classID})</h5>
                      <p class="card-text">${classItem.classDes}</p>
                  </div>
              </div>
          `;
          classList.appendChild(classElement);
      });
      console.log('Classes rendered successfully');
  } catch (error) {
      console.error('Error fetching classes:', error);
      const classList = document.getElementById('class-list');
      if (classList) {
          classList.innerHTML = '<p>Error loading classes. Please try again later.</p>';
      }
  }
}

async function createClass() {
  const className = document.getElementById('className').value;
  const classDes = document.getElementById('classDes').value;

  const newClass = {
      className: className,
      classDes: classDes
  };

  try {
      const response = await fetch('http://localhost:3000/classes', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(newClass),
      });

      if (!response.ok) {
          const errorMessage = await response.text(); // Use text() to get non-JSON response
          throw new Error('Network response was not ok: ' + errorMessage);
      }

      const data = await response.json();
      console.log('Success:', data);
      alert('Class created successfully!');
      document.getElementById('createClassForm').reset();
      document.querySelector('#createClassModal .btn-close').click(); // Close the modal
      fetchClasses(); // Refresh the class list
  } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the class.');
  }
}
