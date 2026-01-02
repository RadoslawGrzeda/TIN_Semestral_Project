const RentalModule = {
    async rentalsList(){
        const data = await ApiService.get('/rentals');
        let html = `<h3>Lista Wypożyczeń</h3><table><tr><th>ID</th><th>ID Samochodu</th><th>ID Użytkownika</th><th>Data Wypożyczenia</th><th>Data Zwrotu</th></tr>`;
        data.forEach(r => html += `<tr><td>${r.id}</td><td>${r.car_id}</td><td>${r.user_id}</td><td>${r.rental_date}</td><td>${r.return_date}</td></tr>`);
        document.getElementById('display-area').innerHTML = html + "</table>";
    }
}