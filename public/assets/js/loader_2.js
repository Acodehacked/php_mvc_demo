

var load_cont = document.createElement('div');
load_cont.classList.add('load-container');
// load_cont.classList.add('hide');

var body = document.querySelector('body');


var loader = document.createElement('img');
loader.src = "../../assets/images/loader.gif";


load_cont.append(loader);
body.append(load_cont)
document.addEventListener('DOMContentLoaded', () => {
    load_cont.classList.add('hide');
})




function loadingtrue(){
    document.querySelector('.load-container').classList.remove('hide')
}
function loadingfalse(){

    document.querySelector('.load-container').classList.add('hide')
}




