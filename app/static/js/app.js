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

function update_label(e) {
    let car_use
    let married
    let revoked
    let urbanicity 

    if (document.getElementById('private_radio').checked){
        car_use = 'private'
    } else { car_use = 'commercial' }

    if (document.getElementById('married_no_radio').checked){
        married = 'no'
    } else { married = 'yes' }

    if (document.getElementById('revoked_no_radio').checked){
        revoked = 'no'
    } else { revoked = 'yes' }
    
    if (document.getElementById('urban_radio').checked){
        urbanicity = 'urban'
    } else { urbanicity = 'rural' }

    let risk_values = {
        age: document.getElementById('age_input').value,
        income: document.getElementById('income_input').value,
        house_price: document.getElementById('house_input').value,
        car_value: document.getElementById('car_input').value,
        car_age: document.getElementById('car_age_input').value,
        oldclaim: document.getElementById('prev_clm_input').value,
        tif: document.getElementById('tif_input').value,
        points: document.getElementById('pts_input').value,
        kids_driv: document.getElementById('kidsdriv_input').value,
        home_kids: document.getElementById('child_at_home_input').value,
        travtime: document.getElementById('travtime_input').value,
        yoj: document.getElementById('yoj_input').value,
        car_type: document.getElementById('car_type_input').value,
        occupation: document.getElementById('occupation_input').value,
        education: document.getElementById('education_input').value,
        car_use: car_use,
        married: married,
        revoked: revoked,
        urbanicity: urbanicity
    }

    fetch(`${window.origin}/underwriter`,{
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(risk_values),
        cache: 'no-cache',
        headers: new Headers({
            'content-type': 'application/json'
        })
    })
    .then(function(response){
        response.json().then(function(data){
            console.log(data)
        })
    })

    if(e != null){
        let label_id = document.querySelector(`#${e.id}`).dataset.label_id
        if (e.value < parseInt(e.max)) {
            document.getElementById(label_id).innerHTML = e.value
        } else {
            document.getElementById(label_id).innerHTML = document.querySelector(`#${e.id}`).dataset.label_max
        }
    }
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


