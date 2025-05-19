/**
 * Переменная floorSvgElement с глобальной областью видимости в рамках скрипта, в которую будет помещаться элемент SVG. 
 * Если какие-то дополнительные маневры c SVG потребуются, то можно пользоваться.
 * Значение попадает в эту переменную из функции loadFloorImage. 
 */
let floorSvgElement = null;

let floorSvgRects = null;

window.onload = async () => {
    await init();
}

function createSelectOptions(items) {
    const options = [];

    items.forEach(item => {
        const optionElement = document.createElement('option');
        optionElement.textContent = item.name;
        optionElement.value = item.id;

        options.push(optionElement);
    });

    return options;
}

/**
 * Инициализируем начальное состояние корпуса, этажа. Рендерим панель управления. Подгружаем план этажа.
 */
async function init() {
    let buildings = [];
    let currentBuilding = null;

    let floors = [];
    let currentFloor = null;

    buildings = await loadBuildings();
    currentBuilding = buildings[0];

    floors = await loadFloors(currentBuilding);
    currentFloor = floors[0];

    const controlsElement = document.createElement('div'); // Создаем корневой эелемент панели управления
    const controlsForm = document.createElement('form'); // Создаем форму

    const buildingsLabel = document.createElement('label'); // Создаем label для корпуса
    buildingsLabel.textContent  = 'Список корпусов';
    const buildingsSelect = document.createElement('select');
    const buildingsOptions = createSelectOptions(buildings);
    buildingsOptions.forEach(option => {
        buildingsSelect.appendChild(option);
    });
    buildingsLabel.appendChild(buildingsSelect);

    const floorsLabel = document.createElement('label'); // Создаем label для этажей
    floorsLabel.textContent  = 'Список этажей';
    const floorsSelect = document.createElement('select');
    const floorsOptions = createSelectOptions(floors);
    floorsOptions.forEach(option => {
        floorsSelect.appendChild(option);
    });
    floorsLabel.appendChild(floorsSelect);

    controlsForm.appendChild(buildingsLabel);
    controlsForm.appendChild(floorsLabel);

    controlsElement.appendChild(controlsForm);
    document.body.prepend(controlsElement);

    await loadFloorImage(currentFloor.floorImg);

    // Подписываемся на событие change для выпадающего списка с корпусами
    buildingsSelect.addEventListener('change', async (e) => {
        const buildingId = e.target.value;

        removeRectEventListeners();
        await loadFloors(buildingId);

        currentFloor = floors[0];
        currentBuilding = buildings.find(building => building.id == buildingId);
        await loadFloorImage(currentFloor.floorImg);
    });

    // Подписываемся на событие change для выпадающего списка с этажами
    floorsSelect.addEventListener('change', async (e) => {
        const floorId = e.target.value;
        removeRectEventListeners();

        currentFloor = floors.find(floor => floor.id == floorId);
        await loadFloorImage(currentFloor.floorImg);
    });
}

/**
 * Функция для получения списка корпусов
 * @returns Возвращает список корпусов
 * {
        id - Идентификатор корпуса
        name - Наименование корпуса
        ... 
        Мб еще какая-то инфа нужна будет
 */
async function loadBuildings() {
    // Тут будет запрос через fetch для получения списка корпусов
    return Promise.resolve(BUILDINGS_LIST);
}

/**
 * 
 * @param {*} buildingId - идентификатор корпуса
 * @returns Возвращает список этажей для выбранного корпуса
 * {
        id - Идентификатор этажа
        name - Наименование этажа
        floorImg - Урл изображения этажа. Изображения предлагаю хранить в неком filestorage на бекенде.
    },
 */
async function loadFloors(buildingId) {
    // Тут будет запрос через fetch для получения списка этажей для выбранного корпуса
    return Promise.resolve(FLOORS_LIST);
}

/**
 * 
 * @param {*} url - адрес для загрузки изображения этажа
 */
async function loadFloorImage(url) {
    const svgText = await (await fetch(url)).text();

    document.getElementById('svg-container').innerHTML = svgText;
    floorSvgElement = document.querySelector('#svg-container svg'); // Находимо SVG в html разметке

    floorSvgRects = floorSvgElement.querySelectorAll('rect'); // Находим все rect в SVG

    /**
     * Делаем подписку на событие click для каждого rect. 
     */
    floorSvgRects.forEach(rect => {
        rect.addEventListener('click', rectEventHandler);
    });
}

/**
 * Функция-обработчик события click
 * @param {*} e Объект события
 */
function rectEventHandler(e) {
    /** Тут можешь зашить любую логику, которая тебе нужна. В атрибуты rect можно добавить необходимые параметры */
    alert('Click на rect c width = '+e.target.getAttribute('width'));
}

/**
 * Функция для удаления обработчиков события click для всех rect.
 * Так как при смене этажа, будут разные картинки, то нужно удалять подписки на события для предыдущего этажа иначе они будут копиться, что не хорошо.
 */
function removeRectEventListeners() {
    floorSvgRects.forEach(rect => {
        rect.removeEventListener('click', rectEventHandler);
    });
}

/** ===================== Хардкод константы =================================================== */ 
const BUILDINGS_LIST = [
    {
        id: 1,
        name: 'Корпус 1'
    },
    {
        id: 2,
        name: 'Корпус 2'
    },
    {
        id: 3,
        name: 'Корпус 3'
    },
    {
        id: 4,
        name: 'Корпус 4'
    },
    {
        id: 5,
        name: 'Корпус 5'
    },
    {
        id: 6,
        name: 'Корпус 6'
    },
    {
        id: 7,
        name: 'Корпус 7'
    },
    {
        id: 8,
        name: 'Корпус 8'
    },
    {
        id: 9,
        name: 'Корпус 9'
    },
    {
        id: 10,
        name: 'Корпус 10'
    },
    {
        id: 11,
        name: 'Корпус 11'
    }
];

const FLOORS_LIST = [
    {
        id: 1,
        name: '4',
        floorImg: 'images/floor_4.svg'
    },
    {
        id: 2,
        name: '1',
        floorImg: 'images/1.svg'
    },
    {
        id: 3,
        name: '2',
        floorImg: 'images/2.svg'
    },
    {
        id: 4,
        name: '3',
        floorImg: 'images/3.svg'
    }
]
