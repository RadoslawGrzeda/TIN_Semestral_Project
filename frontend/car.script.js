// const CarModule={
//     async carList(){
//         const data = await ApiService.get('/cars');
//         let html = `<h3>Lista Samochodów</h3><table><tr><th>ID</th><th>Marka</th><th>Model</th><th>Rok</th></tr>`;
//         data.forEach(c => html += `<tr><td>${c.id}</td><td>${c.make}</td><td>${c.model}</td><td>${c.year}</td></tr>`);
//         document.getElementById('display-area').innerHTML = html + "</table>";
//     },
//     async detaiCarList(){
//         const data=await ApiService.get('/cars');
//         let html=`<h3>Lista Szczegółowa Samochodów</h3><table><tr><th>ID</th><th>Marka</th><th>Model</th><th>Rok</th><th>Kolor</th><th>Rejestracja</th></tr>`;
//         data.forEach(c=>html+=`<tr><td>${c.id}</td><td>${c.make}</td><td>${c.model}</td><td>${c.year}</td><td>${c.color}</td><td>${c.registration}</td></tr>`);
//         document.getElementById('display-area').innerHTML=html+"</table>";
//     },
//     async addCar(carData){
//         try{
//             const response=await ApiService.post('/cars/addCar',carData);
//             alert('Samochód dodany pomyślnie!');
//             this.carList();
//         }catch(error){
//             alert('Błąd podczas dodawania samochodu: '+error.message);
//         }
//     }


