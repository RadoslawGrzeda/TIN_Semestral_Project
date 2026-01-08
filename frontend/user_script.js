const UserModule = {
    async usersList(skip=0, limit=5) {
        
        const response = await ApiService.get(`/users/?skip=${skip}&limit=${limit}`);
        const data = response.items || response;  
        const total = response.total || 0;

        let html = `<h3>${t('users_list_simple')}</h3><table><tr><th>${t('user_login')}</th><th>${t('user_email')}</th><th>${t('user_dob')}</th><th>${t('actions')}</th></tr>`;
        const role = localStorage.getItem('user_role');
        
        data.forEach(u => {
            if(u.role === 'admin' )
                 return; 
            html += `<tr><td>${u.username}</td><td>${u.email}</td><td>${u.date_of_birth}</td><td>`;
            if (role === 'admin') {
                html += `<button onclick="UserModule.deleteUser(${u.id})">${t('delete')}</button><button onclick="UserModule.modifyUserForm(${u.id})">${t('modify')}</button>`;
                // Auto-promote logic if needed
            } else {
                html += `<button disabled title="${t('only_admin')}">${t('no_action')}</button>`;
            }
            html += `</td></tr>`;
        });
        html += "</table><div id='user-pagination'></div>";
        document.getElementById('display-area').innerHTML = html;

        if (response.items) {
             Utils.renderPagination(total, skip, limit, 'user-pagination', 'UserModule.usersList');
        }
    },
    async detailUserList(skip=0, limit=5){
        
        const response = await ApiService.get(`/users/showAllRelations?skip=${skip}&limit=${limit}`);
        const data = response.items || response;
        const total = response.total || 0;
        
        let html = `<h3>${t('users_list_detailed')}</h3>`;
        if(!data || data.length === 0){
            document.getElementById('display-area').innerHTML = `<p>${t('no_users_found')}</p>`;
            return;
        }

        data.forEach(u => {
            html += `<div class="user-card">`;
            html += `<h4>${u.username} (ID: ${u.id})</h4>`;
            html += `<p><strong>${t('user_email')}:</strong> ${u.email} &nbsp; <strong>${t('user_dob')}:</strong> ${u.date_of_birth} &nbsp; <strong>${t('user_role')}:</strong> ${u.role}</p>`;

            if(u.rentals && u.rentals.length > 0){
                html += `<details><summary>${t('menu_rentals')} (${u.rentals.length})</summary><ul>`;
                u.rentals.forEach(r => {
                    const car = r.car || {};
                    html += `<li>ID ${r.id}: ${r.rental_start} → ${r.rental_end ?? '...'} — ${car.brand ?? '-'} ${car.model ?? ''} (ID: ${car.id ?? '-'})</li>`;
                });
                html += `</ul></details>`;
            } else {
                html += `<p><em>${t('no_rentals')}</em></p>`;
            }

            html += `</div>`;
        });
        
        html += "<div id='user-detail-pagination'></div>";
        document.getElementById('display-area').innerHTML = html;

        if (response.items) {
             Utils.renderPagination(total, skip, limit, 'user-detail-pagination', 'UserModule.detailUserList');
        }
    },
    addUserForm(){
        const html =`
        <h3>${t('user_add_new')}</h3>
        <span id="success-msg" style="color:green; font-weight:bold;"></span>
        <form id='add-user-form' novalidate>
            <label>${t('user_login')}: <input type='text' id='username' required></label><br>
            <span id="error-username" style="color:red; font-size:0.9em;"></span><br>

            <label>${t('user_email')}: <input type='email' id='email' required></label><br>
            <span id="error-email" style="color:red; font-size:0.9em;"></span><br>

            <label>${t('user_dob')}: <input type='date' id='date_of_birth' required></label><br>
            <span id="error-date_of_birth" style="color:red; font-size:0.9em;"></span><br>

            <label>${t('auth_password')}: <input type='password' id='password' required></label><br>
            <span id="error-password" style="color:red; font-size:0.9em;"></span><br>

            <button type='submit'> ${t('btn_add')} </button>
        </form>
        `;
        document.getElementById('display-area').innerHTML = html;
        document.getElementById('add-user-form').onsubmit= async (e) => 
        {
            
            e.preventDefault();

            const usersResp = await ApiService.get('/users');
            const users = usersResp.items || usersResp;

            document.querySelectorAll('span[id^="error-"]').forEach(el => el.innerText = '');
            let isValid = true;
            
            const username = document.getElementById('username').value;
            if(!/^[a-zA-Z0-9_]{6,30}$/.test(username)) {
                document.getElementById('error-username').innerText = t('err_username_format');
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
                    document.getElementById('error-date_of_birth').innerText = t('err_age_limit');
                    isValid = false;
                }
            }

            const pwd = document.getElementById('password').value;
            if(pwd.length < 8) {
                document.getElementById('error-password').innerText = t('err_password_min');
                isValid = false;
            }

            const email= document.getElementById('email').value;
            const us=users.filter(u=>u.email===email);
            if(us.length > 0){   
                document.getElementById('error-email').innerText = t('err_email_in_use');
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
            alert(t('user_mod_success')); // Or generic success/deleted message
            this.usersList()
        }catch (error){
            alert('Error: '+error.message);
        }
    },
    async modifyUserForm(userId){
        try{
            const user = await ApiService.get(`/users/${userId}`);

            let html=`
            <h3>${t('user_mod_title')}</h3>
            <span id="mod-success-msg" style="color:green; font-weight:bold;"></span>
            <form id='modify-user-form'>
                <label>${t('user_login')}: <input type='text' id='mod-username' value="${user.username}" required></label><br>
                <span id="error-username" style="color:red; font-size:0.9em;"></span><br>

                <label>${t('user_email')}: <input type='email' id='mod-email' value="${user.email}" required></label><br>
                <span id="error-email" style="color:red; font-size:0.9em;"></span><br>

                <label>${t('user_dob')}: <input type='date' id='mod-date_of_birth' value="${user.date_of_birth}" required></label><br>
                <span id="error-date_of_birth" style="color:red; font-size:0.9em;"></span><br>

                <label>${t('auth_password')}: <input type='password' id='mod-password' placeholder="${t('placeholder_no_change')}"></label><br>
                <span id="error-password" style="color:red; font-size:0.9em;"></span><br>

                <button type='submit'> ${t('modify')} </button>
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
                    document.getElementById('error-username').innerText = t('err_username_format');
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
                        document.getElementById('error-date_of_birth').innerText = t('err_age_limit');
                        isValid = false;
                    }
                }

                const pwd = document.getElementById('mod-password').value;
                if(pwd && pwd.length < 8) {
                    document.getElementById('error-password').innerText = t('err_password_min');
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
            alert('Error: '+error.message);
        }  },
    async modifyUser(userId,userData){

        document.querySelectorAll('span[id^="error-"]').forEach(el => el.innerText = '');
        
        try{
            await ApiService.patch(`/users/updateUser/${userId}`,userData);
            document.getElementById('mod-success-msg').innerText = t('user_mod_success');
            setTimeout(() => this.usersList(), 1500);
        }catch (error){
             if(error.details && Array.isArray(error.details)){
                error.details.forEach(err => {
                    const fieldName = err.loc[1];
                    const span = document.getElementById(`error-${fieldName}`);
                    if(span) span.innerText = err.msg;
                });
            } else {
                alert('Error: '+error.message);
            }
        }
    },
    async addUser(userData){
        document.querySelectorAll('span[id^="error-"]').forEach(el => el.innerText = '');
        document.getElementById('success-msg').innerText = '';

        try{
            await ApiService.post('/users/addUser',userData);
            document.getElementById('success-msg').innerText = t('user_added_success');
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
                alert('Error: '+error.message);
            }
        }
    },

    
    
}
