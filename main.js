const amount = document.getElementById('amount');
const description = document.getElementById('description');
const category = document.getElementById('category');
const expenseList = document.getElementById('expense-list');
const endpointId = 'bd4cea8ece944937bc265d22f59b977a';
const serverLink = `https://crudcrud.com/api/${endpointId}/expense`;

addEventListener('DOMContentLoaded', () => {
    [...document.getElementsByClassName('option')].forEach(option => {
        option.addEventListener('click', (e) => {
            category.textContent = option.textContent;
        })
    });

    const getData = async () => {
        try{
            const res = await axios.get(serverLink);
            const expenseJSON = res.data;
            for(let i=0; i<expenseJSON.length; i++){
                expenseList.appendChild(createLi(expenseJSON[i]));
            }
        }catch(err){
            console.log(err);
        }
    };
    getData();
});

document.getElementById('form').addEventListener('submit', addExpense);

function addExpense(e){
    e.preventDefault();
    const expense = {
        amount: amount.value,
        description: description.value,
        category: category.textContent
    }
    if(isInputsMissing(expense)){
        return;
    }    
    expenseList.appendChild(createLi(expense));

    const postData = async () => {
        try{
            const res = await axios.post(serverLink, expense);
            console.log(res);
        }catch(err){
            console.log(err);
        }
    }
    postData();

    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    category.textContent = 'Categories';
}

function createLi(expense) {
    const textContent = `${expense.amount}-${expense.category}-${expense.description}`;    
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(textContent));
    li.setAttribute('id', expense._id);
    li.appendChild(createDeleteButton());
    li.appendChild(createEditButton());
    return li;
}

function createDeleteButton(){
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Expense';
    deleteButton.classList.add('del');
    deleteButton.classList.add('btn');
    deleteButton.classList.add('btn-danger');
    deleteButton.addEventListener('click', deleteLi);
    return deleteButton;
}

function createEditButton(){
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit Expense';
    editButton.classList.add('edit');
    editButton.classList.add('btn');
    editButton.classList.add('btn-warning');
    editButton.addEventListener('click', editLi);
    return editButton;
}

function deleteLi(e) {
    const textContent = e.path[1].textContent.slice(0, -26).split("-");
    const expense = {
        amount: textContent[0],
        description: textContent[2],
        category: textContent[1]
    }
    
    const deleteData = async () => {
        try{
            const res = await axios.delete(`${serverLink}/${e.path[1].id}`);
            console.log(res);
        }catch(err){
            console.log(err);
        }
    };
    deleteData();
    e.path[1].remove();
    return expense;
}

function editLi(e) {
    const expense = deleteLi(e);
    amount.value = expense.amount;
    description.value = expense.description;
    category.textContent = expense.category;
}

function isInputsMissing(expense){
    let missingInputs = document.getElementById('missing-inputs');
    missingInputs.textContent = '';
    if(expense.amount === ''){
        missingInputs.textContent += 'Amount is missing.';
    }
    if(expense.description === ''){
        missingInputs.textContent += ' Description is missing.';
    }
    if(expense.category === 'Categories'){
        missingInputs.textContent += ' Choose a category.';
    }
    if(missingInputs.textContent == ''){
        return false;
    }
    return true;
}