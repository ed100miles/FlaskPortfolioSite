console.log('App.js imported successfully.')

const BRANDLINK = document.querySelector('#brand-link');
const HOMELINK = document.querySelector('#home-link');
const ABOUTLINK = document.querySelector('#about-link');
const SKILLSLINK = document.querySelector('#skills-link');
const PROJECTSLINK = document.querySelector('#projects-link');

const ABOUT_SCROLL_LINK = document.querySelector('#about-scroll-link');
const SKILLS_SCROLL_LINK = document.querySelector('#skills-scroll-link');
const PROJECTS_SCROLL_LINK = document.querySelector('#projects-scroll-link');
const TO_TOP_SCROLL_LINK = document.querySelector('#to-top-scroll-link');

const TYPE_TEXTS = ['Software Development...', 
                    'Python...',
                    'JavaScript...',
                    'Bash...',
                    'HTML & CSS...',
                    'Flask...',
                    'SQL...',
                    'Machine Learning...',
                    'Docker...']
let count = 0;
let index = 0;
let currentText = '';
let letter = '';

(function type(){
    if(count === TYPE_TEXTS.length){
        count = 0;
    };
    currentText= TYPE_TEXTS[count];
    letter = currentText.slice(0, ++index);
    document.querySelector('.typed-content').textContent = letter;
    if(letter.length === currentText.length){
        count++;
        index = 0;
    }
    setTimeout(type, 200)
}());

function scroll(e){
    e.preventDefault();
    let targetDiv = e.target.attributes['data-scrollto'].value;
    console.log(targetDiv);
    let targetPosition = document.getElementById(targetDiv).getBoundingClientRect().top - 49; // to compensate for the navbar
    window.scrollBy(0, targetPosition)
}

BRANDLINK.addEventListener('click', scroll)
HOMELINK.addEventListener('click', scroll)
ABOUTLINK.addEventListener('click', scroll)
SKILLSLINK.addEventListener('click', scroll)
PROJECTSLINK.addEventListener('click', scroll)
ABOUT_SCROLL_LINK.addEventListener('click', scroll)
SKILLS_SCROLL_LINK.addEventListener('click', scroll)
PROJECTS_SCROLL_LINK.addEventListener('click', scroll)
TO_TOP_SCROLL_LINK.addEventListener('click', scroll)


