const CarModule={
    async carList(){
        const data = await ApiService.get('/cars');
        let html = `<h3>Lista Samochodów</h3><table><tr><th>ID</th><th>Marka</th><th>Model</th><th>Rok</th></tr>`;
        data.forEach(c => html += `<tr><td>${c.id}</td><td>${c.make}</td><td>${c.model}</td><td>${c.year}</td></tr>`);
        document.getElementById('display-area').innerHTML = html + "</table>";
    },
    async detaiCarList(){
        const data=await ApiService.get('/cars');
        let html=`<h3>Lista Szczegółowa Samochodów</h3><table><tr><th>ID</th><th>Marka</th><th>Model</th><th>Rok</th><th>Kolor</th><th>Rejestracja</th></tr>`;
        data.forEach(c=>html+=`<tr><td>${c.id}</td><td>${c.make}</td><td>${c.model}</td><td>${c.year}</td><td>${c.color}</td><td>${c.registration}</td></tr>`);
        document.getElementById('display-area').innerHTML=html+"</table>";
    }


}