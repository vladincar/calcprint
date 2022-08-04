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

let delMin;
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

    //При выборе самоклеек не доступна плотность
    if (!paper.value.startsWith('Офсетный')) {
        dencity.disabled = true;
        dencity.value = '0';

    } else {
        dencity.disabled = false;
        dencity.value = '80';
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

        enforceMinMax(width);
        enforceMinMax(height);

    } else if (!ploternaya.checked && !format.checked) {
        ploternaya.click();
    }
    if ((parseInt(width.value)) < width.min) return
    if (height.value < height.min) return

    //на лист сколько

    let widthAmount = Math.trunc(innerRaskladka.style.width.slice(0, 3) / (parseInt(width.value)));
    let heightAmount = Math.trunc(innerRaskladka.style.height.slice(0, 3) / (parseInt(height.value)));
    let cardsAmount = widthAmount * heightAmount;

    innerRaskladka.innerHTML = '';
    for (x = 0; x < cardsAmount; x++) {
        let div = document.createElement("div");
        //если меньше минимального то не ставит на разметку ничего
        div.style.width = delMin > parseInt(width.value) ? delMin + 'px' : width.value + 'px';
        div.style.height = delMin > parseInt(height.value) ? delMin + 'px' : height.value + 'px';
        //
        innerRaskladka.appendChild(div);
    }

    //если дети выходят за пределы листа то удаляем их
    let deletedDivs = innerRaskladka.childElementCount;
    while (innerRaskladka.getBoundingClientRect().bottom < innerRaskladka.lastElementChild.getBoundingClientRect().bottom) {
        innerRaskladka.removeChild(innerRaskladka.lastElementChild);
    }
    deletedDivs-=innerRaskladka.childElementCount
    /////////////СЧИТАТЬ СТОИМОСТЬ
    let money = 0;
    select.forEach(x => {
        money += +x.options[x.selectedIndex].getAttribute("calc");
    })

    format.checked ? money += +format.getAttribute("calc") : money += +ploternaya.getAttribute("calc");
    
    money *= Math.ceil(circulation.value / innerRaskladka.childElementCount);

    price.innerHTML = money < 100 ? `100 грн.` : `${money.toFixed(2)} грн.`


}; mainFunc();


//если размер больше/меньше чем можно то ставит на максимально возможный
function enforceMinMax(el) {
    if (el.value != "") {
        if (parseInt(el.value) < parseInt(el.min)) {
            // el.value = el.min;
            delMin = el.min;
        }
        if (parseInt(el.value) > parseInt(el.max)) {
            el.value = el.max;
        }
    }
}
