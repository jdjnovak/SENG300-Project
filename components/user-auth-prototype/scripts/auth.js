//  listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('user logged in: ', user);
        document.querySelector('#user-status').innerHTML = "Logged in as: &nbsp" + user.email;
    } else {
        console.log('user not logged in');
        document.querySelector('#user-status').innerHTML = "User not logged in";
    }
});

//  signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();  // prevent the default action (page refresh) from firing

    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then (cred => {  // async, so handle the promise
        const modal = document.querySelector('#modal-signup');  // materialize stuff
        M.Modal.getInstance(modal).close();  
        signupForm.reset();  // clears out the form fields after modal close
    });  
});

//  logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();  //.then(() => {
    //     console.log('user signed out');
    // });
});

//  login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        // close the login modal and reset the form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();  
        loginForm.reset();
    });
});