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
        laminaciyaBack.disabled = true;
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
        innerRaskladka.style.width = '97.777777777%';
        innerRaskladka.style.height = '96.875%';

        //минимальный размер 
        width.min = "35"
        height.min = "35"

        //стандартный размер
        // if (size.value = "А3+") {
        //     width.value = "440"
        //     height.value = "310"
        // }

        //максимальный размер 
        width.max = "440"
        height.max = "310"

    } else if (ploternaya.checked) {
        innerRaskladka.style.width = '91.11111111%';
        innerRaskladka.style.height = '90.625%';

        //минимальный размер 
        width.min = "10"
        height.min = "10"

        //стандартный размер
        // if (size.value = "А3+") {
        //     width.value = "410"
        //     height.value = "290"
        // }


        //максимальный размер 
        width.max = "410"
        height.max = "290"
    }


    //на лист сколько

console.log(innerRaskladka.style.width)

    //let p = document.createElement("p");
    //innerRaskladka.appendChild


}; mainFunc();