// }
const CarModule = {
    async carList(){
        const data = await ApiService.get('/cars');
        let html = `
        <h3>Lista Samochodów</h3>
        <table>
        <tr>
        <th>Marka</th>
        <th>Model</th>
        <th>Rok produkcji</th>
        <th>Cena/dzień</th>
        <th>Akcje</th>
        </tr>`;
        data.forEach(c => 
            html += `
            <tr>
            <td>${c.brand}</td>
            <td>${c.model}</td>
            <td>${c.production_year}</td>
            <td>${c.daily_rental_price}</td>
            <td>
            <button onclick="CarModule.deleteCar(${c.id})">Usun</button>
            <button onclick="CarModule.modifyCarForm(${c.id})">Modyfikuj</button>
            </td>
            </tr>`
        );
        document.getElementById('display-area').innerHTML = html + "</table>";
    },
    async detailCarList(){
        const data = await ApiService.get('/cars/showAllRelations');
        let html = `<h3>Lista Szczegółowa (Cars)</h3>`;
        if(!data || data.length === 0){
            document.getElementById('display-area').innerHTML = '<p>Brak samochodów</p>';
            return;
        }

        data.forEach(u => {
            html += `<div class="user-card">`;
            html += `<h4>${u.brand} ${u.model} (ID: ${u.id})</h4>`;
            html += `<p><strong>Rok produkcji:</strong> ${u.production_year} &nbsp; <strong>Cena za dzień:</strong> ${u.daily_rental_price} &nbsp; <strong>Opis:</strong> ${u.description ?? ''}</p>`;

            if(u.rentals && u.rentals.length > 0){
                html += `<details><summary>Wypożyczenia (${u.rentals.length})</summary><ul>`;
                u.rentals.forEach(r => {
                    const user = r.user || {};
                    html += `<li>Rezerwacja ID ${r.id}: ${r.rental_start} → ${r.rental_end ?? 'aktualne'} — Użytkownik: ${user.username ?? '—'} (ID: ${user.id ?? '—'})</li>`;
                });
                html += `</ul></details>`;
            } else {
                html += `<p><em>Brak wypożyczeń</em></p>`;
            }

            html += `</div>`;
        });

        document.getElementById('display-area').innerHTML = html;
    },
    addCarForm(){
        const html = `
            <h3>Dodaj nowy samochód</h3>
            <form id="add-car-form">
                <label>Marka: <input type="text" id="brand" required></label><br>
                <span id="brand-error" style="color:red; font-size:0.9em;"></span><br>
                <label>Model: <input type="text" id="model" required></label><br>
                <span id="model-error" style="color:red; font-size:0.9em;"></span><br>
                <label>Rok produkcji: <input type="date" id="production_year" required></label><br>
                <span id="production_year-error" style="color:red; font-size:0.9em;"></span><br>
                <label>Cena za dzień: <input type="number" step="0.01" id="daily_rental_price" required></label><br>
                <span id="daily_rental_price-error" style="color:red; font-size:0.9em;"></span><br>
                <label>Opis: <input type="text" id="description"></label><br>
                <span id="description-error" style="color:red; font-size:0.9em;"></span><br>
                <button type="submit">Dodaj samochód</button>
            </form>
        `;
        document.getElementById('display-area').innerHTML = html;
        document.getElementById('add-car-form').onsubmit = (e) => {
            e.preventDefault();
            const carData = {
                brand: document.getElementById('brand').value,
                model: document.getElementById('model').value,
                production_year: document.getElementById('production_year').value,
                daily_rental_price: parseFloat(document.getElementById('daily_rental_price').value),
                description: document.getElementById('description').value || null
            };
            CarModule.addCar(carData);
        };
    },
    async addCar(carData){
        document.querySelectorAll('span[id^="error-"]').forEach(el => el.innerText = '');
        document.getElementById('success-msg').innerText = '';
        try{
            await ApiService.post('/cars/addCar',carData);
             document.getElementById('success-msg').innerText = 'Użytkownik został dodany!';
            // alert('Samochód dodany pomyślnie!');
            document.getElementById('add-car-form').reset();
            setTimeout(() => this.usersList(), 1500);
            this.carList();
        }catch (error){
            if(error.details && Array.isArray(error.details)){
                error.details.forEach(err => {
                    const fieldName = err.loc[1];
                    const span = document.getElementById(`error-${fieldName}`);
                    if(span) span.innerText = err.msg;
                });
            } else {
                alert('Błąd podczas dodawania osoby: '+error.message);
            }}
    },


    async modifyCarForm(carId){
        try{
            
            const cars=await ApiService.get('/cars');
            const car = cars.find(e => e.id===carId)

        let html=`
                
                <h3>Edytuj samochód</h3>
                <span id="mod-success-msg" style="color:green; 
                <form id="modify-car-form">
                <label>Marka: 
                <input type="text" id="brand" value=${car.brand} required></label><br>
                <span id="brand-error" style="color:red; font-size:0.9em;"></span><br>
                <label>Model:
                <input type="text" id="model" value=${car.model} required></label><br>
                <span id="model-error" style="color:red; font-size:0.9em;"></span><br>
                <label>Rok produkcji: <input type="date" id="production_year" value=${car.production_year}required></label><br>
                <span id="production_year-error" style="color:red; font-size:0.9em;"></span><br>
                <label>Cena za dzień: <input type="number" step="0.01" id="daily_rental_price"  value=${car.daily_rental_price} required></label><br>
                <span id="daily_rental_price-error" style="color:red; font-size:0.9em;"></span><br>
                <label>Opis: <input type="text"  value=${car.description} id="description"></label><br>
                <span id="description-error" style="color:red; font-size:0.9em;"></span><br>
        
                <button type="submit">Zaktualizuj samochód</button>
                </form>
        `;
        document.getElementById('display-area').innerHTML=html;
        document.getElementById('modify-car-form').onsubmit = async(e) => {
            e.preventDefault();
        const carData = {
                brand: document.getElementById('brand').value,
                model: document.getElementById('model').value,
                production_year: document.getElementById('production_year').value,
                daily_rental_price: parseFloat(document.getElementById('daily_rental_price').value),
                description: document.getElementById('description').value || null
            };
            CarModule.modifyCar(carId,carData)
}}catch (error){
            alert('Błąd podczas modyfikowania osoby: '+error.message);
        } },

async deleteCar(carId){
    try {
        await ApiService.delete(`/cars/deleteCar/${carId}`);
        alert('Samochód usunięty');
        this.carList();
    } catch (error) {
        alert('Błąd podczas usuwania samochodu: ' + error.message);
    }
},


async modifyCar(carId,carData){
    document.querySelectorAll('span[id^="error-"]').forEach(el => el.innerText = '');
    try{

        await ApiService.patch(`/cars/updateCar/${carId}`,carData)
        document.getElementById('mod-success-msg').innerHTML = 'Samochód zmodyfikowany!';
        setTimeout(() => this.usersList(), 1500);
    }catch (error){
        if(error.details && Array.isArray(error.details)){
                error.details.forEach(err => {
                    const fieldName = err.loc[1];
                    const span = document.getElementById(`error-${fieldName}`);
                    if(span) span.innerText = err.msg;
                });
            } else {
    alert('Błąd podczas modyfikowania samochodu: '+error.message);
}}
}}