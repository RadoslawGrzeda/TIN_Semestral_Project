const UserModule = {
    async usersList() {
    const data = await ApiService.get('/users');
    let html = `<h3>Lista Uproszczona (Users)</h3><table><tr><th>Login</th><th>Email</th><th>Date of Birth</th></tr>`;
        data.forEach(u => html += `<tr><td>${u.username}</td><td>${u.email}</td><td>${u.date_of_birth}</td></tr>`);
        document.getElementById('display-area').innerHTML = html + "</table>";
    },
    async detailUserList(){
        const data = await ApiService.get('/users/showAllRelations');
        let html = `<h3>Lista Szczegółowa (Users)</h3>`;
        if(!data || data.length === 0){
            document.getElementById('display-area').innerHTML = '<p>Brak użytkowników</p>';
            return;
        }

        data.forEach(u => {
            html += `<div class="user-card">`;
            html += `<h4>${u.username} (ID: ${u.id})</h4>`;
            html += `<p><strong>Email:</strong> ${u.email} &nbsp; <strong>Data urodzenia:</strong> ${u.date_of_birth} &nbsp; <strong>Rola:</strong> ${u.role}</p>`;

            if(u.rentals && u.rentals.length > 0){
                html += `<details><summary>Wypożyczenia (${u.rentals.length})</summary><ul>`;
                u.rentals.forEach(r => {
                    const car = r.car || {};
                    html += `<li>Rezerwacja ID ${r.id}: ${r.rental_start} → ${r.rental_end ?? 'aktualne'} — Samochód: ${car.brand ?? '—'} ${car.model ?? ''} (ID: ${car.id ?? '—'})</li>`;
                });
                html += `</ul></details>`;
            } else {
                html += `<p><em>Brak wypożyczeń</em></p>`;
            }

            html += `</div>`;
        });

        document.getElementById('display-area').innerHTML = html;
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
                password:document.getElementById('password').value
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