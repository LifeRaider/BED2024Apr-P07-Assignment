// signup function
async function signup(event) {
  event.preventDefault();
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('cPassword');
  const cpDesign = document.getElementById('cpDesign');
  const eWarning = document.getElementById('eWarning');
  const pWarning = document.getElementById('pWarning');
  const submit = document.getElementById('createAcc');

  if (password.value === confirmPassword.value) {
    pWarning.style.display = 'none';
    submit.style = 'margin-top: 30px;';

    if (document.URL.includes("sSignup.html")) {
      temp = 'student'
    }
    if (document.URL.includes("pSignup.html")) {
      temp = 'parent'
    }

    // let formData = {
    //   "username": "Jovan Lim",
    //   "email": "aa@lmao.com",
    //   "password": "aaaa",
    //   "userType": temp
    // };
    const formData = {
      "username": document.getElementById('fname').value + " "+ document.getElementById('lname').value,
      "email": document.getElementById('email').value,
      "password": document.getElementById('password').value,
      "userType": temp
    };

    let settings = {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      beforeSend: function () {
        //@TODO use loading bar instead
        // Disable our button or show loading bar
        submit.disabled = true;
      }
    }

    console.log(formData)
    const response = await fetch("http://localhost:3000/CreateUsers", settings);
    const data = await response.json();
    // console.log

    if (response.status === 409){
      eWarning.style.display = 'block';
      cpDesign.style = 'margin-top: 8px;';
    } else if (response.status === 500) {
      eWarning.style.display = 'none';
      cpDesign.style = 'margin-top: 25px;';
    } else {
      eWarning.style.display = 'none';
      cpDesign.style = 'margin-top: 25px;';
      alert("Welcome " + data.username + "!")
    }

  } else {
    pWarning.style.display = 'block';
    submit.style = 'margin-top: 13px;';
  }
}
