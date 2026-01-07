const UserModule = {
    async usersList() {
    const data = await ApiService.get('/users');
    let html = `<h3>Lista Uproszczona (Users)</h3><table><tr><th>Login</th><th>Email</th><th>Date of Birth</th><th>Akcje</th></tr>`;
        data.forEach(u => html += `<tr><td>${u.username}</td><td>${u.email}</td><td>${u.date_of_birth}</td><td><button onclick="UserModule.deleteUser(${u.id})">Usuń</button><button onclick="UserModule.modifyUserForm(${u.id})">Modyfikuj</button></td></tr>`);
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
        <span id="success-msg" style="color:green; font-weight:bold;"></span>
        <form id='add-user-form' novalidate>
            <label>Username: <input type='text' id='username' required></label><br>
            <span id="error-username" style="color:red; font-size:0.9em;"></span><br>

            <label>Email: <input type='email' id='email' required></label><br>
            <span id="error-email" style="color:red; font-size:0.9em;"></span><br>

            <label>Data urodzenia: <input type='date' id='date_of_birth' required></label><br>
            <span id="error-date_of_birth" style="color:red; font-size:0.9em;"></span><br>

            <label>Password: <input type='password' id='password' required></label><br>
            <span id="error-password" style="color:red; font-size:0.9em;"></span><br>

            <button type='submit'> Dodaj uzytkownika </button>
        </form>
        `;
        document.getElementById('display-area').innerHTML = html;
        document.getElementById('add-user-form').onsubmit= async (e) => 
        {
            
            e.preventDefault();

            const users=await ApiService.get('/users');

            

            
            document.querySelectorAll('span[id^="error-"]').forEach(el => el.innerText = '');
            let isValid = true;
            
            const username = document.getElementById('username').value;
            if(!/^[a-zA-Z0-9_]{6,30}$/.test(username)) {
                document.getElementById('error-username').innerText = "Username must be between 6 and 30 characters long, letters, digits, and _ only";
                isValid = false;
            }
            
            const dobVal = document.getElementById('date_of_birth').value;
            if(dobVal) {
                const dob = new Date(dobVal);
                const today = new Date();
                let age = today.getFullYear() - dob.getFullYear();
                const m = today.getMonth() - dob.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                    age--;
                }
                if(age < 18) {
                    document.getElementById('error-date_of_birth').innerText = "User must be at least 18 years old";
                    isValid = false;
                }
            }

            const pwd = document.getElementById('password').value;
            if(pwd.length < 8) {
                document.getElementById('error-password').innerText = "Password must be at least 8 characters long";
                isValid = false;
            }

            const email= document.getElementById('email').value;
            if(users.some(u => u.email === email)) {
                document.getElementById('error-email').innerText = "Email is already in use";
                isValid = false;
            }




            if(!isValid) return;

            const userDate={
                username:username,
                email:document.getElementById('email').value,
                date_of_birth:dobVal,
                password:pwd
            };
            UserModule.addUser(userDate);
        };
        
    },
    async deleteUser(userId){
        try{
            await ApiService.delete(`/users/deleteUser/${userId}`);
            alert('uzytkownik usuniety');
            this.usersList()
        }catch (error){
            alert('Błąd podczas usuwania osoby: '+error.message);
        }
    },
    async modifyUserForm(userId){
        try{
            const users=await ApiService.get('/users');
            const user=users.find(u=>u.id===userId);

            let html=`
            <h3>Modyfikuj uzytkownika</h3>
            <span id="mod-success-msg" style="color:green; font-weight:bold;"></span>
            <form id='modify-user-form'>
                <label>Username: <input type='text' id='mod-username' value="${user.username}" required></label><br>
                <span id="error-username" style="color:red; font-size:0.9em;"></span><br>

                <label>Email: <input type='email' id='mod-email' value="${user.email}" required></label><br>
                <span id="error-email" style="color:red; font-size:0.9em;"></span><br>

                <label>Data urodzenia: <input type='date' id='mod-date_of_birth' value="${user.date_of_birth}" required></label><br>
                <span id="error-date_of_birth" style="color:red; font-size:0.9em;"></span><br>

                <label>Password: <input type='password' id='mod-password' placeholder="Pozostaw puste aby nie zmieniać"></label><br>
                <span id="error-password" style="color:red; font-size:0.9em;"></span><br>

                <button type='submit'> Zmodyfikuj uzytkownika </button>
            </form>
            `;
            document.getElementById('display-area').innerHTML = html;
            document.getElementById('modify-user-form').onsubmit = async (e) => {
                e.preventDefault();
                // Frontend Validation
                document.querySelectorAll('span[id^="error-"]').forEach(el => el.innerText = '');
                let isValid = true;
                
                const username = document.getElementById('mod-username').value;
                if(!/^[a-zA-Z0-9_]{6,30}$/.test(username)) {
                    document.getElementById('error-username').innerText = "Username must be between 6 and 30 characters long, letters, digits, and _ only";
                    isValid = false;
                }
                
                const dobVal = document.getElementById('mod-date_of_birth').value;
                if(dobVal) {
                    const dob = new Date(dobVal);
                    const today = new Date();
                    let age = today.getFullYear() - dob.getFullYear();
                    const m = today.getMonth() - dob.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                        age--;
                    }
                    if(age < 18) {
                        document.getElementById('error-date_of_birth').innerText = "User must be at least 18 years old  ";
                        isValid = false;
                    }
                }

                const pwd = document.getElementById('mod-password').value;
                if(pwd && pwd.length < 8) {
                    document.getElementById('error-password').innerText = "Password must be at least 8 characters long";
                    isValid = false;
                }

                if(!isValid) return;

                const userData = {};
                userData.username = username;
                userData.email = document.getElementById('mod-email').value;
                userData.date_of_birth = dobVal;
                if(pwd) userData.password = pwd;
                
                
                UserModule.modifyUser(userId,userData);
            }
        }catch (error){
            alert('Błąd podczas modyfikowania osoby: '+error.message);
        }  },
    async modifyUser(userId,userData){

        document.querySelectorAll('span[id^="error-"]').forEach(el => el.innerText = '');
        
        try{
            await ApiService.patch(`/users/updateUser/${userId}`,userData);
            document.getElementById('mod-success-msg').innerText = 'Użytkownik zmodyfikowany!';
            setTimeout(() => this.usersList(), 1500);
        }catch (error){
             if(error.details && Array.isArray(error.details)){
                error.details.forEach(err => {
                    const fieldName = err.loc[1];
                    const span = document.getElementById(`error-${fieldName}`);
                    if(span) span.innerText = err.msg;
                });
            } else {
                alert('Błąd podczas modyfikowania osoby: '+error.message);
            }
        }
    },
    async addUser(userData){
        document.querySelectorAll('span[id^="error-"]').forEach(el => el.innerText = '');
        document.getElementById('success-msg').innerText = '';

        try{
            await ApiService.post('/users/addUser',userData);
            document.getElementById('success-msg').innerText = 'Użytkownik został dodany!';
            document.getElementById('add-user-form').reset();
            setTimeout(() => this.usersList(), 1500);
        }catch (error){
            if(error.details && Array.isArray(error.details)){
                error.details.forEach(err => {
                    const fieldName = err.loc[1];
                    const span = document.getElementById(`error-${fieldName}`);
                    if(span) span.innerText = err.msg;
                });
            } else {
                alert('Błąd podczas dodawania osoby: '+error.message);
            }
        }
    },

    
    
}
