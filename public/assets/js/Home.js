var maindash = document.getElementById('main-dasboard');
var srcbar = document.getElementById('srch-br');
var dropdownar = document.querySelectorAll('.dropdownar')
    function togglesidebar(){
        maindash.classList.toggle('close');
    }

    function togglesearch(){
        srcbar.classList.toggle('active');
    }
    dropdownar.forEach((dropdown, index) => {
        dropdown.addEventListener('click' , function(e){
            var parent = e.target.parentElement.parentElement.parentElement;

            parent.classList.toggle('activedrop')
        })
    });