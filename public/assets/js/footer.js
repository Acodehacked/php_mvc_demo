var footerofHtml = document.querySelector('.footer-content');
var versionCode = '1.5.0'
var versionName = 'Vachanavayal -ii'


var sectiondiv = document.createElement('div');
sectiondiv.classList.add('section');

////////////////////Create section of icon =-================================================================================================================

var lastsec = document.createElement('div');
lastsec.classList.add('sec-last')


var img = document.createElement('img');

img.src = '../assets/img/images/vachanavayal-icon.png';
img.className = 'img-xl';

var version = document.createElement('div');
version.classList.add('version');

var text = document.createElement('p');

text.innerText = versionName;
version.append(text)
var code = document.createElement('p')
code.innerText = versionCode;
version.append(code)

//Append to sec-last

lastsec.append(img)
lastsec.append(version)

//
//
///////////// This is the Code for make lists==============================================================================
//
//
var Jsonlist = [
    {
            'head': 'publication',
            'headicon': 'bx-book-content',
            'list':[
                {
                    "Name": "Store",
                    "icon": "bx-store",
                    "url": "https://vachanavayalquizplatform2.com"
                },
                {
                    "Name": "Books",
                    "icon": "bx-book-alt",
                    "url": "https://vachanavayalquizplatform2.com"
                },
                {
                    "Name": "Buy Now",
                    "icon": "bx-cart",
                    "url": "https://vachanavayalquizplatform2.com"
                }
            ]
            
    },
    {
        'head': 'Quiz App',
        'headicon': 'bx-planet',
        'list':[
            {
                "Name": "Result",
                "icon": "bx-trophy",
                "url": "https://vachanavayalquizplatform2.com"
            },
            {
                "Name": "Quizzes",
                "icon": "bx-planet",
                "url": "https://vachanavayalquizplatform2.com"
            },
            {
                "Name": "Apk Download",
                "icon": "bxl-play-store",
                "url": "https://vachanavayalquizplatform2.com"
            },
            {
                "Name": "Official Website",
                "icon": "bx-planet",
                "url": "https://vachanavayalquizplatform2.com"
            }
        ]
        
    },
    {
        'head': 'Vachanavayal App',
        'headicon': 'bx-planet',
        'list':[
            {
                "Name": "Logos club",
                "icon": "bx-book-open",
                "url": "https://vachanavayalquizplatform2.com"
            },
            {
                "Name": "E-Book",
                "icon": "bx-book-open",
                "url": "https://vachanavayalquizplatform2.com"
            },
            {
                "Name": "Vachanavayal Apk",
                "icon": "bxl-play-store",
                "url": "https://vachanavayalquizplatform2.com"
            },
            {
                "Name": "Official Website",
                "icon": "bx-planet",
                "url": "https://vachanavayalquizplatform2.com"
            },{
                "Name": "Official YouTube Channel",
                "icon": "bxl-youtube",
                "url": "https://vachanavayalquizplatform2.com"
            }
        ]
        
    },
    {
        'head': 'Social',
        'headicon': 'bx-share',
        'list':[
            {
                "Name": "YouTube",
                "icon": "bxl-youtube",
                "url": "https://vachanavayalquizplatform2.com"
            },
            {
                "Name": "Facebook",
                "icon": "bxl-facebook",
                "url": "https://vachanavayalquizplatform2.com"
            },
            {
                "Name": "WhatsApp",
                "icon": "bxl-whatsapp",
                "url": "https://vachanavayalquizplatform2.com"
            },
            {
                "Name": "Telegram",
                "icon": "bxl-telegram",
                "url": "https://vachanavayalquizplatform2.com"
            },
            {
                "Name": "Instagram",
                "icon": "bxl-instagram",
                "url": "https://vachanavayalquizplatform2.com"
            }
        ]
        
    },
]
/// JSON ends

//// THe Code of body Starts ///

var row_sec = document.createElement('div');
row_sec.classList.add('row');


for (let i = 0; i < Jsonlist.length; i++) {
    var sec_first = document.createElement('div');
    sec_first.classList.add('sec-first');
    var Data =  Jsonlist[i];

    var headli = document.createElement('li');
    headli.classList.add('head');

    var headname = Jsonlist[i].head;
    var headicon = Jsonlist[i].headicon;
    var bodylihtml = '';
    var headlihtml = '<li class="head"><div><i class="bx toggle-footer '+ headicon +'" ></i><p>'+ headname +'</p></div><i class="bx bx-plus footer-drawer"></i></li>'
    var link = document.createElement('div');
    link.classList.add('link')

    for (let j = 0; j < Data.list.length; j++) {
        
        bodylihtml = '<li><i class="bx '+ Jsonlist[i].list[j].icon +'" ></i><a  href="'+ Jsonlist[i].list[j].url +'">'+ Jsonlist[i].list[j].Name +'</a></li>'
        link.insertAdjacentHTML("beforeend",bodylihtml)
    }
    
    
    sec_first.insertAdjacentHTML("beforeend",headlihtml);
    sec_first.append(link)
    row_sec.append(sec_first);
}


var last_row_sec = document.createElement('div');
last_row_sec.classList.add('lolo');

var rowl_sec = document.createElement('div');
rowl_sec.classList.add('sec-last')

var p = document.createElement('p');
var ptext = 'Copyright © '
var year = new Date().getFullYear();
ptext += year;
ptext += ' All rights reserved. vachanavayal@gmail.com'
p.innerText = ptext;

rowl_sec.append(p)
ptext = '';

var p = '<p>Designed and Managed by: <a  href="https://aatech.xyz">Abin Antony</a></p>'

rowl_sec.insertAdjacentHTML('beforeend', p)

last_row_sec.append(rowl_sec)
//Append All items to section

sectiondiv.append(lastsec)
sectiondiv.append(row_sec)
sectiondiv.append(last_row_sec)
footerofHtml.append(sectiondiv)


window.addEventListener('load',()=>{
        
    var btns = document.querySelectorAll('.footer-drawer');

    btns.forEach(btn => {
        btn.addEventListener('click',(e)=>{
           e.target.parentElement.parentElement.classList.toggle('active')
           
        })
    });
})


