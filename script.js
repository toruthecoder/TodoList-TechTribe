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
        h2Span.dataset.fulltext = inputText
        const limit = 18;
        h2Span.innerText = inputText.length > limit ? inputText.slice(0, limit) + '...' : inputText
        console.log(`I am from edit addinput`, h2Span)
        updateBtnState(edit)
        if (delBtn) delBtn.disabled = false
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
    console.log(checktext)

    let listItem = `
                <li class='item font-[400] font-normal text-[40px] leading-[100%] tracking-0 flex flex-row items-start justify-between mt-[20px] w-[735px]  wrap-break-word text-white border bg-white/10 backdrop-blur-[32px] rounded-[85px] shadow-xl border border-white/20 p-2 px-10' style="font-family: 'Baloo Tammudu 2', sans-serif;">
                    <h2 class='h2item flex item-start justify-center mt-4 gap-3'>
                       <span class="task-text cursor-pointer text-[26px] max-w-[477px] w-full break-words block">${checktext}</span>
                    </h2>
                    <div class='flex items-center justify-center mt-[10px] gap-2'>
                        <input type="checkbox" class='inputCheck cursor-pointer w-[18px] h-[18px] mt-2 appearance-none rounded-lg bg-white'  ${ischecked ? 'checked' : ''}>
                        <button class="delBtn cursor-pointer">
                            <img src='assests/trash-solid-full.svg' class='w-[30px]'>
                        </button>
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
    span.dataset.fulltext = text
    // This is for when page reload the line through will still remian
    if (ischecked) {
        if (span) {
            span.classList.add('strike')
        } else {
            span.classList.remove('strike')
        }
    }

    if (text.length > charcterLimit) {
        let showMoreBtn = `
            <span class='showmore text-[14px] text-white underline cursor-pointer hover:text-gray-300 w-[90px]'>Show More</span>
        `
        h2.insertAdjacentHTML('beforeend', showMoreBtn);

        const showmoreBtn = newLi.querySelector('.showmore');
        showmoreBtn.addEventListener('click', () => {
            checkButtonState(span, span.dataset.fulltext, showmoreBtn);
        })
    }

    // Remove the list when click on delete button
    deleteBtn.addEventListener('click', (e) => {
        if (deleteBtn) {
            e.stopPropagation()
            confirmation(newLi)
        }
    })

    // If click on text or li the text will go into the textfield
    h2.addEventListener('click', (e) => {
        console.log('clicked i am h2');
        const span = e.target.closest('.task-text')
        if (!span) return;
        console.log(`bla bla`, span);
        input.value = span.dataset.fulltext;
        console.log(`From h2 event listener `, input.value)
        // Now when the user edit the text and enter the text goes back to the edited li
        edit = newLi
        deleteBtn.disabled = true
        addBtn.textContent = 'Update';
        input.focus();
        setLocalList()
        if (edit === null) deleteBtn.disabled = false
    })

    // Check if the user has checked the checkbox or not
    checkBox.addEventListener('change', (e) => {
        console.log(e.target)
        const checkh2 = e.target.closest('.item').querySelector('span')
        if (e.target.checked) {
            checkh2.classList.add('strike');
        } else {
            checkh2.classList.remove('strike');
        } setLocalList()
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
            text: item.querySelector('.task-text').dataset.fulltext,
            checked: item.querySelector('input.inputCheck').checked,
        })
    })
    localStorage.setItem('List', JSON.stringify(data));
    console.log(`data from setLocal`, data)
}

// this is a function for getting the data on page load
function getLocalList() {
    const data = JSON.parse(localStorage.getItem('List'));
    console.log(`This is data from getLocal`, data)
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
    const limit = 18;
    const li = span.closest('.item');
    const checkbox = li.querySelector('.inputCheck');

    const currentText = span.innerText === text;

    if (currentText) {
        span.innerText = text.slice(0, limit) + '...';
        btnmoreless.textContent = 'Show More';
        span.style.textDecoration = '';
        if (checkbox.checked) {
            span.classList.add('strike');
        }
    } else {
        span.innerText = text;
        btnmoreless.textContent = 'Show Less';
        span.classList.remove('strike');
        if (checkbox.checked) {
            span.style.textDecoration = 'line-through';
        }
    }
}
//push

// Function for checking if the user has convert a too big text in
//  to the limit or too small text that exceeds the limit
// for showmore btn to disappear and appear

function updateBtnState(editLi) {
    const limit = 18;
    const span = editLi.querySelector('.task-text');
    const h2 = editLi.querySelector('h2');
    let showMoreBtn = editLi.querySelector('.showmore');

    // the btn will go away if the text is too short
    if (span.dataset.fulltext.length <= limit) {
        if (showMoreBtn) showMoreBtn.remove()
        span.innerText = span.dataset.fulltext;
        return
    }

    // Add button if missing
    if (!showMoreBtn) {
        showMoreBtn = document.createElement('span');
        showMoreBtn.className = 'showmore text-[14px] text-white underline cursor-pointer w-[90px]';
        showMoreBtn.textContent = 'Show More';
        h2.appendChild(showMoreBtn);

        showMoreBtn.addEventListener('click', () => {
            checkButtonState(span, span.dataset.fulltext, showMoreBtn);
        })
    }
}

// function for loader on load

function loader() {
    const loader = document.querySelector('.loader')
    const goo = document.querySelector('.goo')

    if (loader && goo) {

        goo.style.display = 'block';
        loader.style.display = 'block';

        setTimeout(() => {
            goo.style.display = 'none';
            loader.style.display = 'none';
        }, 5000)
    } else {
        console.log(`loader error`)
    }
}

function confirmation(newLi) {
    let noti = document.querySelector('.noti')
    let notifica = document.querySelector('.get');

    noti.style.display = 'block'
    notifica.style.display = 'block'

    let yesBtn = document.querySelector('.yesBtn');
    yesBtn.addEventListener('click', () => {
        newLi.remove()
        setLocalList()
        noti.style.display = 'none'
        notifica.style.display = 'none'
    })

    let noBtn = document.querySelector('.noBtn');
    noBtn.addEventListener('click', () => {
        noti.style.display = 'none'
        notifica.style.display = 'none'
    })
}


// Handle Event Listeners
addBtn.addEventListener('click', AddInput);
// Function for updating local storage
window.addEventListener('load', getLocalList);


// Timeout function 
window.addEventListener('load', loader)

// Calling the select component from html
const filterSelect = document.querySelector('#select');
// Adding event listener on it that on change filter the items
filterSelect.addEventListener('change', (e) => {
    filterItems(e.target.value);
})




