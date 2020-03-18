//Select Elements
const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");
const authForm = document.getElementById("authForm");
const passwordInput = document.getElementById("passwordInput");
const authSection = document.querySelector(".auth");

//Varibles
let LIST = [];
let id = 1;
let isAuth = false;

// get items from JSON file
function getData() {
    fetch('./json/todos.json')
        .then(res => res.json())
        .then(data => {
            //check if is not empty
            if (data != null) {
                // LIST = JSON.parse(data);
                LIST = data;
                id = LIST.length + 1;
                loadList(LIST);
                updateAllTodos(LIST)
            } else {
                //if data isn't empty
                LIST = [];
                id = 1;
            }
        });

}

//Application startup point
if (!isAuth) {
    authForm.addEventListener('submit', (e) => {
        e.preventDefault()
        if (md5(passwordInput.value) == '0f23e56a734b09d93e72d7857a593bba') {
            authSection.classList.remove('active')
            getData()
        } else {
            passwordInput.value = ''
            passwordInput.focus()
        }
    })
}

//load items to the user's interface
function loadList(array) {
    array.forEach(item => {
        addToDo(item.name, item.id, item.done, item.trash)
    });
}

//clear the local storeg
clear.addEventListener("click", function () {
    location.reload();
});

//Classes Names
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

// Show to days date
const options = {
    weekday: "long",
    month: "short",
    day: "numeric"
};
const today = new Date();
dateElement.innerHTML = today.toLocaleDateString("en-US", options);

//Add to do function
function addToDo(toDo, id, done, trash) {
    if (trash) {
        return;
    }
    const CHECK = "fa-check-circle";
    const UNCHECK = "fa-circle-thin";
    const DONE = done ? CHECK : UNCHECK;
    const LINE_THROUGH = "lineThrough";
    const LINE = done ? LINE_THROUGH : "";

    const item = `
        <li class="item">
            <i class="fa ${DONE} co" job="complete" id="${id}"></i>
            <p class="text ${LINE}"> ${toDo} </p>
            <i class="fa fa-trash-o de" job="remove" id="${id}"></i>
        </li>
    `;
    const position = "beforeend";
    list.insertAdjacentHTML(position, item);
}

//add an item to the list when user press enter key
document.addEventListener("keyup", function (e) {
    if (e.keyCode == 13) {
        const toDOText = input.value;

        //if the input isn't empty
        if (toDOText) {
            addToDo(toDOText, id, false, false);
            LIST.push({
                name: toDOText,
                id: id,
                done: false,
                trash: false
            });
            //add item to the local storeg
            updateAllTodos(LIST)

            id++;
        }
        input.value = "";
    }
});

//Compete to do 
function completeToDo(e) {
    e.classList.toggle(CHECK);
    e.classList.toggle(UNCHECK);
    e.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    let item = LIST.find(item => item.id == e.id)
    item.done = item.done ? false : true;
}

//Remove to do
function removeToDO(e) {
    let item = LIST.find(item => item.id == e.id)
    e.parentNode.parentNode.removeChild(e.parentNode)
    item.trash = true;
}

//Event Listener For Delete or Complete
list.addEventListener("click", function (e) {
    const element = e.target;
    const elementJob = element.attributes.job.value;

    if (elementJob == "complete") {
        completeToDo(element);
    } else if (elementJob == "remove") {
        removeToDO(element);
        //fliter th elist
        LIST = LIST.filter(todo => todo.trash == false)
    }
    //add item to the local storeg
    updateAllTodos(LIST)
});

//post data to php file
function addToDoToJSONFile(text, id, done = false, trash = false) {
    const form = new FormData()
    form.append('name', text)
    form.append('id', id)
    form.append('done', done)
    form.append('trash', trash)

    fetch('./php/add-to-json.php', {
            method: 'post',
            body: form,
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
        .catch(err => {
            console.log(err)
        })
}

function updateAllTodos(list) {
    let data = JSON.stringify(list)

    const form = new FormData()
    form.append('todoList', data)
    fetch('./php/add-to-json.php', {
            method: 'post',
            body: form,
        })
        .then(res => res.text())
        .catch(err => {
            console.log(err)
        })
}