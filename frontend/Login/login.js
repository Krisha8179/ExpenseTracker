async function login(event){
    try{
    event.preventDefault();
    const Email = event.target.Email.value;
    const Password = event.target.Password.value;
    const loginDetails = {
        Email,
        Password
        }
    const response = await axios.post("http://Localhost:3000/user/login",loginDetails) 
    if(response.status === 200){
        alert(response.data.message) 
        localStorage.setItem('token', response.data.token)
        window.location.href = "../expense/expense.html"
    } 
    }catch(error)
    {
        console.log(JSON.stringify(error))
       document.body.innerHTML += `<div style="color:red;">${error.message}</div>`; 
    }
    
}

document.getElementById('forgot-password').onclick = async function (e) {
    try{
        window.location.href = "../forgotPassword/form.html"
    }catch(err){
        console.log(err);
    }
}