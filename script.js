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
        // Calling the btn from edit to change the state to false
        const li = edit.closest('.item');
        const delBtn = li.querySelector('.delBtn')
        if (delBtn) {
            delBtn.disabled = false
        }
        edit.innerText = inputText;
        input.value = '';
        addBtn.textContent = 'Add';
        edit = null;
        setLocalList()
    } else {
        // Turn the value into list
        List(inputText)
        input.value = '';
        setLocalList()
    }
}

const List = (text, ischecked = false) => {
    // Creating li

    let listItem = `
                <li class='item font-[400] font-normal text-[40px] leading-[100%] tracking-0 cursor-pointer flex flex-row items-center justify-between mt-[24px] w-[735px] h-[78px] wrap-break-word text-black border bg-white/10 backdrop-blur-[32px] rounded-[85px] shadow-xl border border-white/20 p-8 wrap-break-word' style="font-family: 'Baloo Tammudu 2', sans-serif;">
                    <h2 class='item-center justify-center mt-4'>
                       <span class="task-text">${text}</span>
                    </h2>
                    <div class='flex items-center'>
                        <input type="checkbox" class='inputCheck'  ${ischecked ? 'checked' : ''}>
                        <button class='delBtn cursor-pointer'><img src="assests/Trash.svg" alt="trash" class='w-[60px] h-[42px]'></button>
                    </div>
                </li>
    `

    list.insertAdjacentHTML('beforeend', listItem);

    const newLi = list.lastElementChild;
    const h2 = newLi.querySelector('h2');
    const deleteBtn = newLi.querySelector('.delBtn');
    const checkBox = newLi.querySelector('.inputCheck');

    // This is for when page reload the line through will still remian
    if (ischecked) {
        h2.style.textDecoration = 'line-through';
    }

    // Remove the list when click on delete button
    deleteBtn.addEventListener('click', () => {
        newLi.remove();
        setLocalList();
    })

    // If click on text or li the text will go into the textfield
    h2.addEventListener('click', (e) => {
        console.log('clicked');
        if (e.target.classList.contains('task-text')) {
            const litext = e.target.textContent;
            console.log(litext);
            input.value = litext;
            // Now when the user edit the text and enter the text goes back to the edited li
            edit = h2
            deleteBtn.disabled = true
            addBtn.textContent = 'Update';
            input.focus();
            setLocalList()
            if (edit === null) deleteBtn.disabled = false
        }
    })



    // Check if the user has checked the checkbox or not
    checkBox.addEventListener('change', (e) => {
        console.log(e.target)
        const checkh2 = e.target.closest('.item').querySelector('h2')
        checkh2.style.textDecoration = e.target.checked ? 'line-through' : 'none'
        setLocalList()
    })
}

// Function for storing data to the local storage
function setLocalList() {
    const data = [];
    const liList = document.querySelectorAll('li.item');
    // This checks if the length of the array of objects is 0 in local storage remove it
    if (liList.length === 0) {
        localStorage.removeItem('List')
        return
    }
    liList.forEach((item) => {
        data.push({
            text: item.querySelector('h2').innerText,
            checked: item.querySelector('input.inputCheck').checked,
        })
        localStorage.setItem('List', JSON.stringify(data));
    })
}

// this is a function for getting the data on page load
function getLocalList() {
    const data = JSON.parse(localStorage.getItem('List'));
    if (data) {
        data.forEach((item) => { List(item.text, item.checked) })
    }
}

// Function for filtering list
function filterItems(type) {
    const items = document.querySelectorAll('li.item');
    items.forEach((item) => {
        const checkbox = item.querySelector('input.inputCheck');

        if (type === 'all') {
            item.style.display = 'flex';
        } else if (type === 'complete') {
            item.style.display = checkbox && checkbox.checked ? 'flex' : 'none';
        } else if (type === 'incomplete') {
            item.style.display = checkbox && !checkbox.checked ? 'flex' : 'none';
        }
    })
}

// Handle Event Listeners
addBtn.addEventListener('click', AddInput);
// Function for updating local storage
window.addEventListener('load', getLocalList);

// Calling the select component from html
const filterSelect = document.querySelector('#select');
// Adding event listener on it that on change filter the items
filterSelect.addEventListener('change', (e) => {
    filterItems(e.target.value);
})