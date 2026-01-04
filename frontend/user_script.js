const UserModule = {
    async usersList() {
    const data = await ApiService.get('/users');
    let html = `<h3>Lista Uproszczona (Users)</h3><table><tr><th>ID</th><th>Login</th></tr>`;
        data.forEach(u => html += `<tr><td>${u.id}</td><td>${u.username}</td></tr>`);
        document.getElementById('display-area').innerHTML = html + "</table>";
    },
    async detailUserList(){
        const data=await ApiService.get('/users');
        let html=`<h3>Lista Szczegółowa (Users)</h3><table><tr><th>ID</th><th>Login</th><th>Email</th><th>Imię</th><th>Nazwisko</th></tr>`;
        data.forEach(u=>html+=`<tr><td>${u.id}</td><td>${u.username}</td><td>${u.email}</td><td>${u.first_name}</td><td>${u.last_name}</td></tr>`);
        document.getElementById('display-area').innerHTML=html+"</table>";
    },
    addUserForm(){
        const html =`
        <h3>Dodaj nowego uzytkownika</h3>
        <form id='add-user-form'>
        <label>Username: <input type='text' id='username' required></label><br>
        <label>Email: <input type='text' id='email' required></label><br>
        <label>date_of_birth: <input type='date' id='date_of_birth' required></label><br>
        <label>Password: <input type='text' id='password' required></label><br>
        <button type='submit'> Dodaj uzytkownika </button>
        </form>
        `;
        document.getElementById('display-area').innerHTML = html;
        document.getElementById('add-user-form').onsubmit= (e) => 
        {
            e.preventDefault();
            const userDate={
                username:document.getElementById('username').value,
                email:document.getElementById('email').value,
                date_of_birth:document.getElementById('date_of_birth').value,
                Password:document.getElementById('password').value
            };
            UserModule.addUser(userDate);

        };
        
    },
    async addUser(userData){
        try{
            await ApiService.post('/users/addUser',userData);
            alert('uzytkownikDodany');
            this.usersList()
        }catch (error){
            alert('Błąd podczas dodawania osoby: '+error.message);
        }
    }

}


    //  username=user.username,
    //     email=user.email,
    //     date_of_birth=user.date_of_birth,
    //     hashed_password=user.hashed_password,
    //     role=user.role