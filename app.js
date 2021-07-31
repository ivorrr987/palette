const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");//왜 기존에 있던 controls_color를 쓰면 안되는거지?
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const init = document.getElementById("jsInit");
const saveBtn=document.getElementById("jsSave");
const clearBtn=document.getElementById("jsClear");
const saveBlock = document.getElementsByClassName('saveBlock')[0];

initWidth=canvas.offsetWidth;
initHeight=canvas.offsetHeight;
initFillColor='white';
initStrokeColor='black';
initLineWidth=2.5;

canvas.width=initWidth; //'width' means 'the width of image in pixels'
canvas.height=initHeight; //'height' means 'the height of image in pixels'
//여기서 canvas변수는 HTML문서에서 id가 'jsCanvas'인 부분을 받아온 것인데
//해당 부분에 canvas의 width, height 정보가 없다.
//이 경우에 기본값인 width=300, height=150을 받아오게 되므로 실제 마우스 포인터와 그려지는 선간의 오차가 발생하게 된다.

ctx.fillStyle = initFillColor;
ctx.fillRect(0,0,initWidth,initHeight);
ctx.strokeStyle= initStrokeColor;
ctx.lineWidth = initLineWidth;
ctx.fillStyle=ctx.strokeStyle;

let painting = false;
let filling = false;

function startPainting(){
    painting=true;
}


function stopPainting(){
    painting=false;
}

function onMouseMove(event){
    const x = event.offsetX;
    const y = event.offsetY;
    if(!painting){
        ctx.beginPath();
        ctx.moveTo(x,y); 
       //특별한 지정 없이 beingPath를 하면 자동으로 그 위치로 moveTo가 실행.
    }
    else{
        ctx.lineTo(x,y);
        ctx.stroke();
        //마우스가 클릭된 상태(painting==true)이고 마우스가 움직이면 이 else이하가 실행되게 됨.
        //움직이는 순간마다 아주 짧은 선이 그어지므로 곡선을 그릴 수 있다. 미분을 생각해보자.
    }
}

function savePainting(event){
    ctx.save();
}

function handleColorClick(event){
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color; //선택한 색상으로 선을 그릴 수 있게 함.
    ctx.fillStyle = ctx.strokeStyle;
}

function handleRangeChange(event){
    const brushSize = event.target.value;
    ctx.lineWidth=brushSize;
}

function handleModeClick(){
    if(filling){
        filling=false;
        mode.innerText = "Fill" //클릭하면 Fill로 바뀐다는 뜻. 즉 지금은 Paint
    }
    else{
        filling=true;
        mode.innerText = "Paint" //클릭하면 Paint로 바뀜. 지금은 Fill
    }
}

function handleCanvasClick(){
    if(filling){
        ctx.fillRect(0,0,initWidth,initHeight);
    }
}

function handleInitCanvas(){
    temp_style = ctx.fillStyle;
    ctx.fillStyle = initFillColor;
    ctx.fillRect(0,0,initWidth,initHeight);
    ctx.fillStyle = temp_style;
}
//'Init'을 누를 경우 컨버스가 초기화(하얀색으로). 그 이후 다시 기존에 설정되어 있던
//fillstyle값을 되돌려 놓음.

function handleCM(event){
    event.preventDefault();
}

function handleSaveClick(){
    let savedImgInfo = canvas.toDataURL("image/jpeg");
    let savedImage = document.createElement('img');
    savedImage.setAttribute('src', savedImgInfo);
    savedImage.setAttribute('class', 'savedImage');
    saveBlock.appendChild(savedImage);

    saveCount = localStorage.length;
    localStorage.setItem(`saved${saveCount+1}`, savedImgInfo);
}

function showSaved(){
    var count;
    for (count=1; count<=localStorage.length; count++){
        let loadedImgInfo = localStorage.getItem(`saved${count}`)
        let loadedImage = document.createElement('img');
        loadedImage.setAttribute('src',loadedImgInfo);
        loadedImage.setAttribute('class', 'loadedImage');
        saveBlock.appendChild(loadedImage);
    }
}


function handleClearClick(){
    if(localStorage.length!=0){
        localStorage.clear();
    }
    while(saveBlock.hasChildNodes){
        saveBlock.removeChild(saveBlock.firstChild);
    }
    
}


function _init(){
    if(canvas){
        canvas.addEventListener("mousemove", onMouseMove)
        canvas.addEventListener("mousedown", startPainting) //마우스 눌리면 페인팅 시작
        canvas.addEventListener("mouseup", stopPainting) //마우스 논클릭이면 페인팅 마침
        canvas.addEventListener("mouseleave", stopPainting) //마우스가 캔버스 벗어나면 페인팅 마침
        canvas.addEventListener("click", handleCanvasClick);
        canvas.addEventListener("contextmenu", handleCM);
    }

    Array.from(colors).forEach(color => color.addEventListener("click", handleColorClick));
    // '=>' 이전의 color는 일종의 변수명으로, 어떤 것이든 상관없다.
    if(range){
        range.addEventListener("input", handleRangeChange);
    }
    //'input'이 발생할 때마다 handleRangeChange 함수 실행.

    if(mode){
        mode.addEventListener("click", handleModeClick);
    }

    if(init){
        init.addEventListener("click", handleInitCanvas);
    }

    if(saveBtn){
        saveBtn.addEventListener("click", handleSaveClick);
    }

    if(clearBtn){
        clearBtn.addEventListener("click", handleClearClick);
    }

    if(localStorage.length != 0){
        showSaved();
    }

    // 왜인지는 모르겠지만 paintBlock, saveBlock를 나누어서 레이아웃을 만들고나니
    // 페인팅 시의 마우스 커서와 실제 그려지는 위치가 달라진다. 캔버스 상에서 왼쪽으로 갈 수록 일치하고 오른쪽으로 갈수록 괴리가 커진다.
}

_init();