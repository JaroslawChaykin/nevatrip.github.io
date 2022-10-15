const timeBoxNode = document.querySelector('.time-box');
const numBoxNode = document.querySelector('.num-box');
const numInput = document.querySelector('#num');
const calculatedButton = document.querySelector('#calculated');
const messageNode = document.querySelector('#message');

const times = {
    AtoB: ['18:00', '18:30', '18:45', '19:00', '19:15', '21:00'],
    BtoA: ['18:30', '18:45', '19:00', '19:15', '19:35', '21:50', '21:55']
};
const routeVariants = {
    AtoB: 'из А в В',
    BtoA: 'из В в А',
    AtoBtoA: 'из А в В и обратно в А',
};
let selectedRoute = '';
let selectedTime = {
    from: '',
    to: ''
};
let selectedPerson = 1;
window.otherData = selectedTime;

document.getElementById('route').addEventListener('change', (event) => {
    timeBoxNode.innerHTML = '';
    timeBoxNode.style.display = 'block';
    selectedRoute = event.target.value;

    if (event.target.value === 'AtoBtoA') {
        const selectTime1 = createSelect();
        addOptionsToSelect(selectTime1, createOptions(times['AtoB']));
        timeBoxNode.append(selectTime1);

        selectTime1.addEventListener('change', (e) => {
            if (timeBoxNode.childNodes[1]) {
                timeBoxNode.childNodes[1].remove();
            }

            const selectTime2 = createSelect();
            selectedTime.from = e.target.value;

            const optionsForSecondSelect = times['BtoA'].filter(item => {
                const convertedTime = new Date(getMilliseconds(e.target.value));
                convertedTime.setMinutes(convertedTime.getMinutes() + 50);

                const dateTime = new Date(getMilliseconds(item));

                return convertedTime < dateTime;
            });

            addOptionsToSelect(selectTime2, createOptions(optionsForSecondSelect));
            timeBoxNode.append(selectTime2);

            selectTime2.addEventListener('change', showNextStep);
        });

    } else {
        const selectTime = createSelect();
        addOptionsToSelect(selectTime, createOptions(times[event.target.value]));
        timeBoxNode.append(selectTime);
        selectTime.addEventListener('change', showNextStep);
    }
});

calculatedButton.addEventListener('click', () => {
    const calculateSum = () => {
        let outSum = 0;
        if (selectedRoute === 'AtoBtoA') outSum = numInput.value * 1200;
        else outSum = numInput.value * 700;
        return outSum;
    };
    const messageRouteAndPrice = `<p>Вы выбрали ${numInput.value} билета по маршруту ${routeVariants[selectedRoute]} стоимостью ${calculateSum()}.</p>`;

    const messageTimeInRoad = () => {
        let text = '';
        if (selectedRoute === 'AtoBtoA') {
            let date1 = new Date(getMilliseconds(selectedTime.from));
            let date2 = new Date(getMilliseconds(selectedTime.to));
            date2.setMinutes(date2.getMinutes() + 50);

            let computedHours = getDifferenceInHours(date1, date2);
            let computedMinutes = getDifferenceInMinutes(date1, date2);

            text = `<p>Это путешествие займет у вас ${Math.floor(computedHours)} часа ${Math.floor(computedMinutes % 60)} минут. </p>`;
        } else {
            text = `<p>Это путешествие займет у вас 50 минут. </p>`;
        }
        return text;
    };

    const messageArrivalTime = () => {
        let text = '';
        if(selectedRoute === 'AtoBtoA') {
            let date1 = new Date(getMilliseconds(selectedTime.from));
            let date2 = new Date(getMilliseconds(selectedTime.to));
            date1.setMinutes(date1.getMinutes() + 50)
            date1.setHours(date1.getHours() - 3)
            date2.setMinutes(date2.getMinutes() + 50)
            date2.setHours(date2.getHours() - 3)
            text = `<p>Теплоход из А в В отправляется в ${selectedTime.from}, а прибудет в ${date1.getHours()}:${date1.getMinutes() % 60}.
Теплоход из В в А отправляется в ${selectedTime.to}, а прибудет в ${date2.getHours()}:${date2.getMinutes() % 60}.</p>`;
        } else {
            let date1 = new Date(getMilliseconds(selectedTime.to));
            date1.setMinutes(date1.getMinutes() + 50)
            date1.setHours(date1.getHours() - 3)
            text = `<p>Теплоход отправляется в ${selectedTime.to}, а прибудет в ${date1.getHours()}:${date1.getMinutes() % 60}.</p>`;
        }

        return text;
    };
    messageNode.innerHTML = messageRouteAndPrice + messageTimeInRoad() + messageArrivalTime();
});

function showNextStep(e) {
    selectedTime.to = e.target.value;
    numBoxNode.style.display = 'block';
}

function createSelect() {
    let select = document.createElement('select');
    select.name = 'time';
    select.id = 'time';
    return select;
}

function createOptions(options) {
    let defaultOption = document.createElement('option');
    defaultOption.selected = true;
    defaultOption.disabled = true;
    defaultOption.text = 'Выберите';

    return [defaultOption, ...options.map(item => {
        let option = document.createElement('option');
        option.value = item;
        option.text = item;
        return option;
    })];
}

function addOptionsToSelect(selectNode, options) {
    options.forEach(item => {
        selectNode.appendChild(item);
    });
}

function getMilliseconds(time) {
    let hour = time.split(':')[0];
    let min = time.split(':')[1];
    let s = Number(hour * 3600) + Number(min * 60);
    return s * 1000;
}

function getDifferenceInHours(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60);
}

function getDifferenceInMinutes(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60);
}