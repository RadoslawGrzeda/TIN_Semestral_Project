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
-- Hasło dla admina (Admin123!): 7f369ee618cc9d22631525baacb6ce22a1012cf16834b726ae045339f40c744f
-- Hasło dla usera (User123!): 60de793427183e20600bc141d014bc122144368581e64906b38c2378931121d7
INSERT INTO users (username, email, date_of_birth, hashed_password, role) VALUES 
('admin_piotr', 'admin@carrental.pl', '1988-03-12', '7f369ee618cc9d22631525baacb6ce22a1012cf16834b726ae045339f40c744f', 'admin'),
('jan_kowalski', 'jan.k@gmail.com', '1995-11-20', '60de793427183e20600bc141d014bc122144368581e64906b38c2378931121d7', 'user'),
('anna_nowak', 'anna.n@yahoo.com', '1990-07-15', '60de793427183e20600bc141d014bc122144368581e64906b38c2378931121d7', 'user');

-- Przykładowe samochody
INSERT INTO cars (brand, model, production_year, daily_rental_price, description) VALUES 
('Toyota', 'Corolla', '2022-01-01', 150.00, 'Niezawodny sedan, niskie spalanie'),
('Tesla', 'Model 3', '2023-01-01', 450.00, 'Elektryczny, pełne wyposażenie'),
('BMW', 'X5', '2021-01-01', 350.00, 'Luksusowy SUV'),
('Ford', 'Focus', '2020-05-10', 120.00, 'Ekonomiczny hatchback'),
('Audi', 'A4', '2023-03-15', 280.00, 'Sportowy sedan premium');

-- Przykładowe wynajmy
INSERT INTO rentals (user_id, car_id, rental_start, rental_end) VALUES 
(2, 1, '2024-01-10', '2024-01-15'),
(2, 3, '2024-02-01', NULL),
(3, 2, '2024-02-05', '2024-02-08'),
(3, 4, '2024-03-01', NULL);