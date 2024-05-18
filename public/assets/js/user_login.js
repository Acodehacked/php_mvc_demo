var forms = document.querySelectorAll('.form-login');

displayform(1);



function displayform(iii){
    var n = iii - 1;
    for (let i = 0; i < forms.length; i++) {
        forms[i].style.display = "none"
    }
    forms[n].style.display = "block";
}