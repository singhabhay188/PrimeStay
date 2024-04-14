function move(path){
    let url = path;
    window.location.href = url;
}

let signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', function(event) {
    event.preventDefault();

    let email = signupForm.email.value;
    let name = signupForm.name.value;

    let modalContainer = document.getElementById('modal-container');
    modalContainer.classList.add('animate');

    setTimeout(function() {
        signupForm.reset();
        modalContainer.classList.remove('animate');
    }, 2000);
});