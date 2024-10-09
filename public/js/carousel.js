//adminLoginStart
const adminLoginModal=document.getElementById('adminLoginModal')
const adminLoginSubmit=document.getElementById('adminLoginSubmit')
const adminEmail=document.getElementById('adminEmail')
const adminPassword=document.getElementById('adminPassword')
const adminModalClose=document.getElementById('adminModalClose')
//adminLoginEnd
const LoginAdminLandingButton=document.getElementById('LoginSubmitButton')
LoginAdminLandingButton.addEventListener('click',(e)=>{
  e.preventDefault();
})
//signInStart
const submitButton=document.getElementById('submitButton');
const fullName=document.getElementById('fullNameSignUp');
const emailSignUp=document.getElementById('emailSignUp');
const userSignInModal=document.getElementById('userSignInModal');
const phoneNumberSignUp=document.getElementById('phoneNumberSignUp');
const closeSignIn=document.getElementById('closeSignIn')
// signInEnd
//loginStart
const userLogInModal=document.getElementById('userLogInModal')
const LoginSubmitButton=document.getElementById('LoginSubmitButton')
const passwordLogin=document.getElementById('passwordLogin')
const emailLogin=document.getElementById('emailLogin')
const loginClose=document.getElementById('loginClose')
//logInEnd
const createPassword=document.getElementById('createPassword');

adminLoginSubmit.addEventListener('click',adminLoginForm)
LoginSubmitButton.addEventListener('click',LogInForm)
submitButton.addEventListener('click',SignInForm)
async function adminLoginForm()
{
  let emailAdmin=adminEmail.value;
  let passwordAdmin=adminPassword.value;
  const data={email:emailAdmin,password:passwordAdmin}
  const response=await fetch('/adminLogin',
                          {method:"POST",
                            body:JSON.stringify(data),
                            headers:{"Content-Type":"application/json"}
                          }
                      );
  const result= await response.json();
 alertMessage(result.message,result.icon,result.title);
  if(result.icon=='success'){
    adminEmail.value='';
    adminPassword.value='';
    setTimeout(()=>{
      location.redirect('/adminLandingPage');
    },2000)
  }
  adminLoginModal.classList.remove('show');
  adminLoginModal.style.display='none';
  adminLoginModal.style.padding=0;
  adminLoginModal.setAttribute('aria-hidden','true');    

  setTimeout(()=>{
    adminModalClose.click();
  },2500)

}
async function LogInForm()
{
  let loginEmail=emailLogin.value;
  let loginPassword=passwordLogin.value;
  const data={email:loginEmail,createPassword:loginPassword}
  const response=await fetch('/login',
                          {method:"POST",
                            body:JSON.stringify(data),
                            headers:{"Content-Type":"application/json"}
                          }
                      );
  const result= await response.json();
 alertMessage(result.message,result.icon,result.title);
  if(result.icon=='success'){
    emailLogin.value='';
    passwordLogin.value='';
    setTimeout(()=>{
      location.reload();
    },2000)
  }
  userLogInModal.classList.remove('show');
  userLogInModal.style.display='none';
  userLogInModal.style.padding=0;
  userLogInModal.setAttribute('aria-hidden','true');    

  setTimeout(()=>{
    loginClose.click();
  },2500)

}
async function SignInForm()
{
  let email=emailSignUp.value;
  let name=fullName.value;
  let phoneNumber=phoneNumberSignUp.value;
  let password=createPassword.value;
  let message;
  if(!name.trim() || !email.trim() || !email.includes('@') || !phoneNumber.trim() || !password.trim() || password.length<6){    
    message='Error Input - Please check the credentials and try again';
    alertMessage(message)
    }
  const data={fullNameSignUp:name,email:email,phoneNumber:phoneNumber,createPassword:password}
  const response=await fetch('/newUserSignIn',
                          {method:"POST",
                            body:JSON.stringify(data),
                            headers:{"Content-Type":"application/json"}
                          }
                      );
  const result= await response.json();
 alertMessage(result.message,result.icon,result.title);
  if(result.icon=='success'){
    emailSignUp.value='',
    fullName.value='',
    phoneNumberSignUp.value='',
    createPassword.value=''
    setTimeout(()=>{
      location.reload();
    },2000)
  }
  userSignInModal.classList.remove('show');
  userSignInModal.style.display='none';
  userSignInModal.style.padding=0;
  userSignInModal.setAttribute('aria-hidden','true');    

  setTimeout(()=>{
    closeSignIn.click();
  },2500)

}


function myFunction() {
    var x = document.getElementById("createPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
  
  
  let myInput = document.getElementById("createPassword");
  let letter = document.getElementById("letter");
  let capital = document.getElementById("capital");
  let number = document.getElementById("number");
  let length = document.getElementById("length");
  
  myInput.onfocus = function() {
    document.getElementById("message").style.display = "block";
  }
  
  myInput.onblur = function() {
    document.getElementById("message").style.display = "none";
  }
  
  myInput.onkeyup = function() {
    let lowerCaseLetters = /[a-z]/g;
    if(myInput.value.match(lowerCaseLetters)) {  
      letter.classList.remove("invalid");
      letter.classList.add("valid");
    } else {
      letter.classList.remove("valid");
      letter.classList.add("invalid");
    }
    
    // Validate capital letters
    let upperCaseLetters = /[A-Z]/g;
    if(myInput.value.match(upperCaseLetters)) {  
      capital.classList.remove("invalid");
      capital.classList.add("valid");
    } else {
      capital.classList.remove("valid");
      capital.classList.add("invalid");
    }
  
    // Validate numbers
    let numbers = /[0-9]/g;
    if(myInput.value.match(numbers)) {  
      number.classList.remove("invalid");
      number.classList.add("valid");
    } else {
      number.classList.remove("valid");
      number.classList.add("invalid");
    }
    
    // Validate length
    if(myInput.value.length >= 8) {
      length.classList.remove("invalid");
      length.classList.add("valid");
    } else {
      length.classList.remove("valid");
      length.classList.add("invalid");
    }
  }
  

function alertMessage(text,icn,title)
{
    swal.fire({
        title: title,
        text: text,
        icon: icn,
        confirmButtonColor: '#cd9d40',
        confirmButtonText: 'Ok',
        background:'black',
        color:'white'
      });
}