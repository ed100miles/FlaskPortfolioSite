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

(function type() {
    if (count === TYPE_TEXTS.length) {
        count = 0;
    };
    currentText = TYPE_TEXTS[count];
    letter = currentText.slice(0, ++index);
    document.querySelector('.typed-content').textContent = letter;
    if (letter.length === currentText.length) {
        count++;
        index = 0;
    }
    setTimeout(type, 200)
}());

function scroll(e) {
    e.preventDefault();
    let targetDiv = e.target.attributes['data-scrollto'].value;
    console.log(targetDiv);
    let targetPosition = document.getElementById(targetDiv).getBoundingClientRect().top - 49; // to compensate for the navbar
    window.scrollBy(0, targetPosition)
}

function update_label(e) {
    debounce_get_risk()
    if (e != null) {
        let label_id = document.querySelector(`#${e.id}`).dataset.label_id
        if (e.value < parseInt(e.max)) {
            document.getElementById(label_id).innerHTML = e.value
        } else {
            document.getElementById(label_id).innerHTML = document.querySelector(`#${e.id}`).dataset.label_max
        }
    }
}

function get_risk() {
    let car_use
    let married
    let revoked
    let urbanicity

    if (document.getElementById('private_radio').checked) {
        car_use = 'Private'
    } else { car_use = 'Commercial' }

    if (document.getElementById('married_no_radio').checked) {
        married = 'z_No'
    } else { married = 'Yes' }

    if (document.getElementById('revoked_no_radio').checked) {
        revoked = 'No'
    } else { revoked = 'Yes' }

    if (document.getElementById('urban_radio').checked) {
        urbanicity = 'Highly Urban/ Urban'
    } else { urbanicity = 'z_Highly Rural/ Rural' }

    let risk_values = {
        AGE: parseFloat(document.getElementById('age_input').value),
        INCOME: parseFloat(document.getElementById('income_input').value),
        HOME_VAL: parseFloat(document.getElementById('house_input').value),
        BLUEBOOK: parseFloat(document.getElementById('car_input').value),
        CAR_AGE: parseFloat(document.getElementById('car_age_input').value),
        OLDCLAIM: parseFloat(document.getElementById('prev_clm_input').value),
        TIF: parseFloat(document.getElementById('tif_input').value),
        MVR_PTS: parseFloat(document.getElementById('pts_input').value),
        KIDSDRIV: parseFloat(document.getElementById('kidsdriv_input').value),
        HOMEKIDS: parseFloat(document.getElementById('child_at_home_input').value),
        TRAVTIME: parseFloat(document.getElementById('travtime_input').value),
        YOJ: parseFloat(document.getElementById('yoj_input').value),
        CAR_TYPE: document.getElementById('car_type_input').value,
        OCCUPATION: document.getElementById('occupation_input').value,
        EDUCATION: document.getElementById('education_input').value,
        CAR_USE: car_use,
        MSTATUS: married,
        REVOKED: revoked,
        URBANICITY: urbanicity,
        // BIRTH: 'na',
        CLM_FREQ: 0,
        GENDER: 'M',
        PARENT1: 'No'
    }
    fetch(`${window.origin}/underwriter`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(risk_values),
        cache: 'no-cache',
        headers: new Headers({
            'content-type': 'application/json'
        })
    })
        .then(function (response) {
            response.json().then(function (data) {
                let risk_value = data[0]
                let redness = data[1]
                let greenness = data[2]
                document.getElementById('risk').innerHTML = risk_value
                document.getElementById('risk').style.color = `rgb(${redness}, ${greenness}, 0)`
            })
        })
}

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
let debounce_get_risk = debounce(function () {
    get_risk()
}, 250);

BRANDLINK.addEventListener('click', scroll)
HOMELINK.addEventListener('click', scroll)
ABOUTLINK.addEventListener('click', scroll)
SKILLSLINK.addEventListener('click', scroll)
PROJECTSLINK.addEventListener('click', scroll)
ABOUT_SCROLL_LINK.addEventListener('click', scroll)
SKILLS_SCROLL_LINK.addEventListener('click', scroll)
PROJECTS_SCROLL_LINK.addEventListener('click', scroll)
TO_TOP_SCROLL_LINK.addEventListener('click', scroll)


