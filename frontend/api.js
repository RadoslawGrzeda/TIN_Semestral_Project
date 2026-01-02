const API_URL='http://127.0.0.1:8000';

const ApiService={
    async get(endpoint){
        const response=await fetch(`${API_URL}${endpoint}`);
        if(!response.ok)throw new Error('Błąd połączenia z API');
        return await response.json();
    }
}