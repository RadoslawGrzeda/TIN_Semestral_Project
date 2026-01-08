const RentalModule = {
    async rentalsList(skip=0, limit=5){
        
        const response = await ApiService.get(`/rentals/?skip=${skip}&limit=${limit}`);
        const data = response.items || response;
        const total = response.total || 0;

        let html = `<h3>Lista Wypożyczeń</h3><table><tr><th>ID</th><th>ID Samochodu</th><th>ID Użytkownika</th><th>Data Wypożyczenia</th><th>Data Zwrotu</th><th>Akcje</th></tr>`;
        data.forEach(r => html += `<tr><td>${r.id}</td><td>${r.car_id}</td><td>${r.user_id}</td><td>${r.rental_start}</td><td>${r.rental_end}</td>
            <td><button onclick='RentalModule.deleteRental(${r.id})'>Usuń
            </button>
            <button onclick='RentalModule.modifyRentalForm(${r.id})'>Modyfikuj
            </button>    
            </td>
            </tr>`);

        html += "</table><div id='rental-pagination'></div>";
        document.getElementById('display-area').innerHTML = html;
        if(response.items){
            Utils.renderPagination(total, skip, limit, 'rental-pagination', 'RentalModule.rentalsList');
        }
    },
    async detailRentalList(skip=0, limit=5){
        
        const response=await ApiService.get(`/rentals/detailedList?skip=${skip}&limit=${limit}`);
        const data = response.items || response;
        const total = response.total || 0;

        let html=`
        <h3>Lista Szczegółowa Wypożyczeń</h3>
        <table>
        <tr>
        <th>Marka Samochodu</th>
        <th>Model Samochodu</th>
        <th>Login Użytkownika</th>
        <th>Email Użytkownika</th>
        <th>Data Wypożyczenia</th>
        <th>Data Zwrotu</th>
        </tr>`;
        data.forEach(r=>html+=`<tr><td>${r.car.brand}</td><td>${r.car.model}</td><td>${r.user.username}</td><td>${r.user.email}</td><td>${r.rental_start}</td><td>${r.rental_end}</td></tr>`);
        html += "</table><div id='rental-detail-pagination'></div>";
        document.getElementById('display-area').innerHTML=html;

        if(response.items){
            Utils.renderPagination(total, skip, limit, 'rental-detail-pagination', 'RentalModule.detailRentalList');
        }
    },
     addRentalForm(){
        const html =`
        <h3>Dodaj nowe wypożyczenie</h3>
        <span id="success-msg" style="color:green; font-weight:bold;"></span>
        <form id='add-rental-form' novalidate>
            <label>ID Użytkownika: <input type='number' id='user_id' required></label><br>
            <span id="error-user_id" style="color:red; font-size:0.9em;"></span><br>

            <label>ID Samochodu: <input type='number' id='car_id' required></label><br>
            <span id="error-car_id" style="color:red; font-size:0.9em;"></span><br>

            <label>Data wypożyczenia: <input type='date' id='rental_start' required></label><br>
            <span id="error-rental_start" style="color:red; font-size:0.9em;"></span><br>

            <label>Data zwrotu: <input type='date' id='rental_end' ></label><br>
            <span id="error-rental_end" style="color:red; font-size:0.9em;"></span><br>

            <button type='submit'> Dodaj wypozyczenie </button>
        </form>
        `;
        document.getElementById('display-area').innerHTML = html;
        document.getElementById('add-rental-form').onsubmit= async (e) => 
        {
            e.preventDefault();
            // Frontend Validation
            try{
                const cars=await ApiService.get('/cars');
                const users=await ApiService.get('/users');



            
            document.querySelectorAll('span[id^="error-"]').forEach(el => el.innerText = '');
            let isValid = true;

            const userId = parseInt(document.getElementById('user_id').value);
            if(isNaN(userId) || userId <= 0 || !users.some(u => u.id === userId)) {
                document.getElementById('error-user_id').innerText = "Podaj poprawne ID użytkownika";
                isValid = false;
            }

            const carId = parseInt(document.getElementById('car_id').value);
            if(isNaN(carId) || carId <= 0 || !cars.some(c => c.id === carId)) {
                document.getElementById('error-car_id').innerText = "Podaj poprawne ID samochodu";
                isValid = false;
            }

            const startVal = document.getElementById('rental_start').value;
            const endVal = document.getElementById('rental_end').value;

            if(!startVal) {
                document.getElementById('error-rental_start').innerText = "Data wypożyczenia jest wymagana";
                isValid = false;
            }

            if(startVal && endVal) {
                if(new Date(endVal) < new Date(startVal)) {
                    document.getElementById('error-rental_end').innerText = "Data zwrotu nie może być wcześniejsza niż data wypożyczenia";
                    isValid = false;
                }
            }

            if(!isValid) return;

            const rentalData={
                user_id: userId,
                car_id: carId,
                rental_start: startVal,
                rental_end: endVal || null
            };
            RentalModule.addRental(rentalData);
        }
        catch (error){
            alert('Błąd podczas dodawania wypożyczenia: '+error.message);
        }
        };
        
    },
    async addRental(rentalData){
         document.querySelectorAll('span[id^="error-"]').forEach(el => el.innerText = '');
        document.getElementById('success-msg').innerText = '';
        try{
            await ApiService.post('/rentals/addRental',rentalData);
           document.getElementById('success-msg').innerText = 'Wypożyczenie zostało dodane!';
            document.getElementById('add-rental-form').reset();
            setTimeout(() => this.rentalsList(), 1500);
        }catch (error){
            if(error.details && Array.isArray(error.details)){
                error.details.forEach(err => {
                    const fieldName = err.loc[1];
                    const span = document.getElementById(`error-${fieldName}`);
                    if(span) span.innerText = err.msg;
                });
            } else {
                alert('Błąd podczas dodawania wypożyczenia: '+error.message);
            }}
    },
    async deleteRental(rental_id){
        try{
        await ApiService.delete(`/rentals/deleteRental/${rental_id}`);
        alert('Reservation deleted')
        this.rentalsList()
    }catch(error){
        alert(error)
    }},
    async modifyRentalForm(rental_id){
        try{
        const rental = await ApiService.get(`/rentals/${rental_id}`);
        const html=`
        <h3>Modyfikuj wypożyczenie ID: ${rental_id}</h3>
        <span id="success-msg" style="color:green; font-weight:bold;"></span>
        <form id='modify-rental-form' novalidate>
        <label>ID Użytkownika: <input type='number' id='user_id' value='${rental.user_id}' required></label><br>
        <span id="error-user_id" style="color:red; font-size:0.9em;"></span><br>
        
        <label>ID Samochodu: <input type='number' id='car_id' value='${rental.car_id}' required></label><br>
        <span id="error-car_id" style="color:red; font-size:0.9em;"></span><br>
        
        <label>Data wypożyczenia: <input type='date' id='rental_start' value='${rental.rental_start}' required></label><br>
        <span id="error-rental_start" style="color:red; font-size:0.9em;"></span><br>
        
        <label>Data zwrotu: <input type='date' id='rental_end' value='${rental.rental_end ?? ''}' ></label><br>
        <span id="error-rental_end" style="color:red; font-size:0.9em;"></span><br>
        
        <button type='submit'> Modyfikuj wypożyczenie </button>
        </form>
        `;
    document.getElementById('display-area').innerHTML = html;
    document.getElementById('modify-rental-form').onsubmit= (e) =>
    {   
        e.preventDefault();
        // Frontend Validation
        document.querySelectorAll('span[id^="error-"]').forEach(el => el.innerText = '');
        let isValid = true;

        const userId = parseInt(document.getElementById('user_id').value);
        if(isNaN(userId) || userId <= 0) {
            document.getElementById('error-user_id').innerText = "Podaj poprawne ID użytkownika";
            isValid = false;
        }

        const carId = parseInt(document.getElementById('car_id').value);
        if(isNaN(carId) || carId <= 0) {
            document.getElementById('error-car_id').innerText = "Podaj poprawne ID samochodu";
            isValid = false;
        }

        const startVal = document.getElementById('rental_start').value;
        const endVal = document.getElementById('rental_end').value;

        if(!startVal) {
            document.getElementById('error-rental_start').innerText = "Data wypożyczenia jest wymagana";
            isValid = false;
        }

        if(startVal && endVal) {
            if(new Date(endVal) < new Date(startVal)) {
                document.getElementById('error-rental_end').innerText = "Data zwrotu nie może być wcześniejsza niż data wypożyczenia";
                isValid = false;
            }
        }

        if(!isValid) return;

        const rentalData={
            user_id: userId,
            car_id: carId,
            rental_start: startVal,
            rental_end: endVal || null
        };
        RentalModule.modifyRental(rental_id,rentalData);
    }
}catch (error){
            alert('Błąd podczas modyfikowania osoby: '+error.message);
        } }
    
    ,async modifyRental(rental_id,rentalData){
        document.querySelectorAll('span[id^="error-"]').forEach(el => el.innerText = '')
        try{
            await ApiService.patch(`/rentals/updateRental/${rental_id}`,rentalData);
             document.getElementById('success-msg').innerHTML = 'Wypożczenie zmodyfikowane!';
        setTimeout(() => this.rentalsList(), 1500);
        }catch (error){
        if(error.details && Array.isArray(error.details)){
                error.details.forEach(err => {
                    const fieldName = err.loc[1];
                    const span = document.getElementById(`error-${fieldName}`);
                    if(span) span.innerText = err.msg;
                });
            } else {
        alert('Błąd podczas modyfikowania samochodu: '+error.message);
        }
    
    }


 

}
};