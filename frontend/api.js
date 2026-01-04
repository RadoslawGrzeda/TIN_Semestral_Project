const API_URL='http://127.0.0.1:8000';

const ApiService={
    async get(endpoint){
        const response=await fetch(`${API_URL}${endpoint}`);
        if(!response.ok)throw new Error('Błąd połączenia z API');
        return await response.json();
    },
    async post(endpoint,data){
        const response=await fetch(`${API_URL}${endpoint}`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(data)
        });
        if(!response.ok){
            const errorData=await response.json();
            throw new Error(errorData.message||'Błąd podczas wysyłania danych do API');
        }
        return await response.json();
    }

}