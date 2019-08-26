const dateInput = document.querySelector("#date"),
      heightInput = document.querySelector("#height"),
      weightInput = document.querySelector("#weight"),
      submit = document.querySelector("#submit");

function Load(){}

const load = new Load();

Load.prototype.loadEventListeners = function() {
  document.addEventListener('DOMContentLoaded', loadData);
  submit.addEventListener('click', addData);
}


load.loadEventListeners();

function valid(date, height, weight, e) {
  if(date === "" ||  height === "" ||  weight === "") {
    const table = document.querySelector('table');
    message(`有資料沒輸入`, 'error');
    e.preventDefault();
    return false;
  } else {
    message(`成功輸入資料`, 'success');
    e.preventDefault();
    return true;
  }
}

function message(message, state) {
  const div = document.createElement('div');
  div.textContent = message;
  div.className = state;
  document.querySelector('.container').insertBefore(div, document.querySelector('table'));
  setTimeout(function(){
    document.querySelector(`.${state}`).remove();
  }, 3000);
}

function addData(e){
  if(valid(dateInput.value, heightInput.value, weightInput.value, e)) {
    let data = new Object();

    data.date = document.querySelector("#date").value;
    data.height = document.querySelector("#height").value;
    data.weight = document.querySelector("#weight").value;
    storeData(data, loadData);
    
    e.preventDefault();
  }
};

function storeData(data, callback) {
  let dataList;
  if(localStorage.getItem('data') !== null) {
     dataList = JSON.parse(localStorage.getItem('data'));
  } else {
    dataList = {
      weight : [],
      height : [],
      date : []
    };
  }
  dataList.weight.push(data.weight);
  dataList.height.push(data.height);
  dataList.date.push(data.date);
  localStorage.setItem('data', JSON.stringify(dataList));
  const tbody = document.querySelector("tbody");
  while(tbody.firstChild) {
    tbody.firstChild.remove();
  }
  callback();
}

function loadData() {
  let dataList;
  if(localStorage.getItem('data') !== null) {
     dataList = JSON.parse(localStorage.getItem('data'));
  } else {
    dataList = {
      weight : [],
      height : [],
      date : []
    };
  }
  const tbody = document.querySelector("tbody");
  for(let i in dataList.date){
    const tr = tbody.insertRow();
    tbody.appendChild(tr);
    for(let j = 0; j < 5; j++){
      tr.appendChild(tr.insertCell());
    }
    tr.children[0].append(dataList.date[i]);
    tr.children[1].append(dataList.height[i]);
    tr.children[2].append(dataList.weight[i]);
  }
  compareWeight(dataList.weight, tbody);
  compareMS(dataList.weight, dataList.height, tbody);
}

function compareWeight(weight, tbody) {
  if(weight !== null) {
    for(let i = 1; i < weight.length ; i++){
      const diff = Number(Number(weight[i])-Number(weight[i-1])).toFixed(1);
      tbody.children[i].children[3].textContent = diff;
      if(diff > 0) {
        tbody.children[i].children[3].setAttribute("style","background:red");
      } else if (diff < 0) {
        tbody.children[i].children[3].setAttribute("style","background:yellow");
      }
    }
  }
}

function compareMS(weight, height, tbody) {
  if(weight !== null) {
    for(let i in weight){
      let result;
      height[i] = height[i]/100 * height[i]/100;
      result = Number(weight[i]/height[i]).toFixed(1);
      if(result < 16.5 || result >31.5) {
        tbody.children[i].children[4].textContent = '免役';
      } else if((16.5 <= result && result < 17) || (31 < result && result<= 31.5)) {
        tbody.children[i].children[4].textContent = '替代役';
      } else {
        tbody.children[i].children[4].textContent = '常備役';
      }
    }
  }
}