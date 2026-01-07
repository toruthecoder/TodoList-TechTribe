// Fetching Html 
const input = document.querySelector('.input');
const addBtn = document.querySelector('.addBtn');
const list = document.querySelector('.list ul');

// Variables
// Create edit state so the edit data store in this
let edit = null;

// Functions
const AddInput = () => {
    // Get the input value
    let inputText = input.value.trim();
    console.log(inputText);

    // Check if the input is 0 if it is dont take input
    if (inputText === '') {
        return console.log('textfiled empty');
    }

    // If edit is being done use this block of code if not use this else block of code 
    if (edit) {
        edit.innerText = inputText;
        input.value = '';
        addBtn.textContent = 'Add';
        edit = null;
        togglebtn()
    } else {
        // Turn the value into list
        List(inputText)
        input.value = '';
    }
}

const List = (text) => {
    // Creating li
    const li = document.createElement('li');
    li.className = 'item';

    // Creating h1 
    const h2 = document.createElement('h2');
    h2.innerText = text;
    h2.style.cursor = 'pointer';
    li.appendChild(h2)

    // Checkbox
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.className = 'inputCheck';
    li.appendChild(checkBox);

    // Creating Delete Btn
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delBtn';
    li.appendChild(deleteBtn);

    list.appendChild(li);

    // Remove the list when click on delete button
    deleteBtn.addEventListener('click', () => {
        li.remove();
    })

    // If click on text or li the text will go into the textfield
    h2.addEventListener('click', (e) => {
        console.log('clicked');
        if (e.target) {
            const litext = e.target.textContent;
            console.log(litext);
            input.value = litext;
            // Now when the user edit the text and enter the text goes back to the edited li
            edit = h2
            addBtn.textContent = 'Update';
            input.focus();
            togglebtn()
        }
    })

    // Check if the user has checked the checkbox or not
    checkBox.addEventListener('click', (e) => {
        console.log(e.target)
        const checkh2 = e.target.closest('.item').querySelector('h2')
        if (e.target.checked) {
            checkh2.style.textDecoration = 'line-through'
        } else {
            checkh2.style.textDecoration = 'none';
        }
    })
}

// This function is for when user is editing the text disable the button and when the user is not editing the text enable the button
function togglebtn() {
    let delbtn = document.querySelector('.delBtn');
    if (input.value === '') {
        delbtn.disabled = false
    } else {
        delbtn.disabled = true
    }
}

// Handle Event Listeners
addBtn.addEventListener('click', AddInput);