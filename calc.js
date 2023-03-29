setTimeout(() => {
    

let arrForm = []



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


//collect for send email




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
        ploternaya.disabled = true;
        ploternaya.checked = false;
        format.checked = true;
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
        if (dencity.value === '0') dencity.value = '80';
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

    if ((parseInt(width.value)) < width.min) width.value = width.min
    else if ((parseInt(height.value)) < height.min) height.value = height.min

    //на лист сколько
    let widthAmount = Math.trunc(innerRaskladka.style.width.slice(0, 3) / (parseInt(width.value)));
    let heightAmount = Math.trunc(innerRaskladka.style.height.slice(0, 3) / (parseInt(height.value)));
    let cardsAmount = widthAmount * heightAmount;
    
    //Reverse width and height and see where fit more
    let checkIfReversed;
    let widthAmountReversed = Math.trunc(innerRaskladka.style.height.slice(0, 3) / (parseInt(width.value)));
    let heightAmountReversed = Math.trunc(innerRaskladka.style.width.slice(0, 3) / (parseInt(height.value)));
    if((widthAmount*heightAmount)<(widthAmountReversed*heightAmountReversed)){
        cardsAmount = widthAmountReversed*heightAmountReversed;
        checkIfReversed=true;
    }else checkIfReversed=false;


    innerRaskladka.innerHTML = '';
    for (x = 0; x < cardsAmount; x++) {
        let div = document.createElement("div");
        //если меньше минимального то не ставит на разметку ничего
        if(!checkIfReversed){
            div.style.width = delMin > parseInt(width.value) ? delMin + 'px' : width.value + 'px';
            div.style.height = delMin > parseInt(height.value) ? delMin + 'px' : height.value + 'px';
        }else{
            div.style.height = delMin > parseInt(width.value) ? delMin + 'px' : width.value + 'px';
            div.style.width = delMin > parseInt(height.value) ? delMin + 'px' : height.value + 'px';
        }

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

    if (format.checked) money += +format.getAttribute("calc");
    else if (ploternaya.checked) money += +ploternaya.getAttribute("calc");


    money *= Math.ceil(circulation.value / innerRaskladka.childElementCount);

    price.innerHTML = money < 100 ? `100 грн.` : `${money.toFixed(0)} грн.`




    //info for email send
    select.forEach((x, indx) => {
        arrForm[indx + 1] = (x.value)
    })
    input.forEach((x, indx) => {
        if (indx < 2) arrForm[indx] = (x.value)
    })
    if (format.checked) arrForm[8] = 'На формат'
    else if (ploternaya.checked) arrForm[8] = 'Плоттерная'
    arrForm[9] = circulation.value
}; mainFunc();

//если размер больше/меньше чем можно то ставит на максимально возможный
function enforceMinMax(el) {
    if (el.value != "") {
        if (parseInt(el.value) < parseInt(el.min)) {
            delMin = el.min;
        }
        if (parseInt(el.value) > parseInt(el.max)) {
            el.value = el.max;
        }
    }
}

//add info to email
let formText = `<div class="forminator-field forminator-merge-tags">
<ul style="list-style-type:none">
<li><span style="font-weight:600">Размеры - </span>${arrForm[0]}x${arrForm[1]} мм</li>
<li><span style="font-weight:600">Бумага - </span>${arrForm[2]},${arrForm[3]}</li>
<li><span style="font-weight:600">Цветность - </span>${arrForm[4]}+${arrForm[5]}</li>
<li><span style="font-weight:600">Ламинация - </span>Лицо: ${arrForm[6]}, Оборот: ${arrForm[7]}</li>
<li><span style="font-weight:600">Порезка - </span>${arrForm[8]}</li>
<li><span style="font-weight:600">Тираж - </span>${arrForm[9]}</li>
<li><span style="font-weight:600">Цена - </span>${price.innerHTML}</li>
</ul>
</div>`

let formInfo = document.querySelector('.formInfo');
formInfo.innerHTML = formText;

//form appear onclick
const form = document.querySelector('.elementor-section.elementor-top-section.elementor-element.elementor-element-b5a8f4b.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default');

function formBtn(){
    form.classList.toggle('elementorFormCustom')
}
}, 100);
