async function signup(event){
        try{
        event.preventDefault();
        const Name = event.target.Name.value;
        const Email = event.target.Email.value;
        const Password = event.target.Password.value;
        const signupDetails = {
            Name,
            Email,
            Password
            }
        const response = await axios.post("http://Localhost:3000/user/signup",signupDetails) 
        if(response.status=== 201){
            window.location.href = "../Login/login.html"
        }
        else{
            throw new Error('Failed to login')
        }  
        }catch(error)
        {
           document.body.innerHTML += `<div style="color:red;">${error}</div>`; 
        }
        
    }
