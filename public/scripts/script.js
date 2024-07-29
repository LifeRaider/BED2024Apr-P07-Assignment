// // Form checker
// if (document.querySelector('form')) {
//   const form = document.querySelector('form');
//   const submitButton = document.querySelector('#submit');
//   form.addEventListener('input', () => {
//     if (form.checkValidity()) {
//       submitButton.disabled = false;
//     } else {
//       submitButton.disabled = true;
//     }
//   });
// }

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
    window.location.href = "login.html";
  } else {
    lWarning.style.display = 'block';
    pSpan.style = 'margin-bottom: 0px;';
    loaded()
  }
}

// logout function
async function logout() {
  localStorage.setItem('token', null);
  localStorage.setItem('data', null);
  window.location.replace(`login.html`)
}

// Authentification check
fetch('http://localhost:3000/test', {headers: {"Authorization": "Bearer " + localStorage.getItem('token')}})
    .then(async response => {
      if (response.ok) {
        const data = await response.json()
        const user = data.user
        localStorage.setItem('data', JSON.stringify(user));
        if (window.location.href.includes("login.html") || window.location.href.includes("signup") || window.location.href.includes("index")) {
          if (user.userType == "admin") {
            window.location.href = "mainAdmin.html";
          } else {
            window.location.href = "mainOthers.html";
          }
        } else {
          if (user.userType == "admin" && !(window.location.href.includes("Admin") || window.location.href.includes("admin"))) {
            window.location.href = "login.html";
          } else if (user.userType != "admin" && (window.location.href.includes("Admin") || window.location.href.includes("admin"))) {
            window.location.href = "login.html";
          }
          document.body.style.display = 'block';
        }
        return data;
      }
      throw new Error('Not authenticated');
    })
    .catch(error => {
      console.error('Error:', error);
      localStorage.setItem('data', null);
      if (!window.location.href.includes("login.html") && !window.location.href.includes("signup") && !window.location.href.includes("index")) {
        window.location.href = '/public/login.html'; // Redirect to login
      } else {
        document.body.style.display = 'block';
      }
    });

// MAIN PAGE
// =================================
// Marvin's Gignite
// ==============================================================================================================
// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  populateTeacherDropdown();
  handleSubjectSelection();
  handleTeacherSelection();

  document.getElementById('createClassBtn').addEventListener('click', createClass);
  document.getElementById('cancelBtn').addEventListener('click', hideModal);

  // Close modal when clicking outside
  document.getElementById('createClassModal').addEventListener('click', function(event) {
      if (event.target === this) {
          hideModal();
      }
  });
});

// Assuming you have a button to open the modal
document.getElementById('openModalBtn').addEventListener('click', showModal);

// Function to show the modal
function showModal() {
  document.getElementById('createClassModal').style.display = 'block';
}

// Function to hide the modal
function hideModal() {
  document.getElementById('createClassModal').style.display = 'none';
}

// Function to populate the teacher dropdown
async function populateTeacherDropdown() {
  try {
      const response = await fetch('http://localhost:3000/users');
      if (!response.ok) {
          throw new Error('Failed to fetch users');
      }
      const users = await response.json();

      const teachers = users.filter(user => {
          if (!user || typeof user !== 'object') {
              console.warn('Invalid user object:', user);
              return false;
          }
          const userId = user.userID || user.userId || user.id;
          if (!userId) {
              console.warn('User object missing ID:', user);
              return false;
          }
          return userId.toString().startsWith('T');
      });

      const teacherSelect = document.getElementById('assignedTeachers');
      if (!teacherSelect) {
          console.error('Teacher select element not found');
          return;
      }

      teacherSelect.innerHTML = '<option value="">Select a teacher</option>';
      teachers.forEach(teacher => {
          const option = document.createElement('option');
          option.value = teacher.userID || teacher.userId || teacher.id;
          option.textContent = `${teacher.username} (${option.value})`;
          teacherSelect.appendChild(option);
      });

      // Sort the options alphabetically
      sortSelectOptions(teacherSelect);
  } catch (error) {
      console.error('Error fetching teachers:', error);
  }
}
function sortSelectOptions(selectElement) {
  const options = Array.from(selectElement.options).slice(1); // Exclude the first "Select a teacher" option
  options.sort((a, b) => a.text.localeCompare(b.text));
  selectElement.innerHTML = '<option value="">Select a teacher</option>'; // Re-add the first option
  options.forEach(option => selectElement.add(option));
}

