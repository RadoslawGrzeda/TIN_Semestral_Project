const AuthModule = {
    init: function() {
        // Prosta inicjalizacja: sprawdz czy jest token
        this.updateUI();
    },

    updateUI: function() {
        const isLoggedIn = ApiService.isLoggedIn();
        
        // Elementy interfejsu
        const mainDiv = document.querySelector('.main');
        const sidebar = document.querySelector('.sidebar');
        let loginArea = document.getElementById('auth-area');
        
        if (isLoggedIn) {
            // Uzytkownik zalogowany:
            // 1. Ukryj formularz logowania
            if (loginArea) loginArea.style.display = 'none';
            
            // 2. Pokadz panel glowny i sidebar
            if (mainDiv) mainDiv.style.display = 'block';
            if (sidebar) sidebar.style.display = 'block';

            // 3. Dodaj przycisk wylogowania jesli go nie ma
            if (!document.getElementById('btn-logout')) {
                const btn = document.createElement('button');
                btn.id = 'btn-logout';
                btn.innerText = t('btn_logout') + ' (' + (localStorage.getItem('username') || 'User') + ')';
                btn.style.marginTop = '20px';
                btn.onclick = () => this.logout();
                sidebar.appendChild(btn);
            }
        } else {
            // Uzytkownik niezalogowany:
            // 1. Ukryj panel glowny
            if (mainDiv) mainDiv.style.display = 'none';
            if (sidebar) sidebar.style.display = 'none';
            
            // 2. Pokaz/Stworz formularz logowania
            this.showLoginForm();
        }
    },

    showLoginForm: function() {
        let loginArea = document.getElementById('auth-area');
        if (!loginArea) {
            loginArea = document.createElement('div');
            loginArea.id = 'auth-area';
            loginArea.style.textAlign = 'center';
            loginArea.style.marginTop = '100px';
            document.body.appendChild(loginArea);
        }
        
        // Zawsze upewnij sie, ze jest widoczny
        loginArea.style.display = 'block';

        loginArea.innerHTML = `
            <div style="max-width:300px; margin:auto; padding:20px; border:1px solid #ccc; border-radius:8px; background:white;">
                <h2>${t('auth_login_title')}</h2>
                <form onsubmit="event.preventDefault(); AuthModule.handleLogin();">
                    <input type="text" id="login-username" placeholder="${t('user_login')}" required style="width:100%; margin-bottom:10px; padding:8px;"><br>
                    <input type="password" id="login-password" placeholder="${t('auth_password')}" required style="width:100%; margin-bottom:10px; padding:8px;"><br>
                    <button type="submit" style="width:100%; padding:10px; background:#2c3e50; color:white; border:none; cursor:pointer;">${t('auth_login_btn')}</button>
                    <button type="button" onclick="AuthModule.showRegisterForm()" style="width:100%; padding:10px; margin-top:5px; background:none; border:none; color:blue; cursor:pointer;">${t('auth_register_link')}</button>
                </form>
                <p id="login-message" style="color:red; margin-top:10px;"></p>
            </div>
        `;
    },

    showRegisterForm: function() {
        let loginArea = document.getElementById('auth-area');
        if (!loginArea) return;

        loginArea.innerHTML = `
            <div style="max-width:300px; margin:auto; padding:20px; border:1px solid #ccc; border-radius:8px; background:white;">
                <h2>${t('auth_register_title')}</h2>
                <form onsubmit="event.preventDefault(); AuthModule.handleRegister();">
                    <input type="text" id="reg-username" placeholder="${t('user_login')}" required style="width:100%; margin-bottom:10px; padding:8px;"><br>
                    <input type="email" id="reg-email" placeholder="${t('user_email')}" required style="width:100%; margin-bottom:10px; padding:8px;"><br>
                    <input type="password" id="reg-password" placeholder="${t('auth_password')}" required style="width:100%; margin-bottom:10px; padding:8px;"><br>
                    <label style="display:block; text-align:left; font-size:0.8em; color:#666;">${t('auth_dob')}</label>
                    <input type="date" id="reg-dob" required style="width:100%; margin-bottom:10px; padding:8px;"><br>
                    <button type="submit" style="width:100%; padding:10px; background:#27ae60; color:white; border:none; cursor:pointer;">${t('auth_register_btn')}</button>
                    <button type="button" onclick="AuthModule.showLoginForm()" style="width:100%; padding:10px; margin-top:5px; background:none; border:none; color:blue; cursor:pointer;">${t('auth_back')}</button>
                </form>
                <p id="reg-message" style="color:red; margin-top:10px;"></p>
            </div>
        `;
    },

    handleLogin: async function() {
        const usernameInput = document.getElementById('login-username');
        const passwordInput = document.getElementById('login-password');
        const msg = document.getElementById('login-message');

        try {
            const user = await ApiService.login(usernameInput.value, passwordInput.value);
            ApiService.setUser(user);
            this.updateUI();
        } catch (error) {
            msg.innerText = 'Błąd: ' + error.message;
        }
    },

    handleRegister: async function() {
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const dob = document.getElementById('reg-dob').value;
        const msg = document.getElementById('reg-message');

        try {
            await ApiService.post('/users/addUser', {
                username: username,
                email: email,
                password: password,
                date_of_birth: dob
            });
            alert('Konto utworzone! Możesz się zalogować.');
            this.showLoginForm();
        } catch (error) {
            msg.innerText = 'Błąd rejestracji: ' + (error.details ? JSON.stringify(error.details) : error.message);
        }
    },

    logout: function() {
        ApiService.removeUser();
        
        // Usun przycisk wylogowania z DOM zeby nie dublowac
        const btn = document.getElementById('btn-logout');
        if (btn) btn.remove();

        this.updateUI();
    }
};

window.onload = function() {
    AuthModule.init();
};
