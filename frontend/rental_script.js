const RentalModule = {
    async rentalsList(){
        const data = await ApiService.get('/rentals');
        let html = `<h3>Lista Wypożyczeń</h3><table><tr><th>ID</th><th>ID Samochodu</th><th>ID Użytkownika</th><th>Data Wypożyczenia</th><th>Data Zwrotu</th></tr>`;
        data.forEach(r => html += `<tr><td>${r.id}</td><td>${r.car_id}</td><td>${r.user_id}</td><td>${r.rental_date}</td><td>${r.return_date}</td></tr>`);
        document.getElementById('display-area').innerHTML = html + "</table>";
    },
    async detailRentalList(){
        const data=await ApiService.get('/rentals');
        let html=`<h3>Lista Szczegółowa Wypożyczeń</h3><table><tr><th>ID</th><th>ID Samochodu</th><th>ID Użytkownika</th><th>Data Wypożyczenia</th><th>Data Zwrotu</th><th>Status</th></tr>`;
        data.forEach(r=>html+=`<tr><td>${r.id}</td><td>${r.car_id}</td><td>${r.user_id}</td><td>${r.rental_date}</td><td>${r.return_date}</td><td>${r.status}</td></tr>`);
        document.getElementById('display-area').innerHTML=html+"</table>";
    },
    addRentalForm(){
        const html =`
        <h3>Dodaj nowe wypożyczenie</h3>
        <form id='add-rental-form'>
        <label>user_id: <input type='text' id='username' required></label><br>
        <label>car_id: <input type='text' id='car_id' required></label><br>
        <label>rental_start: <input type='date' id='rental_start' required></label><br>
        <label>rental_end: <input type='text' id='rental_end' required></label><br>
        <button type='submit'> Dodaj wypozyczenie </button>
        </form>
        `;
        document.getElementById('display-area').innerHTML = html;
        document.getElementById('add-rental-form').onsubmit= (e) => 
        {
            e.preventDefault();
            const userDate={
                user_id:document.getElementById('user_id').value,
                car_id:document.getElementById('car_id').value,
                rental_start:document.getElementById('rental_start').value,
                rental_end:document.getElementById('rental_end').value
            };
            RentalModel.addRental(userDate);

        };
        
    },
    async addRental(rentalData){
        try{
            await ApiService.post('/rental/addRental',userData);
            alert('wypozycznie dodane');
            this.usersList()
        }catch (error){
            alert('Błąd podczas dodawania wypozycznia: '+error.message);
        }
    }
}