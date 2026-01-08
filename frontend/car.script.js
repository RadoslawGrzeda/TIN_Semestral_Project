const CarModule = {
    async carList(skip=0, limit=5){
        
        const response = await ApiService.get(`/cars/?skip=${skip}&limit=${limit}`);
        const data = response.items || response;
        const total = response.total || 0;

        let html = `
        <h3>${t('cars_list')}</h3>
        <table>
        <tr>
        <th>${t('car_brand')}</th>
        <th>${t('car_model')}</th>
        <th>${t('car_year')}</th>
        <th>${t('car_price')}</th>
        <th>${t('actions')}</th>
        </tr>`;

        const role = localStorage.getItem('user_role');

        data.forEach(c => {
            html += `
            <tr>
            <td>${c.brand}</td>
            <td>${c.model}</td>
            <td>${c.production_year}</td>
            <td>${c.daily_rental_price}</td>
            <td>`;
            
            if (role === 'admin') {
                html += `<button onclick="CarModule.deleteCar(${c.id})">${t('delete')}</button>
                <button onclick="CarModule.modifyCarForm(${c.id})">${t('modify')}</button>`;
            } else {
                html += `<button disabled title="${t('only_admin')}">${t('no_action')}</button>`;
            }
            
            html += `</td></tr>`;
        });
        html += "</table><div id='car-pagination'></div>";
        document.getElementById('display-area').innerHTML = html;

        if(response.items){
            Utils.renderPagination(total, skip, limit, 'car-pagination', 'CarModule.carList');
        }
    },
    async detailCarList(skip=0, limit=5){
        
        const response = await ApiService.get(`/cars/showAllRelations?skip=${skip}&limit=${limit}`);
        const data = response.items || response; 
        const total = response.total || 0;

        let html = `<h3>${t('cars_list_detailed')}</h3>`;
        if(!data || data.length === 0){
            document.getElementById('display-area').innerHTML = `<p>${t('no_cars_found')}</p>`;
            return;
        }

        data.forEach(u => {
            html += `<div class="user-card">`;
            html += `<h4>${u.brand} ${u.model} (ID: ${u.id})</h4>`;
            html += `<p><strong>${t('car_year')}:</strong> ${u.production_year} &nbsp; <strong>${t('car_price')}:</strong> ${u.daily_rental_price} &nbsp; <strong>${t('car_desc')}:</strong> ${u.description ?? ''}</p>`;

            if(u.rentals && u.rentals.length > 0){
                html += `<details><summary>${t('menu_rentals')} (${u.rentals.length})</summary><ul>`;
                u.rentals.forEach(r => {
                    const user = r.user || {};
                    html += `<li>ID ${r.id}: ${r.rental_start} → ${r.rental_end ?? '...'} — ${t('menu_users')}: ${user.username ?? '—'} (ID: ${user.id ?? '—'})</li>`;
                });
                html += `</ul></details>`;
            } else {
                html += `<p><em>${t('no_rentals')}</em></p>`;
            }

            html += `</div>`;
        });
        
        html += "<div id='car-detail-pagination'></div>";
        document.getElementById('display-area').innerHTML = html;

        if (response.items) {
             Utils.renderPagination(total, skip, limit, 'car-detail-pagination', 'CarModule.detailCarList');
        }
    },
    addCarForm(){
        const html = `
            <h3>Dodaj nowy samochód</h3>
            <span id="success-msg" style="color:green; font-weight:bold;"></span>
            <form id="add-car-form">
                <label>${t('car_brand')}: <input type="text" id="brand" required></label><br>
                <span id="error-brand" style="color:red; font-size:0.9em;"></span><br>
                
                <label>${t('car_model')}: <input type="text" id="model" required></label><br>
                <span id="error-model" style="color:red; font-size:0.9em;"></span><br>
                
                <label>${t('car_year')}: <input type="number" id="production_year" required></label><br>
                <span id="error-production_year" style="color:red; font-size:0.9em;"></span><br>
                
                <label>${t('car_price')}: <input type="number" step="0.01" id="daily_rental_price" required></label><br>
                <span id="error-daily_rental_price" style="color:red; font-size:0.9em;"></span><br>
                
                <label>${t('car_desc')}: <input type="text" id="description"></label><br>
                <span id="error-description" style="color:red; font-size:0.9em;"></span><br>
                
                <button type="submit">${t('btn_add')}</button>
            </form>
        `;
        document.getElementById('display-area').innerHTML = html;
        document.getElementById('add-car-form').onsubmit = (e) => {
            e.preventDefault();
        
            document.querySelectorAll('span[id^="error-"]').forEach(el => el.innerText = '');
            let isValid = true;

            const brand = document.getElementById('brand').value;
            if(brand.length < 2 || brand.length > 20) {
                document.getElementById('error-brand').innerText = t('err_brand_len');
                isValid = false;
            }

            const model = document.getElementById('model').value;
            if(model.length < 2 || model.length > 20) {
                document.getElementById('error-model').innerText = t('err_model_len');
                isValid = false;
            }

            const year = parseInt(document.getElementById('production_year').value);
            const currentYear = new Date().getFullYear();
            if(year < 2000 || year > currentYear) {
                document.getElementById('error-production_year').innerText = t('err_prod_year').replace('{year}', currentYear);
                isValid = false;
            }

            const price = parseFloat(document.getElementById('daily_rental_price').value);
            if(price <= 100) {
                document.getElementById('error-daily_rental_price').innerText = t('err_price_min');
                isValid = false;
            }

            if(!isValid) return;

            const carData = {
                brand: brand,
                model: model,
                production_year: document.getElementById('production_year').value, // 
                production_year: year,
                daily_rental_price: price,
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
            document.getElementById('success-msg').innerText = t('car_added_success');
            document.getElementById('add-car-form').reset();
            setTimeout(() => this.carList(), 1500);
        }catch (error){
            if(error.details && Array.isArray(error.details)){
                error.details.forEach(err => {
                    const fieldName = err.loc[1];
                    const span = document.getElementById(`error-${fieldName}`);
                    if(span) span.innerText = err.msg;
                });
            } else {
                alert('Błąd podczas dodawania samochodu: '+error.message);
            }}
    },


    async modifyCarForm(carId){
        try{
            
            const car = await ApiService.get(`/cars/${carId}`);

        let html=`
                <h3>${t('car_mod_title')}</h3>
                <span id="mod-success-msg" style="color:green; font-weight:bold;"></span>
                <form id="modify-car-form">
                <label>${t('car_brand')}: 
                <input type="text" id="brand" value="${car.brand}" required></label><br>
                <span id="error-brand" style="color:red; font-size:0.9em;"></span><br>
                <label>${t('car_model')}:
                <input type="text" id="model" value="${car.model}" required></label><br>
                <span id="error-model" style="color:red; font-size:0.9em;"></span><br>
                <label>${t('car_year')}: <input type="number" id="production_year" value="${car.production_year}" required></label><br>
                <span id="error-production_year" style="color:red; font-size:0.9em;"></span><br>
                <label>${t('car_price')}: <input type="number" step="0.01" id="daily_rental_price"  value="${car.daily_rental_price}" required></label><br>
                <span id="error-daily_rental_price" style="color:red; font-size:0.9em;"></span><br>
                <label>${t('car_desc')}: <input type="text"  value="${car.description}" id="description"></label><br>
                <span id="error-description" style="color:red; font-size:0.9em;"></span><br>
        
                <button type="submit">${t('car_update_submit') || t('modify')}</button>
                </form>
        `;

        document.getElementById('display-area').innerHTML=html;
        document.getElementById('modify-car-form').onsubmit = async(e) => {
            e.preventDefault();
            
            document.querySelectorAll('span[id^="error-"]').forEach(el => el.innerText = '');
            let isValid = true;

            const brand = document.getElementById('brand').value;
            if(brand.length < 2 || brand.length > 20) {
                document.getElementById('error-brand').innerText = t('err_brand_len');
                isValid = false;
            }

            const model = document.getElementById('model').value;
            if(model.length < 2 || model.length > 20) {
                document.getElementById('error-model').innerText = t('err_model_len');
                isValid = false;
            }

            const year = parseInt(document.getElementById('production_year').value);
            const currentYear = new Date().getFullYear();
            if(year < 2000 || year > currentYear) {
                document.getElementById('error-production_year').innerText = t('err_prod_year').replace('{year}', currentYear);
                isValid = false;
            }

            const price = parseFloat(document.getElementById('daily_rental_price').value);
            if(price <= 100) {
                document.getElementById('error-daily_rental_price').innerText = t('err_price_min');
                isValid = false;
            }

            if(!isValid) return;

            const carData = {
                brand: brand,
                model: model,
                production_year: year,
                daily_rental_price: price,
                description: document.getElementById('description').value || null
            };
            CarModule.modifyCar(carId,carData)
}}catch (error){
            alert('Błąd podczas modyfikowania osoby: '+error.message);
        } },

async deleteCar(carId){
    try {
        await ApiService.delete(`/cars/deleteCar/${carId}`);
        alert(t('car_deleted'));
        this.carList();
    } catch (error) {
        alert('Error: ' + error.message);
    }
},


async modifyCar(carId,carData){
    document.querySelectorAll('span[id^="error-"]').forEach(el => el.innerText = '');
    try{

        await ApiService.patch(`/cars/updateCar/${carId}`,carData)
        document.getElementById('mod-success-msg').innerHTML = t('car_mod_success');
        setTimeout(() => this.carList(), 1500);
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