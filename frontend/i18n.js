const translations = {
    pl: {
        // Menu & General
        "menu_users": "Użytkownicy",
        "menu_cars": "Samochody",
        "menu_rentals": "Wynajmy",
        "btn_list": "Lista",
        "btn_details": "Szczegóły",
        "btn_add": "Dodaj",
        "btn_logout": "Wyloguj",
        "page_title_manage": "Zarządzanie: ",
        "select_action": "Wybierz akcję.",
        "delete": "Usuń",
        "modify": "Modyfikuj",
        "no_action": "Brak akcji",
        "previous": "Poprzednia",
        "next": "Następna",
        "page_x_of_y": "Strona ${currentPage} z ${totalPages}",
        "actions": "Akcje",
        
        // Users
        "users_list_simple": "Lista Uproszczona (Użytkownicy)",
        "users_list_detailed": "Lista Szczegółowa (Użytkownicy)",
        "user_login": "Login",
        "user_email": "Email",
        "user_dob": "Data urodzenia",
        "user_role": "Rola",
        "user_add_new": "Dodaj nowego użytkownika",
        "user_mod_title": "Modyfikuj użytkownika",
        "user_added_success": "Użytkownik został dodany!",
        "user_mod_success": "Użytkownik zmodyfikowany!",
        "user_deleted": "Użytkownik usunięty",
        
        // Cars
        "cars_list": "Lista Samochodów",
        "cars_list_detailed": "Lista Szczegółowa Samochodów",
        "car_brand": "Marka",
        "car_model": "Model",
        "car_year": "Rok produkcji",
        "car_price": "Cena/dzień",
        "car_color": "Kolor",
        "car_reg": "Rejestracja",
        "car_desc": "Opis",
        "car_add_new": "Dodaj nowy samochód",
        "car_mod_title": "Edytuj samochód",
        "car_added_success": "Samochód został dodany!",
        "car_mod_success": "Samochód zmodyfikowany!",
        "car_deleted": "Samochód usunięty",

        // Rentals
        "rentals_list": "Lista Wypożyczeń",
        "rentals_list_detailed": "Lista Szczegółowa Wypożyczeń",
        "rental_id": "ID",
        "rental_car_id": "ID Samochodu",
        "rental_user_id": "ID Użytkownika",
        "rental_start": "Data Wypożyczenia",
        "rental_end": "Data Zwrotu",
        "rental_add_new": "Dodaj nowe wypożyczenie",
        "rental_mod_title": "Modyfikuj wypożyczenie ID:",
        "rental_added_success": "Wypożyczenie zostało dodane!",
        "rental_mod_success": "Wypożyczenie zmodyfikowane!",
        "rental_deleted": "Wypożyczenie usunięte",
        
        // Auth
        "auth_login_title": "Logowanie",
        "auth_password": "Hasło",
        "auth_login_btn": "Zaloguj",
        "auth_register_link": "Zarejestruj się",
        "auth_register_title": "Rejestracja",
        "auth_dob": "Data urodzenia",
        "auth_register_btn": "Zarejestruj",
        "auth_back": "Wróć",

        // Common & Validation Specifics
        "only_admin": "Tylko administrator",
        "placeholder_no_change": "Pozostaw puste aby nie zmieniać",
        "no_users_found": "Brak użytkowników",
        "no_rentals": "Brak wypożyczeń",
        "err_username_format": "Login musi mieć 6-30 znaków (litery, cyfry, _)",
        "err_age_limit": "Użytkownik musi mieć conajmniej 18 lat",
        "err_password_min": "Hasło musi mieć conajmniej 8 znaków",
        "err_email_in_use": "Email jest już zajęty",
        "err_brand_len": "Marka musi mieć od 2 do 20 znaków",
        "err_model_len": "Model musi mieć od 2 do 20 znaków",
        "err_prod_year": "Rok produkcji musi być między 2000 a {year}",
        "err_price_min": "Cena musi być wyższa niż 100",
        "no_cars_found": "Brak samochodów",
        "err_user_id": "Podaj poprawne ID użytkownika",
        "err_car_id": "Podaj poprawne ID samochodu",
        "err_date_req": "Data wypożyczenia jest wymagana",
        "err_date_order": "Data zwrotu > Data wypożyczenia",
        "err_fetch_data": "Błąd pobierania danych pomocniczych",

        // Errors & Validation
        "err_connection": "Błąd połączenia z API",
        "err_login": "Błędne dane logowania",
        "err_required": "Pole wymagane",
        "err_min_length": "Wymagana długość: przynajmniej {n} znaków",
    },
    en: {
        // Menu & General
        "menu_users": "Users",
        "menu_cars": "Cars",
        "menu_rentals": "Rentals",
        "btn_list": "List",
        "btn_details": "Details",
        "btn_add": "Add",
        "btn_logout": "Logout",
        "page_title_manage": "Management: ",
        "select_action": "Select action.",
        "delete": "Delete",
        "modify": "Modify",
        "no_action": "No action",
        "previous": "Previous",
        "next": "Next",
        "page_x_of_y": "Page ${currentPage} of ${totalPages}",
        "actions": "Actions",

        // Users
        "users_list_simple": "Simple List (Users)",
        "users_list_detailed": "Detailed List (Users)",
        "user_login": "Username",
        "user_email": "Email",
        "user_dob": "Date of Birth",
        "user_role": "Role",
        "user_add_new": "Add new user",
        "user_mod_title": "Modify User",
        "user_added_success": "User added successfully!",
        "user_mod_success": "User modified successfully!",
        "user_deleted": "User deleted",

        // Cars
        "cars_list": "Car List",
        "cars_list_detailed": "Detailed Car List",
        "car_brand": "Brand",
        "car_model": "Model",
        "car_year": "Production Year",
        "car_price": "Price/Day",
        "car_color": "Color",
        "car_reg": "Registration",
        "car_desc": "Description",
        "car_add_new": "Add new car",
        "car_mod_title": "Edit Car",
        "car_added_success": "Car added successfully!",
        "car_mod_success": "Car modified successfully!",
        "car_deleted": "Car deleted",

        // Rentals
        "rentals_list": "Rentals List",
        "rentals_list_detailed": "Detailed Rentals List",
        "rental_id": "ID",
        "rental_car_id": "Car ID",
        "rental_user_id": "User ID",
        "rental_start": "Rental Date",
        "rental_end": "Return Date",
        "rental_add_new": "Add new rental",
        "rental_mod_title": "Modify Rental ID:",
        "rental_added_success": "Rental added successfully!",
        "rental_mod_success": "Rental modified successfully!",
        "rental_deleted": "Rental deleted",
        
        // Auth
        "auth_login_title": "Login",
        "auth_password": "Password",
        "auth_login_btn": "Log In",
        "auth_register_link": "Register",
        "auth_register_title": "Registration",
        "auth_dob": "Date of Birth",
        "auth_register_btn": "Register",
        "auth_back": "Back",

        // Common & Validation Specifics
        "only_admin": "Only administrator",
        "placeholder_no_change": "Leave empty to keep current",
        "no_users_found": "No users found",
        "no_rentals": "No rentals",
        "err_username_format": "Username must be 6-30 chars (letters, digits, _)",
        "err_age_limit": "User must be at least 18 years old",
        "err_password_min": "Password must be at least 8 chars long",
        "err_email_in_use": "Email is already in use",
        "err_brand_len": "Brand must be between 2 and 20 chars",
        "err_model_len": "Model must be between 2 and 20 chars",
        "err_prod_year": "Production year must be between 2000 and {year}",
        "err_price_min": "Price must be greater than 100",
        "no_cars_found": "No cars found",
        "err_user_id": "Provide valid User ID",
        "err_car_id": "Provide valid Car ID",
        "err_date_req": "Rental date is required",
        "err_date_order": "Return date > Rental date",
        "err_fetch_data": "Error fetching auxiliary data",

        // Errors & Validation
        "err_connection": "API Connection Error",
        "err_login": "Invalid login credentials",
        "err_required": "Field required",
        "err_min_length": "Minimum length: {n} characters",
    }
};

let currentLang = localStorage.getItem('app_lang') || 'pl';

function t(key, params = {}) {
    let text = translations[currentLang][key] || key;
    // Simple interpolation for things like ${currentPage} or {n} if needed
    // For now we handle basic manual replacement in components if complex
    return text;
}

function setLanguage(lang) {
    if(translations[lang]) {
        currentLang = lang;
        localStorage.setItem('app_lang', lang);
        location.reload(); // Najprostszy sposób odświeżenia tekstów
    }
}