// Function to handle subject selection
function handleSubjectSelection() {
  const subjectSelect = document.getElementById('classSubject');
  const classNameInput = document.getElementById('className');

  subjectSelect.addEventListener('change', function() {
      const selectedSubject = this.value;
      if (selectedSubject) {
          const currentName = classNameInput.value.split(' - ')[0];
          classNameInput.value = `${currentName} - ${selectedSubject}`;
      } else {
          classNameInput.value = classNameInput.value.split(' - ')[0];
      }
  });
}

// Function to handle teacher selection
function handleTeacherSelection() {
  const teacherSelect = document.getElementById('assignedTeachers');
  const selectedTeachersDiv = document.getElementById('selectedTeachers');

  teacherSelect.addEventListener('change', function() {
      const selectedOption = this.options[this.selectedIndex];
      if (selectedOption.value) {
          addTeacherToSelection(selectedOption);
          this.remove(this.selectedIndex);
          this.value = ''; // Reset the select element
      }
  });

  function addTeacherToSelection(option) {
      const teacherBox = document.createElement('div');
      teacherBox.style.padding = '4px 8px';
      teacherBox.style.backgroundColor = '#e0e0e0';
      teacherBox.style.borderRadius = '4px';
      teacherBox.style.display = 'flex';
      teacherBox.style.alignItems = 'center';
      teacherBox.style.gap = '8px';
      teacherBox.style.marginBottom = '4px';
      teacherBox.innerHTML = `
          <span>${option.text}</span>
          <button type="button" style="border: none; background: none; cursor: pointer; font-size: 18px; line-height: 1;">&times;</button>
      `;
      selectedTeachersDiv.appendChild(teacherBox);

      // Add event listener to remove button
      teacherBox.querySelector('button').addEventListener('click', function() {
          selectedTeachersDiv.removeChild(teacherBox);
          // Add the teacher back to the dropdown
          const newOption = document.createElement('option');
          newOption.value = option.value;
          newOption.text = option.text;
          teacherSelect.add(newOption);
          // Sort the options
          sortSelectOptions(teacherSelect);
      });
  }

  function sortSelectOptions(selectElement) {
      const options = Array.from(selectElement.options);
      options.sort((a, b) => a.text.localeCompare(b.text));
      selectElement.innerHTML = '';
      options.forEach(option => selectElement.add(option));
  }
}

// Function to create a new class
async function createClass() {
  let className = document.getElementById('className').value.trim();
  const classDes = document.getElementById('classDes').value.trim();
  const selectedTeachers = Array.from(document.getElementById('selectedTeachers').children).map(
      teacherBox => teacherBox.textContent.trim().split('(')[1].split(')')[0]
  );

  // Ensure className is not longer than 50 characters
  if (className.length > 50) {
      className = className.substring(0, 47) + '...';
  }

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
          const errorText = await response.text();
          throw new Error(`Failed to create class: ${errorText}`);
      }

      const createdClass = await response.json();

      // Add teachers to the class
      for (const teacherId of selectedTeachers) {
          await fetch(`http://localhost:3000/classes/${createdClass.classID}/add`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userID: teacherId }),
          });
      }

      alert('Class created successfully!');
      document.getElementById('createClassForm').reset();
      document.getElementById('selectedTeachers').innerHTML = '';
      hideModal();
      fetchClasses(); // Refresh the class list
  } catch (error) {
      console.error('Error:', error);
      alert(`An error occurred while creating the class: ${error.message}`);
  }
}
// ==============================================================================================================

if (window.location.href.includes("mainAdmin.html") || window.location.href.includes("mainOthers.html")) {
  window.onload = function() {
    const userInfoDiv = document.getElementById('main-title');
    const retrievedData = localStorage.getItem('data');
    const user = JSON.parse(retrievedData);
    userInfoDiv.innerHTML += user.username + "!";
    fetchClasses();
  
    if (window.location.href.includes("mainAdmin.html")) {
      const form = document.getElementById('createClassForm');
      form.addEventListener('submit', function(event) {
          event.preventDefault();
          createClass();
      });
    }
  };
}

