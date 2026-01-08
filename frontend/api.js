const API_URL='http://127.0.0.1:8000';

const ApiService={
    getToken() {
        return localStorage.getItem('token');
    },
    setToken(token) {
        localStorage.setItem('token', token);
    },
    removeToken() {
        localStorage.removeItem('token');
    },
    isLoggedIn() {
        return !!this.getToken();
    },
    getHeaders() {
        const headers = {'Content-Type': 'application/json'};
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    },

    async get(endpoint){
        const response=await fetch(`${API_URL}${endpoint}`, {
            headers: this.getHeaders()
        });
        if(!response.ok)throw new Error('Błąd połączenia z API');
        return await response.json();
    },
    async post(endpoint,data){
        const response=await fetch(`${API_URL}${endpoint}`,{
            method:'POST',
            headers: this.getHeaders(),
            body:JSON.stringify(data)
        });
        if(!response.ok){
            const errorData=await response.json();
            const error = new Error(JSON.stringify(errorData.detail) || errorData.message || 'Błąd podczas wysyłania danych do API');
            error.details = errorData.detail;
            throw error;
        }
        return await response.json();
    },

    async login(username, password) {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_URL}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Błędne dane logowania');
        }
        return await response.json();
    },
    
    async patch(endpoint, data){
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        if(!response.ok){
            const errorData = await response.json();
            const error = new Error(JSON.stringify(errorData.detail) || errorData.message || 'Błąd podczas wysyłania danych do API');
            error.details = errorData.detail;
            throw error;
        }
        return await response.json();
    },
    async delete(endpoint){
        const response=await fetch(`${API_URL}${endpoint}`,{
            method:'DELETE',
            headers: this.getHeaders()
        });
        if(!response.ok){
            const errorData=await response.json();
            throw new Error(errorData.message||'Błąd podczas usuwania danych z API');
        }
        return await response.json();
    }
}

const Utils = {
    renderPagination(total, skip, limit, containerId, fetchFunction) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const currentPage = Math.floor(skip / limit) + 1;
        const totalPages = Math.max(1, Math.ceil(total / limit));

        let html = '<div class="pagination" style="margin-top: 10px; display: flex; gap: 10px; align-items: center; justify-content: center;">';
        
        // Disable "Previous" button if on first page (or hide it)
        if (skip > 0) {
            html += `<button onclick="${fetchFunction}(${skip - limit}, ${limit})">Poprzednia</button>`;
        } else {
             html += `<button disabled style="opacity: 0.5; cursor: not-allowed;">Poprzednia</button>`;
        }
        
        html += `<span style="font-weight: bold;">Strona ${currentPage} z ${totalPages}</span>`;

        // Disable "Next" button if on last page
        if (skip + limit < total) {
            html += `<button onclick="${fetchFunction}(${skip + limit}, ${limit})">Następna</button>`;
        } else {
             html += `<button disabled style="opacity: 0.5; cursor: not-allowed;">Następna</button>`;
        }
        
        html += '</div>';
        container.innerHTML = html;
    }
};
