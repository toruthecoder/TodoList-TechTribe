// Fetching Html 
const input = document.querySelector('.input');
const addBtn = document.querySelector('.addBtn');
const list = document.querySelector('.list ul');

// Variables
// Create edit state so the edit data store in this
let edit = null;

// Functions
const AddInput = () => {
    let inputText = input.value.trim();
    console.log(inputText);

    if (inputText === '') {
        return console.log('textfiled empty');
    }

    if (edit) {
        const h2Span = edit.querySelector('.task-text');
        console.log(h2Span)
        const delBtn = edit.querySelector('.delBtn')
        if (delBtn) {
            delBtn.disabled = false
        }
        h2Span.innerText = inputText
        input.value = '';
        addBtn.textContent = 'Add';
        edit = null;
        setLocalList()
    } else {
        // Turn the value into lilist
        List(inputText)
        input.value = '';
        setLocalList()
    }
}

const List = (text, ischecked = false) => {
    // Creating li
    const charcterLimit = 18;
    const checktext = text.length > charcterLimit ? text.slice(0, charcterLimit) + '...' : text;


    let listItem = `
                <li class='item font-[400] font-normal text-[40px] leading-[100%] tracking-0 flex flex-row items-start justify-between mt-[24px] w-[735px] min-h-[78px] wrap-break-word text-black border bg-white/10 backdrop-blur-[32px] rounded-[85px] shadow-xl border border-white/20 p-8' style="font-family: 'Baloo Tammudu 2', sans-serif;">
                    <h2 class='h2item flex item-start justify-center mt-4'>
                       <span class="task-text cursor-pointer w-[477px] break-words block data-fulltext="${text}">${checktext}</span>
                    </h2>
                    <div class='flex items-center justify-center'>
                        <input type="checkbox" class='inputCheck cursor-pointer'  ${ischecked ? 'checked' : ''}>
                        <button class='delBtn cursor-pointer'><img src="assests/Trash.svg" alt="trash" class='w-[60px] h-[42px]'></button>
                    </div>
                </li>
    `

    // whitespace-nowrap overflow-hidden text-ellipsis max-w-ch-100

    list.insertAdjacentHTML('beforeend', listItem);

    const newLi = list.lastElementChild;
    const h2 = newLi.querySelector('h2');
    const deleteBtn = newLi.querySelector('.delBtn');
    const checkBox = newLi.querySelector('.inputCheck');
    const span = newLi.querySelector('.task-text')

    // This is for when page reload the line through will still remian
    if (ischecked) {
        h2.style.textDecoration = 'line-through';
    }

    if (text.length > charcterLimit) {
        let showMoreBtn = `
            <span class='showmore text-[20px] py-[10px] text-white underline cursor-pointer'>Show More</span>
        `
        h2.insertAdjacentHTML('beforeend', showMoreBtn);

        const showmoreBtn = newLi.querySelector('.showmore');
        showmoreBtn.addEventListener('click', () => {
            checkButtonState(span, text, showmoreBtn);
        })
    }

    // Remove the list when click on delete button
    deleteBtn.addEventListener('click', () => {
        newLi.remove();
        setLocalList();
    })

    // If click on text or li the text will go into the textfield
    h2.addEventListener('click', (e) => {
        console.log('clicked i am h2');
        const span = e.target.closest('.task-text')
        if (!span) return;
        console.log(`bla bla`);
        input.value = span.innerText;
        // Now when the user edit the text and enter the text goes back to the edited li
        edit = newLi
        deleteBtn.disabled = true
        addBtn.textContent = 'Update';
        input.focus();
        setLocalList()
        if (edit === null) deleteBtn.disabled = false
    }
    )

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
            text: item.querySelector('.task-text').innerText,
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


// Check if the item has more than 25 character show (show more / less)
function checkButtonState(span, text, btnmoreless) {
    const limit = 25;
    let currentText = span.innerText;

    if (currentText === text) {
        span.innerText = text.slice(0, limit) + '...';
        btnmoreless.textContent = 'Show More';
        console.log(`I am the show More button`);
    } else {
        span.innerText = text;
        btnmoreless.textContent = 'Show Less';
        console.log(`I am the show less button`);
    }
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