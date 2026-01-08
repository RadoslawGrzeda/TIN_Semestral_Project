const RentalModule = {
    async rentalsList(skip=0, limit=5){
        
        const response = await ApiService.get(`/rentals/?skip=${skip}&limit=${limit}`);
        const data = response.items || response;
        const total = response.total || 0;

        let html = `<h3>${t('rentals_list')}</h3><table><tr><th>${t('rental_id')}</th><th>${t('rental_car_id')}</th><th>${t('rental_user_id')}</th><th>${t('rental_start')}</th><th>${t('rental_end')}</th><th>${t('actions')}</th></tr>`;
        const role = localStorage.getItem('user_role');

        data.forEach(r => {
            html += `<tr><td>${r.id}</td><td>${r.car_id}</td><td>${r.user_id}</td><td>${r.rental_start}</td><td>${r.rental_end}</td><td>`;
            
            if (role === 'admin') {
                html += `<button onclick='RentalModule.deleteRental(${r.id})'>${t('delete')}</button>
                         <button onclick='RentalModule.modifyRentalForm(${r.id})'>${t('modify')}</button>`;
            } else {
                html += `<button disabled title="${t('only_admin')}">${t('no_action')}</button>`;
            }
            
            html += `</td></tr>`;
        });

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
        <h3>${t('rentals_list_detailed')}</h3>
        <table>
        <tr>
        <th>${t('car_brand')}</th>
        <th>${t('car_model')}</th>
        <th>${t('user_login')}</th>
        <th>${t('user_email')}</th>
        <th>${t('rental_start')}</th>
        <th>${t('rental_end')}</th>
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
        <h3>${t('rental_add_new')}</h3>
        <span id="success-msg" style="color:green; font-weight:bold;"></span>
        <form id='add-rental-form' novalidate>
            <label>${t('rental_user_id')}: <input type='number' id='user_id' required></label><br>
            <span id="error-user_id" style="color:red; font-size:0.9em;"></span><br>

            <label>${t('rental_car_id')}: <input type='number' id='car_id' required></label><br>
            <span id="error-car_id" style="color:red; font-size:0.9em;"></span><br>

            <label>${t('rental_start')}: <input type='date' id='rental_start' required></label><br>
            <span id="error-rental_start" style="color:red; font-size:0.9em;"></span><br>

            <label>${t('rental_end')}: <input type='date' id='rental_end' ></label><br>
            <span id="error-rental_end" style="color:red; font-size:0.9em;"></span><br>

            <button type='submit'> ${t('rental_add_new')} </button>
        </form>
        `;
        document.getElementById('display-area').innerHTML = html;
        document.getElementById('add-rental-form').onsubmit= async (e) => 
        {
            e.preventDefault();
           
            try{
                const carsResp = await ApiService.get('/cars');
                const cars = carsResp.items || carsResp;
                const usersResp = await ApiService.get('/users');
                const users = usersResp.items || usersResp;

            document.querySelectorAll('span[id^="error-"]').forEach(el => el.innerText = '');
            let isValid = true;

            const userId = parseInt(document.getElementById('user_id').value);
            if(isNaN(userId) || userId <= 0 || !users.some(u => u.id === userId)) {
                document.getElementById('error-user_id').innerText = t('err_user_id');
                isValid = false;
            }

            const carId = parseInt(document.getElementById('car_id').value);
            if(isNaN(carId) || carId <= 0 || !cars.some(c => c.id === carId)) {
                document.getElementById('error-car_id').innerText = t('err_car_id');
                isValid = false;
            }

            const startVal = document.getElementById('rental_start').value;
            const endVal = document.getElementById('rental_end').value;

            if(!startVal) {
                document.getElementById('error-rental_start').innerText = t('err_date_req');
                isValid = false;
            }

            if(startVal && endVal) {
                if(new Date(endVal) < new Date(startVal)) {
                    document.getElementById('error-rental_end').innerText = t('err_date_order');
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
            alert(t('err_fetch_data') + ': ' + error.message);
        }
        };
        
    },
    async addRental(rentalData){
         document.querySelectorAll('span[id^="error-"]').forEach(el => el.innerText = '');
        document.getElementById('success-msg').innerText = '';
        try{
            await ApiService.post('/rentals/addRental',rentalData);
           document.getElementById('success-msg').innerText = t('rental_added_success');
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
        alert(t('rental_deleted'))
        this.rentalsList()
    }catch(error){
        alert(error)
    }},
    async modifyRentalForm(rental_id){
        try{
        const rental = await ApiService.get(`/rentals/${rental_id}`);
        const html=`
        <h3>${t('rental_mod_title')} ${rental_id}</h3>
        <span id="success-msg" style="color:green; font-weight:bold;"></span>
        <form id='modify-rental-form' novalidate>
        <label>${t('rental_user_id')}: <input type='number' id='user_id' value='${rental.user_id}' required></label><br>
        <span id="error-user_id" style="color:red; font-size:0.9em;"></span><br>
        
        <label>${t('rental_car_id')}: <input type='number' id='car_id' value='${rental.car_id}' required></label><br>
        <span id="error-car_id" style="color:red; font-size:0.9em;"></span><br>
        
        <label>${t('rental_start')}: <input type='date' id='rental_start' value='${rental.rental_start}' required></label><br>
        <span id="error-rental_start" style="color:red; font-size:0.9em;"></span><br>
        
        <label>${t('rental_end')}: <input type='date' id='rental_end' value='${rental.rental_end ?? ''}' ></label><br>
        <span id="error-rental_end" style="color:red; font-size:0.9em;"></span><br>
        
        <button type='submit'> ${t('rental_mod_title')} </button>
        </form>
        `;
    document.getElementById('display-area').innerHTML = html;
    document.getElementById('modify-rental-form').onsubmit= (e) =>
    {   
        e.preventDefault();
        
        document.querySelectorAll('span[id^="error-"]').forEach(el => el.innerText = '');
        let isValid = true;

        const userId = parseInt(document.getElementById('user_id').value);
        if(isNaN(userId) || userId <= 0) {
            document.getElementById('error-user_id').innerText = t('err_user_id');
            isValid = false;
        }

        const carId = parseInt(document.getElementById('car_id').value);
        if(isNaN(carId) || carId <= 0) {
            document.getElementById('error-car_id').innerText = t('err_car_id');
            isValid = false;
        }

        const startVal = document.getElementById('rental_start').value;
        const endVal = document.getElementById('rental_end').value;

        if(!startVal) {
            document.getElementById('error-rental_start').innerText = t('err_date_req');
            isValid = false;
        }

        if(startVal && endVal) {
            if(new Date(endVal) < new Date(startVal)) {
                document.getElementById('error-rental_end').innerText = t('err_date_order');
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
            alert(t('err_fetch_data') + ': ' + error.message);
        } }
    
    ,async modifyRental(rental_id,rentalData){
        document.querySelectorAll('span[id^="error-"]').forEach(el => el.innerText = '')
        try{
            await ApiService.patch(`/rentals/updateRental/${rental_id}`,rentalData);
             document.getElementById('success-msg').innerHTML = t('rental_mod_success');
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