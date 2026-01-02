-- Tworzenie tabeli użytkowników
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user'
);

-- Tworzenie tabeli samochodów
CREATE TABLE cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    production_year DATE NOT NULL,
    daily_rental_price DECIMAL(10, 2) NOT NULL,
    description TEXT
);

-- Tworzenie tabeli łączącej (Relacja M:M z dodatkowymi kolumnami)
CREATE TABLE rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    rental_start DATE NOT NULL,
    rental_end DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- Przykładowi użytkownicy
INSERT INTO users (username, email, date_of_birth, hashed_password, role) VALUES 
('admin_piotr', 'admin@carrental.pl', '1988-03-12', 'zahashowane_haslo_123', 'admin'),
('jan_kowalski', 'jan.k@gmail.com', '1995-11-20', 'haslo_kowalskiego', 'user');

-- Przykładowe samochody
INSERT INTO cars (brand, model, production_year, daily_rental_price, description) VALUES 
('Toyota', 'Corolla', '2022-01-01', 150.00, 'Niezawodny sedan, niskie spalanie'),
('Tesla', 'Model 3', '2023-01-01', 450.00, 'Elektryczny, pełne wyposażenie'),
('BMW', 'X5', '2021-01-01', 350.00, 'Luksusowy SUV');

-- Przykładowe wynajmy (Relacja łącząca użytkownika 2 z samochodem 1)
INSERT INTO rentals (user_id, car_id, rental_start, rental_end) VALUES 
(2, 1, '2024-01-10', '2024-01-15'),
(2, 3, '2024-02-01', NULL); -- NULL oznacza, że auto jeszcze nie zostało zwrócone