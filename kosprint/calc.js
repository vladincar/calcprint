//rerun script on change
let select = document.querySelectorAll('select');
select.forEach(x => {
    x.addEventListener('change', () => mainFunc())
})

let input = document.querySelectorAll('input');
input.forEach(x => {
    x.addEventListener('change', () => mainFunc())
})
//

let innerRaskladka = document.querySelector('.innerRaskladka');

let width = document.querySelector('#width');
let height = document.querySelector('#height');

let size = document.querySelector('#size');
let price = document.querySelector('#price');


function mainFunc() {

    let paper = document.querySelector('#paper');
    let dencity = document.querySelector('#dencity');

    let colorFace = document.querySelector('#front');
    let colorBack = document.querySelector('#back');

    let laminaciyaFace = document.querySelector('#front2');
    let laminaciyaBack = document.querySelector('#back2');

    let format = document.querySelector('#format');
    let ploternaya = document.querySelector('#ploternaya');

    let circulation = document.querySelector('#circulation');

    // Порезка если бумага то отключить плоттерную, самоклейка то выбрать плоттерную
    if (paper.value.startsWith('Офсетный')) {
        ploternaya.disabled = true
        ploternaya.checked = false
        format.checked = true
    } else {
        ploternaya.disabled = false;
    }


    //При выборе самоклеек доступно только лицо
    if (!paper.value.startsWith('Офсетный')) {
        colorBack.disabled = true;
        colorBack.value = '0';

        laminaciyaBack.disabled = true;
        laminaciyaBack.value = 'Без ламинации';
    } else {
        colorBack.disabled = false;
        laminaciyaBack.disabled = false;
    }


    //при изменении ширини или высоты А3+ меняетося на свой размер
    if ((width.value == 440 && height.value == 310) || (width.value == 410 && height.value == 290)) {
        size.value = "А3+";
    } else {
        size.value = "Свой размер";
    }




    ///////////////////////////Раскладка
    //////////////////////////


    //size raskladki
    if (format.checked) {
        innerRaskladka.style.width = '440px';
        innerRaskladka.style.height = '310px';

        //минимальный размер 
        width.min = "35"
        height.min = "35"


        //максимальный размер 
        width.max = "440"
        height.max = "310"

    } else if (ploternaya.checked) {
        innerRaskladka.style.width = '410px';
        innerRaskladka.style.height = '290px';

        //минимальный размер 
        width.min = "10"
        height.min = "10"

        //максимальный размер 
        width.max = "410"
        height.max = "290"


    }

    //если размер больше чем можно то ставит на максимально возможный
    if (width.innerHTML > width.max) {
        width.innerHTML = width.max;
        size.value = "А3+";
    }

    if (height.innerHTML > height.max) {
        height.innerHTML = height.max;
        size.value = "А3+";
    }

    if (width.innerHTML < width.min) {
        size.value = "А3+";
        width.innerHTML = width.min;
    }

    if (height.innerHTML < height.min) {
        size.value = "А3+";
        height.innerHTML = height.min;
    }



    //на лист сколько

    let widthAmount = Math.trunc(innerRaskladka.style.width.slice(0, 3) / (parseInt(width.value)));
    let heightAmount = Math.trunc(innerRaskladka.style.height.slice(0, 3) / (parseInt(height.value)));
    let cardsAmount = widthAmount * heightAmount;

    innerRaskladka.innerHTML = ''
    for (x = 0; x < cardsAmount; x++) {
        let div = document.createElement("div");
        div.style.width = width.value + 'px';
        div.style.height = height.value + 'px';
        innerRaskladka.appendChild(div);
    }

    //если дети выходят за пределы листа то удаляем их
    while (innerRaskladka.getBoundingClientRect().bottom < innerRaskladka.lastElementChild.getBoundingClientRect().bottom) {
        innerRaskladka.removeChild(innerRaskladka.lastElementChild);
    }



    /////////////СЧИТАТЬ СТОИМОСТЬ
    let money = 0;
    select.forEach(x => {
        money += +x.options[x.selectedIndex].getAttribute("calc");
    })

    format.checked ? money += +format.getAttribute("calc") : money += +ploternaya.getAttribute("calc");
    money*=circulation.value/innerRaskladka.childElementCount;

    price.innerHTML = money < 100 ? `100 грн.` : `${money.toFixed(2)} грн.`


}; mainFunc();

