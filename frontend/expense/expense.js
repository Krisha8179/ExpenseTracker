
async function saveDetails(event){
    try{
    event.preventDefault();
    const amount = event.target.amount.value;
    const description = event.target.description.value;
    const category = event.target.category.value;
    const obj = {
        amount,
        description,
        category
    }
    const token = localStorage.getItem('token');
    const postResponse = await axios.post("http://Localhost:3000/expense/add-expense",obj,{ headers: {"Authorization" : token}})
        showOnScreen(postResponse.data.newExpense);
    }
    catch(err)
    {
        console.log(err);
    }
}

function showPremiumuserMessage(){
    document.getElementById('rzp-button').style.visibility="hidden";
    const childelement = '<div><h3>you are a premium user</h3></div>'
    document.getElementById('message').innerHTML += childelement;
}

function showLeaderBoard() {
    const leaderboardButton = '<button id="leaderboardButton">Show LeaderBoard</button>'
    document.getElementById('message').innerHTML += leaderboardButton;
    document.getElementById('leaderboardButton').onclick = async() => {
        try{
        console.log('you hit the button')
        const token = localStorage.getItem('token')
        const userLeaderBoardArray = await axios.get('http://Localhost:3000/premium/feature',{ headers: {"Authorization" : token}})
        console.log(userLeaderBoardArray)
        const parentElement = document.getElementById('leaderboard-details')
        const parent = `<div>
                            <p><h1>Leaderboard</h1></p>
                            <table>
                                <thead>
                                    <tr>
                                        <td>Name</td>
                                        <td>Toatal expenses</td>

                                    </tr>
                                </thead>
                                <tbody id="leaderboard">

                                </tbody>
                            </table>
                        </div>`
        parentElement.innerHTML = parent;
        leaderboardElement = document.getElementById('leaderboard')
        userLeaderBoardArray.data.forEach((userDetails) => {
            leaderboardElement.innerHTML += `<tr>
                                                <td>${userDetails.Name}</td>
                                                <td>${userDetails.totalCost}</td>
                                             </tr>`
            
        })
    }catch(err){
        console.log(err);
    }
}
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded", async () => {
    try{
        const token = localStorage.getItem('token')
        const decodedToken = parseJwt(token)
        console.log(decodedToken)
        const ispremium = decodedToken.ispremiumuser
        if(ispremium){
            showPremiumuserMessage()
            showLeaderBoard();
        }
        
    }
    catch(err)
    {
        console.log(err)
    }
})


const page = 1;
async function numberOfRows(){

        const parentElem = document.getElementById('expenses');
        parentElem.innerHTML = ''

        const token = localStorage.getItem('token')
        const limit = document.getElementById('numberOfRows').value
        console.log('number of rows: ',limit)
        const getResponse = await axios.get(`http://Localhost:3000/expense/get-expenses?page=${page}&limit=${limit}`, { headers: {"Authorization" : token}})
        console.log(getResponse.data.allExpenses);
        for(let i=0;i<getResponse.data.allExpenses.length;i++){
             showOnScreen(getResponse.data.allExpenses[i])
        }
        showPagination(getResponse.data);

function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage
}){
    const pagination = document.getElementById('pagination')
    pagination.innerHTML = ''
 
    if(hasPreviousPage){
        const btn2 = document.createElement('button');
        btn2.innerHTML = previousPage
        btn2.addEventListener('click', () => getExpenses(previousPage))
        pagination.appendChild(btn2)
    }

        const btn1 = document.createElement('button');
        btn1.innerHTML = `<h3>${currentPage}</h3>`
        btn1.addEventListener('click', () => getExpenses(currentPage))
        pagination.appendChild(btn1)

    if (hasNextPage){
        const btn3 = document.createElement('button');
        btn3.innerHTML = nextPage
        btn3.addEventListener('click', () => getExpenses(nextPage))
        pagination.appendChild(btn3)
    }

}

