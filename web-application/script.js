


const firebaseConfig = {
  apiKey: "AIzaSyD6DnGbVfdJlDJ_pEOUfDfTDJrA8j3lIs8",
  authDomain: "dv-inventory.firebaseapp.com",
  databaseURL: "https://dv-inventory.firebaseio.com",
  projectId: "dv-inventory",
  storageBucket: "dv-inventory.appspot.com",
  messagingSenderId: "130062240176",
  appId: "1:130062240176:web:ecbca5d29b37d25c6cee75"
};

firebase.initializeApp(firebaseConfig);	
// **************************************************
// Создание деревовидного списка в левой части экрана
// **************************************************

async function addTreeList(){
  firebase.firestore().collection("places").get().then(response => { 
  let docs = response.docs.map(x => ({ 
         id: x.id,
         name: x.data().name,
         children:  x.data().parts && x.data().parts.map(part => part.id) 
  })); 
  getResult(docs);
});

function getResult(docs) {
  const docsCopy = docs.slice();
  function childrenSearch(childrenId, docsCopy, tree) {
    const idx = docsCopy.slice().findIndex(item => item.id === childrenId);
    const findElem = docsCopy[idx];

    const obj = {
      id: childrenId,
      children: findElem.children,
      parentId: findElem.parentId,
      name: findElem.name,
      el: 'div'
    };
   tree.push(obj);


    if (findElem.children) {
      findElem.children.forEach(itemId => {
        childrenSearch(itemId, docsCopy, tree);
      });
    }
  }

  function isChild(id, docsCopy) {
    for (let i = 0; i < docsCopy.length; i++) {
      const item = docsCopy[i];
      if (item.children) {
        for (let j = 0; j < item.children.length; j++) {
          const item1 = item.children[j];
          if (id === item1) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function findParentId(childrenId, docsCopy) {
    for (let i = 0; i < docs.length; i++) {
      const item = docsCopy[i];
      if (item.children) {
        for (let j = 0; j < item.children.length; j++) {
          const item1 = item.children[j];
          if (item1 === childrenId) {
            return item.id;
          }
        }
      }
    }
    return false;
  }

  docsCopy.forEach(item => {
    item.isChild = isChild(item.id, docsCopy);
    item.parentId = findParentId(item.id, docsCopy);
    item.children = (item.children === undefined) ? false : item.children;
  });
  const tree = [];
  docsCopy.forEach(item => {
    if (item.children && !item.isChild) {
      childrenSearch(item.id, docsCopy, tree);
    }
  });


  function buildTree(items, parentId) {
    parentId = parentId || false;
    let result = [];
  
    items.forEach((item) => {
        if (item.parentId === parentId) {
            result.push(item);
            item.children = buildTree(items, item.id);
            if (!item.children.length) {
                delete item.children;
            }
        }
    });
    
    return result;
  }
  const treeExport = buildTree(tree);

  function createTree(data) {
    const ul = document.createElement('ul');
    ul.classList.add('push');
    ul.id = 'push';
        
    data.forEach(item => {
      const li = document.createElement('li');
      
      li.textContent = item.name;
      li.classList.add(...item.id.split(' '));
      li.classList.add('clickable');
      li.id = item.id.split(' ');

      if (item.children) {
        li.appendChild(createTree(item.children));
      }
  
      ul.appendChild(li);
    });
  
    return ul;
  }

  document.querySelector('#container').appendChild(createTree(treeExport));



}
}

// **************************************************
// **************************************************
// **************************************************





// **************************************************
//Добавление списка оборудования(слева)
// **************************************************

function addInventoryList(){
  firebase.firestore().collection("inventory").get().then(response => { 
    let docs = response.docs.map(x => ({ 
           id: x.id, 
           name: x.data().name, 
           placeId: x.data().place.id,
           count: x.data().count
    })); 

    for(let i = -1; i < docs.length; i++){
      if (i === -1){
        let tr_1 = document.createElement("tr");
        tr_1.classList.add('first-raw');
        let td1 = document.createElement("td");
        td1.textContent = 'Наименование';
        let td12 = document.createElement("td");
        td12.textContent = 'Количество'; 
        let td13 = document.createElement("td");
        let td14 = document.createElement("td");
          let div = document.createElement("div");
          div.classList.add('popUpAddBtn');
          div.id = 'popUpAddBtn';
            let addBtn = document.createElement("button");
            addBtn.classList.add('addBtn');
            addBtn.id = 'addBtn';
            div.appendChild(addBtn);
          td14.appendChild(div);
        tr_1.appendChild(td1);
        tr_1.appendChild(td12);
        tr_1.appendChild(td13);
        tr_1.appendChild(td14);

        document.querySelector('#inventory-table-body').appendChild(tr_1);
      }else{
        let tr1 = document.createElement("tr");
        let td1 = document.createElement("td");
          let p = document.createElement('div');
          p.textContent = `${docs[i]['name']}`;
          p.classList.add(...docs[i].id.split(' '));
          p.id = (docs[i].id.split(' '));
          p.appendChild(td1);
        td1.textContent = `${docs[i]['name']}`;
        td1.id =(docs[i].id.split(' '));
        td1.classList.add(docs[i].placeId);
        let td1_2 = document.createElement("td");
        td1_2.id =`${docs[i].id.split(' ')}count`;
        td1_2.classList.add(...docs[i].id.split(' '));
        td1_2.classList.add('count-item');
        td1_2.textContent = `${docs[i]['count']}`;
        let td1_3 = document.createElement("td");
          let editButton = document.createElement("button");
          editButton.id = (docs[i].id.split(' '));
          editButton.classList.add('editButton');
          editButton.textContent = 'Изменить';
          td1_3.appendChild(editButton);
        let td1_4 = document.createElement("td");
          let deleteButton = document.createElement("button");
          deleteButton.id = (docs[i].id.split(' '));
          deleteButton.classList.add('deleteButton');
          td1_4.appendChild(deleteButton);
          
        tr1.appendChild(td1);
        tr1.appendChild(td1_2);
        tr1.appendChild(td1_3);
        tr1.appendChild(td1_4);

        document.querySelector('#inventory-table-body').appendChild(tr1);
      }
    }
});
}




document.addEventListener('DOMContentLoaded', addTreeList);
document.addEventListener('DOMContentLoaded', addInventoryList);


// **************************************************
//Подсвечивание элементов
// **************************************************
function showItems(){

let container = document.getElementById('container');
container.onclick = function (event) {
  if (event.target.classList.contains('clickable')) {
  function getItem(){
    let value = event.target.id;
    firebase.firestore().collection("inventory").get().then(response => { 
      let docs = response.docs.map(x => ({ 
            id: x.id, 
            name: x.data().name, 
            placeId: x.data().place
      })); 
      for (let j = 0; j < docs.length; j++ ){
        document.getElementById(`${docs[j]['id']}`).style.opacity = 1; 
        document.getElementById(`${docs[j]['id']}`).style.color = '#ffffff'; 
      }
      checkItem(docs, value);
    });
    
    function checkItem(docs, value){
      for(let u = 0; u < docs.length; u++){
        if (docs[u]['placeId']['id'] === value){
          document.getElementById(`${docs[u]['id']}`).style.opacity = 1;    
          document.getElementById(`${docs[u]['id']}`).style.color = '#D29D25';
        }else{
          document.getElementById(`${docs[u]['id']}`).style.opacity = 0.1; 
          document.getElementById(`${docs[u]['id']}`).style.color = '#ffffff'; 
        }
      }
    }
  }
  getItem();

}
}
}
document.addEventListener('DOMContentLoaded', showItems);

// **************************************************
//Функция удаления оборудования
// **************************************************

function deleteInventory(){

  let tableBody = document.querySelector('.inventory-table');
  tableBody.onclick = function (event) {
    if (event.target.classList.contains("deleteButton")) {
    let deleteButtonId = event.target.id;
    function deleteItem(){
      firebase.firestore().collection("inventory").doc(`${deleteButtonId}`).delete().then(() => {
        console.info("Done");
        window.location.reload();
    });
    }
    deleteItem();
  }
}
}
document.addEventListener('DOMContentLoaded', deleteInventory);
// **************************************************
// **************************************************
// **************************************************



// **************************************************
// Добавление элемента
// **************************************************

const modal = document.querySelector('.modal');
//const darken = document.querySelector('.darken');


  function addInventory(){
    getPlaces();
  let content = document.getElementById('wrapper');
  content.onclick = function (event) {
  if (event.target.classList.contains('addBtn')) {
    openModal();
    //darken.addEventListener('click', closeModal);
    } else if(event.target.classList.contains('close-modal')){
    let inputName = document.getElementById('inputName').value;
    let inputCount = document.getElementById('inputCount').value;
    let a=document.getElementById('s1').value;
    //darken.addEventListener('click', closeModal);
    closeModal();
    if (Number.isInteger(inputCount/1) && (inputCount !== '') && (inputName !== '') ){
    addInventoryItem(inputName, inputCount, a);
    document.getElementById('inputName').value = '';
    document.getElementById('inputCount').value = '';
    }else {
      alert('Введены некорректные данные');
      document.getElementById('inputName').value = '';
      document.getElementById('inputCount').value = '';
      let a = document.getElementById('s1').value= 'main';
    }
    
  }
}
  }
//  Добавлен
function addInventoryItem(name, count, a){
  let filestore = firebase.firestore();
filestore.collection("inventory").doc().set({ 
    name: `${name}`, 
    count: count, 
    place: filestore.collection("places").doc(a) // main-101 – id места
}).then(() => {
    window.location.reload();
    console.info("Done");
});
}


function openModal() {
  //darken.classList.add('darken-show');
  modal.classList.add('modal-show');
}

function closeModal() {
 //darken.classList.remove('darken-show');
  modal.classList.remove('modal-show');
}

document.addEventListener('DOMContentLoaded', addInventory);

function getPlaces(){

firebase.firestore().collection("places").get().then(response => { 
  let docs = response.docs.map(x => ({ 
         id: x.id, 
         name: x.data().name, 
         parts:  x.data().parts && x.data().parts.map(part => part.id) 
  })); 
  let places = [];
  for (let i = 0; i < docs.length; i++){ 
    places.push(stack = {
      id: docs[i]['id'],
      name: docs[i]['name']
    });
  }

  let select = document.createElement('select');
  select.id = 's1';
  for(let k = 0; k < places.length; k++){
    let place = document.createElement('option');
    place.setAttribute("value", `${places[k].id}`);
    place.textContent = `${places[k].name}`;
    select.appendChild(place);
  }
document.querySelector('#places-list').appendChild(select);
});
}

// **************************************************
// **************************************************
// **************************************************




// **************************************************
//Изменение оборудования 
// **************************************************
function editInventory(){
  
  let content = document.querySelector('.content');
  let currentId = '';
  let currentPlace = '';
  content.onclick = function (event) {
    if (event.target.classList.contains('editButton')) {
      currentId = event.target.id;
      let td = document.getElementById(currentId);
      currentPlace = td.getAttribute("class");
      document.querySelector('.modal2').classList.add('modal2-show');
        //darken.addEventListener('click', closeModal2);
      document.getElementById('inputName2').value = document.getElementById(currentId).textContent;
      document.getElementById('inputCount2').value = document.getElementById(`${currentId}count`).textContent;
      document.getElementById('inputCount2').value = document.getElementById(`${currentId}count`).textContent;

    }else if(event.target.classList.contains('close-modal2')){
        //darken.addEventListener('click', closeModal2);
      document.querySelector('.modal2').classList.remove('modal2-show');
      let inputName = document.getElementById('inputName2').value;
      let inputCount = document.getElementById('inputCount2').value;
      if (Number.isInteger(inputCount/1) && (inputCount !== '') && (inputName !== '')){
        editInventoryItem(inputName, inputCount, currentId, currentPlace);
        document.getElementById('inputName2').value = '';
        document.getElementById('inputCount2').value = '';
      }else{
        alert('Введены некорректные данные');
        document.getElementById('inputName').value = '';
        document.getElementById('inputCount').value = '';     
      }
    }

}
  
}
function editInventoryItem(inputName, inputCount, a, currentPlace){
  let filestore = firebase.firestore();
  filestore.collection("inventory").doc(a).set({ 
    name: inputName, 
    count: inputCount, 
    place: filestore.collection("places").doc(currentPlace) // main-101 – id места
}).then(() => {
    window.location.reload();
    console.info("Done");
});

}





function openModal2() {
  //darken.classList.add('darken-show')
  //btn.classList.add('btn-hide')
  modal.classList.add('modal2-show')
}

function closeModal2() {
  //darken.classList.remove('darken-show')
  //btn.classList.remove('btn-hide')
  modal.classList.remove('modal2-show')
}
document.addEventListener('DOMContentLoaded', editInventory);




// **************************************************
// **************************************************
// **************************************************