if (window.location.href.includes("admin")) {
  if (window.location.href.includes("adminTeachers.html")) {
    fetchUsers("T");
  } else if (window.location.href.includes("adminParents.html")) {
    fetchUsers("P");
  } else if (window.location.href.includes("adminStudents.html")) {
    fetchUsers("S");
  }
}

async function fetchClasses() {
  try {
      console.log('Fetching classes...');
      var retrievedData = localStorage.getItem('data');
      var user = JSON.parse(retrievedData)
      var response;
      if (window.location.href.includes("mainAdmin.html")) {
        response = await fetch('http://localhost:3000/classes');
      } else {
        response = await fetch(`http://localhost:3000/userClasses/${user.id}`, {headers: {"Authorization": "Bearer " + localStorage.getItem('token')}});
      }
      console.log('Response status:', response.status);
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
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
          classElement.style = 'padding: 10px;';


          if (window.location.href.includes("mainAdmin.html")) {
            link = 'classAdmin';
          } else {
            link = `class${user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}`;
          } //<img src="assets/image.png" style="width: match-parent;">
          classElement.innerHTML = `
              <div class="card h-100">
                  <div class="card-body">
                    <h5 class="card-title"><a href="${link}.html?class_id=${classItem.classID}">${classItem.className}</a> (${classItem.classID})</h5>
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

async function fetchUsers(type) {
  try {
      console.log('Fetching User...');
      var response = await fetch('http://localhost:3000/users');
      console.log('Response status:', response.status);

      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      const userList = document.getElementById('class-list');
      if (!userList) {
          console.error('class-list element not found in the DOM');
          return;
      }
      userList.innerHTML = ''; // Clear existing content

      // Filter for teachers
      const filteredUsers = data.filter(user => user.id[0] === type);

      const userHTML = filteredUsers.map(user => `
          <div class="card h-100 usercardOuter">
            <div class="card-body usercardInner">
              <h5 class="card-title">${user.username}</h5>
              <p class="card-text">${user.id}</p>
              <button class="btn btn-danger btn-sm remove-user" data-userid="${user.id}" data-username="${user.username}">Remove User</button>
            </div>
          </div>
      `).join('');

      userList.innerHTML = userHTML;

      // Add event listeners to the remove buttons
      document.querySelectorAll('.remove-user').forEach(button => {
        button.addEventListener('click', function() {
          console.log("bye")
          const userId = this.getAttribute('data-userid');
          const username = this.getAttribute('data-username');
          showRemoveUserModal(userId, username);
        });
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

// document.addEventListener('DOMContentLoaded', () => {
//   // Add event listener for the confirm remove user button
//   document.getElementById('confirmRemoveUser').addEventListener('click', confirmRemoveUser);
//   // Add event listener for the add user button
//   document.getElementById('addUserBtn').addEventListener('click', showAddUserModal);
// });

function showRemoveUserModal(userId, username) {
  const modal = new bootstrap.Modal(document.getElementById('removeUserModal'));
  const modalBody = document.getElementById('removeUserModal').querySelector('.modal-body');
  modalBody.textContent = `Are you sure you want to remove ${username} (${userId}) from the class? This action cannot be undone.`;
  
  document.getElementById('confirmRemoveUser').setAttribute('data-userid', userId);
  modal.show();
}

function confirmRemoveUser() {
  const userId = this.getAttribute('data-userid');
  removeUserFromClass(userId);
  const modal = bootstrap.Modal.getInstance(document.getElementById('removeUserModal'));
  modal.hide();
}

async function removeUserFromClass(userId) {
  const classId = getClassIdFromUrl();
  try {
      const response = await fetch(`http://localhost:3000/classes/${classId}/remove`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userID: userId }),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }

      const updatedUsers = await response.json();
      displayClassUsers(updatedUsers);
  } catch (error) {
      console.error('Error removing user from class:', error);
      alert('Failed to remove user from class. Please try again.');
  }
}
