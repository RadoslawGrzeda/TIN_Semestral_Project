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
        let html = `<h3>Lista Samochodów</h3><table><tr><th>Marka</th><th>Model</th><th>Rok produkcji</th><th>Cena/dzień</th></tr>`;
        data.forEach(c => {
            html += `<tr><td>${c.brand}</td><td>${c.model}</td><td>${c.production_year}</td><td>${c.daily_rental_price}</td></tr>`;
        });
        document.getElementById('display-area').innerHTML = html + "</table>";
    },
    async detaiCarList(){
        const data = await ApiService.get('/cars');
        let html = `<h3>Lista Szczegółowa Samochodów</h3><table><tr><th>Marka</th><th>Model</th><th>Rok produkcji</th><th>Cena/dzień</th><th>Opis</th></tr>`;
        data.forEach(c => {
            html += `<tr><td>${c.brand}</td><td>${c.model}</td><td>${c.production_year}</td><td>${c.daily_rental_price}</td><td>${c.description ?? ''}</td></tr>`;
        });
        document.getElementById('display-area').innerHTML = html + "</table>";
    },
    addCarForm(){
        const html = `
            <h3>Dodaj nowy samochód</h3>
            <form id="add-car-form">
                <label>Marka: <input type="text" id="brand" required></label><br>
                <label>Model: <input type="text" id="model" required></label><br>
                <label>Rok produkcji: <input type="date" id="production_year" required></label><br>
                <label>Cena za dzień: <input type="number" step="0.01" id="daily_rental_price" required></label><br>
                <label>Opis: <input type="text" id="description"></label><br>
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
        try{
            await ApiService.post('/cars/addCar',carData);
            alert('Samochód dodany pomyślnie!');
            this.carList();
        }catch(error){
            alert('Błąd podczas dodawania samochodu: '+error.message);
        }
    }

}