async function getExpenses(page){
    try{
        const token = localStorage.getItem('token')
        const parentElem = document.getElementById('expenses');
        let limit = document.getElementById('numberOfRows').value
        parentElem.innerHTML = ''

        document.getElementById('numberOfRows').value = limit
        limit = document.getElementById('numberOfRows').value
        const getResponse = await axios.get(`http://Localhost:3000/expense/get-expenses?page=${page}&limit=${limit}`,{ headers: {"Authorization" : token} })
        for(let i=0;i<getResponse.data.allExpenses.length;i++){
            showOnScreen(getResponse.data.allExpenses[i])
       }
       showPagination(getResponse.data);


    }catch(err){
        console.log(err);
    }
}
}


function showOnScreen(obj){

    document.getElementById('amount').value=''
    document.getElementById('description').value=''
    document.getElementById('category').value=''

    const parentElem = document.getElementById('expenses');
    
    const childElem = `<tr id=${obj.id}>
                            <td>${obj.description}</td>
                            <td>${obj.amount}</td>
                            <td>${obj.category}</td>
                            <td><button onclick=deleteExpense('${obj.id}')>delete</button></td>
                            <td><button onclick=editExpense('${obj.id}','${obj.description}','${obj.amount}','${obj.category}')>edit</button></td>
                       </tr>`

    parentElem.innerHTML = parentElem.innerHTML+childElem;
    
}

async function deleteExpense(expenseId){
    try{
        const token = localStorage.getItem('token');
        const deleteResponse = await axios.delete(`http://Localhost:3000/expense/delete-expense/${expenseId}`,{ headers: {"Authorization" : token}})
        removeExpenseFromScreen(expenseId)
    }
    catch(err) 
    {
        console.log(err)
    }
}

function removeExpenseFromScreen(expenseId){
    const parentNode = document.getElementById('expenses')
    const chilTobeDeleted = document.getElementById(expenseId)
    if(chilTobeDeleted){
        parentNode.removeChild(chilTobeDeleted)
    }
}

function editExpense(expenseId,description,amount,category){
    document.getElementById('amount').value= amount
    document.getElementById('description').value= description
    document.getElementById('category').value= category
    
    deleteExpense(expenseId);
    
}

async function download(){
    try{
    const token = localStorage.getItem('token');
    const response = await axios.get('http://Localhost:3000/user/download', { headers: {"Authorization" : token} })
    if(response.status === 200){
        let a = document.createElement("a");
        a.href = response.data.fileUrl;
        a.download = 'myexpense.csv';
        a.click();
        console.log(response.data.previousDownloadedFiles)
        document.getElementById('previousDownloads').innerHTML = '<h1>Previous downloads</h1>'
        response.data.previousDownloadedFiles.forEach((element) => {
            let link = document.createElement("a");
            link.innerHTML = response.data.fileUrl;
            link.href = element.fileUrl;
            let li = document.createElement("li")
            li.appendChild(link)
            document.getElementById('previousDownloads').appendChild(li);
            a.download = 'myexpense.csv';
            a.click();
            
        })

    } else {
        throw new Error(response.data.message)
    }
    }catch(err){
        console.log(err);
    }
}



document.getElementById('rzp-button').onclick = async function (e) {
    try{
        const token = localStorage.getItem('token')
        const response = await axios.get('http://Localhost:3000/purchase/premiummembership',{ headers: {"Authorization" : token}})
        console.log(response);
        var options = 
        {
            "key": response.data.key_id,
            "order_id": response.data.order.id,
            "handler": async function (response) {
                const Res = await axios.post("http://Localhost:3000/purchase/updatetransactionstatus",{
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                }, { headers: {"Authorization" : token}})
    
                alert('You are a premium user now')
                document.getElementById('rzp-button').style.visibility="hidden";
                showPremiumuserMessage()
                localStorage.setItem('token', Res.data.token)
                showLeaderBoard();

            }
        }
        const rzpl = new Razorpay(options);
        rzpl.open();
        e.preventDefault();
    
        rzpl.on('payment failed', function (response){
            console.log(response)
            alert('something went wrong')
        })

    }catch(err){
        console.log(err);
    }
}

document.getElementById('logout').onclick = async function (e) {
    try{
        localStorage.clear();
        window.location.href = "../Login/login.html"
    }catch(err) {
        console.log(err);
    }
}