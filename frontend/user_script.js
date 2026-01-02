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
    }

}