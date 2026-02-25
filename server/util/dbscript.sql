DROP TABLE IF EXISTS race_results;
DROP TABLE IF EXISTS races;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS tracks;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS teams;


-- 1. ZESPOŁY
CREATE TABLE teams (
                       id INT NOT NULL AUTO_INCREMENT,
                       name VARCHAR(100) NOT NULL,
                       base VARCHAR(100),
                       team_principal VARCHAR(100),
                       power_unit VARCHAR(50),
                       founded_year INT,
                       is_active BOOLEAN DEFAULT 1,
                       team_image_url VARCHAR(500),
                       PRIMARY KEY (id)
);

-- 2. TORY
CREATE TABLE tracks (
                        id INT NOT NULL AUTO_INCREMENT,
                        name VARCHAR(100) NOT NULL,
                        location VARCHAR(100),
                        length_km DECIMAL(4,3),
                        corners INT,
                        is_active BOOLEAN DEFAULT 1,
                        PRIMARY KEY (id)
);

-- 3. KIEROWCY
CREATE TABLE drivers (
                         id INT NOT NULL AUTO_INCREMENT,
                         driver_number INT,
                         first_name VARCHAR(100) NOT NULL,
                         last_name VARCHAR(100) NOT NULL,
                         country VARCHAR(100),
                         team_id INT,
                         is_active BOOLEAN DEFAULT 1,
                         imageUrl VARCHAR(500),
                         PRIMARY KEY (id),
                         UNIQUE INDEX idx_driver_number (driver_number),
                         CONSTRAINT fk_driver_team FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- 4. UŻYTKOWNICY
CREATE TABLE users (
                       id INT NOT NULL AUTO_INCREMENT,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       role ENUM('admin', 'team_principal', 'user') DEFAULT 'user',
                       team_id INT,
                       PRIMARY KEY (id),
                       CONSTRAINT fk_user_team FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- 5. WYŚCIGI
CREATE TABLE races (
                       id INT NOT NULL AUTO_INCREMENT,
                       name VARCHAR(100) NOT NULL,
                       date DATE NOT NULL,
                       track_id INT NOT NULL,
                       round INT NOT NULL,
                       race_image_url VARCHAR(200),
                       PRIMARY KEY (id),
                       CONSTRAINT fk_race_track FOREIGN KEY (track_id) REFERENCES tracks(id)
);

-- 6. WYNIKI
CREATE TABLE race_results (
                              id INT NOT NULL AUTO_INCREMENT,
                              race_id INT NOT NULL,
                              driver_id INT NOT NULL,
                              team_id INT NOT NULL,
                              position INT NOT NULL,
                              fastest_lap BOOLEAN DEFAULT 0,
                              points INT NOT NULL,

                              PRIMARY KEY (id),
                              UNIQUE KEY idx_race_driver (race_id, driver_id),

                              CONSTRAINT fk_result_race FOREIGN KEY (race_id) REFERENCES races(id) ON DELETE CASCADE,
                              CONSTRAINT fk_result_driver FOREIGN KEY (driver_id) REFERENCES drivers(id),
                              CONSTRAINT fk_result_team FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- A. ZESPOŁY
INSERT INTO teams (name, base, team_principal, power_unit, founded_year, team_image_url) VALUES
                                                                                             ('Oracle Red Bull Racing', 'Milton Keynes, UK', 'Christian Horner', 'Honda RBPT', 2005, 'https://cdna.artstation.com/p/assets/images/images/085/769/922/large/opticaldreamsoft-screenshot-008.jpg?1741615312'),
                                                                                             ('Scuderia Ferrari HP', 'Maranello, Italy', 'Frédéric Vasseur', 'Ferrari', 1929, 'https://swiatwyscigow.pl/images/articles/2025/f1-aktualnosci-krwiste-ferrari-sf-25-w-sezonie-2025-f1.jpg'),
                                                                                             ('Mercedes-AMG PETRONAS', 'Brackley, UK', 'Toto Wolff', 'Mercedes', 2010, 'https://media.formula1.com/image/upload/t_16by9Centre/c_lfill,w_3392/q_auto/v1740000000/fom-website/2025/Mercedes/Formula%201%20header%20templates%20-%202025-02-24T142144.270.webp'),
                                                                                             ('McLaren Formula 1 Team', 'Woking, UK', 'Andrea Stella', 'Mercedes', 1963, 'https://mclaren.bloomreach.io/cdn-cgi/image/width=680,height=460,fit=crop,quality=80,format=webp/delivery/resources/content/gallery/mclaren-racing/formula-1/2025/nsr/f1-75-live-m/web/mcl39_op_sider_8k.jpg'),
                                                                                             ('Aston Martin Aramco', 'Silverstone, UK', 'Mike Krack', 'Mercedes', 2021, 'https://assets.astonmartinf1.com/public/cms/1GojRNFCs5Kx4IOf88u0mh/19971fe26711b3b219d441fce6cb9f41/SHOT6_1x1_copy_low.jpg?&h=600&w=1440&fit=thumb'),
                                                                                             ('BWT Alpine F1 Team', 'Enstone, UK', 'Oliver Oakes', 'Renault', 2021, 'https://motorsportmagazine.b-cdn.net/wp-content/uploads/2025/02/Alpine-2025-scaled.jpg'),
                                                                                             ('Williams Racing', 'Grove, UK', 'James Vowles', 'Mercedes', 1977, 'https://cdn.sanity.io/images/fnx611yr/production/7646e1734aef24c6f791a90f9bbba4959c95aa0f-4096x2304.jpg'),
                                                                                             ('Visa Cash App RB', 'Faenza, Italy', 'Laurent Mekies', 'Honda RBPT', 2024, 'https://img.redbull.com/images/q_auto,f_auto/redbullcom/2024/2/9/myjcfv3zwi8nfzbmg7oa/vcarb-01-visa-cash-app-rb-f1-team-2024'),
                                                                                             ('Stake F1 Team Kick Sauber', 'Hinwil, Switzerland', 'Alessandro Alunni Bravi', 'Ferrari', 1993, 'https://globalgamblingnews.com/wp-content/uploads/2025/02/Stake.png'),
                                                                                             ('MoneyGram Haas F1 Team', 'Kannapolis, USA', 'Ayao Komatsu', 'Ferrari', 2016, 'https://i.redd.it/moneygram-haas-f1-team-2025-livery-v0-vr2ct4ssmyje1.jpg?width=2048&format=pjpg&auto=webp&s=bdc836094fb05811e3f9351b3c05800fc00ba071');

-- B. TORY
INSERT INTO tracks (name, location, length_km, corners, is_active) VALUES
                                                                       ('Albert Park Circuit', 'Melbourne, Australia', 5.278, 14, 1),             -- ID 1
                                                                       ('Shanghai International Circuit', 'Shanghai, China', 5.451, 16, 1),       -- ID 2
                                                                       ('Suzuka International Circuit', 'Suzuka, Japan', 5.807, 18, 1),           -- ID 3
                                                                       ('Bahrain International Circuit', 'Sakhir, Bahrain', 5.412, 15, 1),        -- ID 4
                                                                       ('Jeddah Corniche Circuit', 'Jeddah, Saudi Arabia', 6.174, 27, 1),         -- ID 5
                                                                       ('Miami International Autodrome', 'Miami, USA', 5.412, 19, 1),             -- ID 6
                                                                       ('Autodromo Enzo e Dino Ferrari', 'Imola, Italy', 4.909, 19, 1),           -- ID 7
                                                                       ('Circuit de Monaco', 'Monte Carlo, Monaco', 3.337, 19, 1),                -- ID 8
                                                                       ('Circuit de Barcelona-Catalunya', 'Montmeló, Spain', 4.657, 14, 1),       -- ID 9
                                                                       ('Circuit Gilles Villeneuve', 'Montreal, Canada', 4.361, 14, 1),           -- ID 10
                                                                       ('Red Bull Ring', 'Spielberg, Austria', 4.318, 10, 1),                     -- ID 11
                                                                       ('Silverstone Circuit', 'Silverstone, UK', 5.891, 18, 1),                  -- ID 12
                                                                       ('Circuit de Spa-Francorchamps', 'Stavelot, Belgium', 7.004, 19, 1),       -- ID 13
                                                                       ('Hungaroring', 'Mogyoród, Hungary', 4.381, 14, 1),                        -- ID 14
                                                                       ('Zandvoort', 'Zandvoort, Netherlands', 4.259, 14, 1),                     -- ID 15
                                                                       ('Autodromo Nazionale Monza', 'Monza, Italy', 5.793, 11, 1),               -- ID 16
                                                                       ('Baku City Circuit', 'Baku, Azerbaijan', 6.003, 20, 1),                   -- ID 17
                                                                       ('Marina Bay Street Circuit', 'Singapore', 4.940, 19, 1),                  -- ID 18
                                                                       ('Circuit of the Americas', 'Austin, USA', 5.513, 20, 1),                  -- ID 19
                                                                       ('Autódromo Hermanos Rodríguez', 'Mexico City, Mexico', 4.304, 17, 1),     -- ID 20
                                                                       ('Interlagos', 'São Paulo, Brazil', 4.309, 15, 1),                         -- ID 21
                                                                       ('Las Vegas Strip Circuit', 'Las Vegas, USA', 6.201, 17, 1),               -- ID 22
                                                                       ('Lusail International Circuit', 'Lusail, Qatar', 5.419, 16, 1),           -- ID 23
                                                                       ('Yas Marina Circuit', 'Abu Dhabi, UAE', 5.281, 16, 1);                    -- ID 24

-- C. KIEROWCY (Sezon 2025)
INSERT INTO drivers (driver_number, first_name, last_name, country, team_id, imageUrl) VALUES
                                                                                           (1, 'Max', 'Verstappen', 'Netherlands', 1, 'https://cdn-8.motorsport.com/images/mgl/6D1XbeV0/s800/max-verstappen-red-bull-racing.jpg'),
                                                                                           (11, 'Sergio', 'Perez', 'Mexico', 1, 'https://cdn-2.motorsport.com/images/mgl/2y3qRdo6/s800/sergio-perez-red-bull-racing.jpg'),
                                                                                           (16, 'Charles', 'Leclerc', 'Monaco', 2, 'https://img2.51gt3.com/rac/racer/202503/fe2de9975d864e38acfd9933164954a6.png?x-oss-process=style/_nowm'),
                                                                                           (44, 'Lewis', 'Hamilton', 'UK', 2, 'https://f1mavericks.com/wp-content/uploads/2025/11/Lewis-Hamilton.jpg'),
                                                                                           (63, 'George', 'Russell', 'UK', 3, 'https://img2.51gt3.com/rac/racer/202503/f10f01a1704147ca90ab3a4325f38785.png?x-oss-process=style/_nhd_en'),
                                                                                           (12, 'Andrea Kimi', 'Antonelli', 'Italy', 3, 'https://img2.51gt3.com/rac/racer/202503/bcca7f61b6684e26bb28aedaf8d97c53.png'),
                                                                                           (4, 'Lando', 'Norris', 'UK', 4, 'https://img2.51gt3.com/rac/racer/202503/cfc139b2b49e48cd80a436c00a71711d.png'),
                                                                                           (81, 'Oscar', 'Piastri', 'Australia', 4, 'https://img2.51gt3.com/rac/racer/202503/4a3ecd96c2fd49508824cae497bfcec3.png?x-oss-process=style/_nowm'),
                                                                                           (14, 'Fernando', 'Alonso', 'Spain', 5, 'https://img2.51gt3.com/rac/racer/202503/25ccca7ffa96437aa54f169a4e9338fa.png?x-oss-process=style/_nowm'),
                                                                                           (18, 'Lance', 'Stroll', 'Canada', 5, 'https://parcfer.me/_next/image?url=https%3A%2F%2Fimages.parcfer.me%2Fkierowcy%2F9fa615121bb9-projekt-bez-nazwy173.png&w=2048&q=75'),
                                                                                           (10, 'Pierre', 'Gasly', 'France', 6, 'https://img2.51gt3.com/rac/racer/202503/2e2727ea4b564c55a6b5e18a25d7e230.png?x-oss-process=style/_nowm'),
                                                                                           (7, 'Jack', 'Doohan', 'Australia', 6, 'https://img2.51gt3.com/rac/racer/202503/57bb84ad50934c638d088c8d2d0ef8db.png?x-oss-process=style/_nowm'),
                                                                                           (23, 'Alexander', 'Albon', 'Thailand', 7, 'https://img2.51gt3.com/rac/racer/202503/1f1fd439e5344c7a83faf4a80d09486f.png'),
                                                                                           (55, 'Carlos', 'Sainz', 'Spain', 7, 'https://cdn-5.motorsport.com/images/mgl/2jXPqrg6/s8/carlos-sainz-williams.jpg'),
                                                                                           (22, 'Yuki', 'Tsunoda', 'Japan', 8, 'https://cdn-9.motorsport.com/images/mgl/2y3jXqg6/s800/yuki-tsunoda-red-bull-racing.jpg'),
                                                                                           (30, 'Liam', 'Lawson', 'New Zealand', 8, 'https://img2.51gt3.com/rac/racer/202503/3a6b5ab450b040feb7cab3cb50e9a53f.png?x-oss-process=style/_nowm'),
                                                                                           (27, 'Nico', 'Hulkenberg', 'Germany', 9, 'https://img2.51gt3.com/rac/racer/202503/737aac3065d74096b767308cf4c3164e.png?x-oss-process=style/_nowm'),
                                                                                           (77, 'Gabriel', 'Bortoleto', 'Brazil', 9, 'https://img2.51gt3.com/rac/racer/202503/d7cd7274c65147fb9ec59fd7d5ff2413.png?x-oss-process=style/_nowm'),
                                                                                           (31, 'Esteban', 'Ocon', 'France', 10, 'https://img2.51gt3.com/rac/racer/202503/34d4155677ae4874aae0240f9b366cc3.png?x-oss-process=style/_nowm'),
                                                                                           (87, 'Oliver', 'Bearman', 'UK', 10, 'https://img2.51gt3.com/rac/racer/202503/b4e1b56f7f2a4c989f16787b26852cba.png?x-oss-process=style/_nowm');

-- D. UŻYTKOWNICY
INSERT INTO users (email, password_hash, role, team_id)
VALUES (
           'admin@f1.com',
           '$2a$12$HqXXZ1TTb4Z0OV9jYUS7X.A1tYCPWRn6FhSVcsGDxjXm92BWw35yS',
           'admin',
           NULL
       );


-- E. WYŚCIGI
INSERT INTO races (name, date, track_id, round, race_image_url) VALUES
                                                                    ('Australian Grand Prix', '2025-03-16', 1, 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Australia.svg/1280px-Flag_of_Australia.svg.png'),
                                                                    ('Chinese Grand Prix', '2025-03-23', 2, 2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/1280px-Flag_of_the_People%27s_Republic_of_China.svg.png'),
                                                                    ('Japanese Grand Prix', '2025-04-06', 3, 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/1280px-Flag_of_Japan.svg.png'),
                                                                    ('Bahrain Grand Prix', '2025-04-13', 4, 4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_Bahrain.svg/1280px-Flag_of_Bahrain.svg.png'),
                                                                    ('Saudi Arabian Grand Prix', '2025-04-20', 5, 5, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_Saudi_Arabia.svg/1280px-Flag_of_Saudi_Arabia.svg.png'),
                                                                    ('Miami Grand Prix', '2025-05-04', 6, 6, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/1280px-Flag_of_the_United_States.svg.png'),
                                                                    ('Emilia Romagna Grand Prix', '2025-05-18', 7, 7, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/1280px-Flag_of_Italy.svg.png'),
                                                                    ('Monaco Grand Prix', '2025-05-25', 8, 8, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Flag_of_Monaco.svg/1280px-Flag_of_Monaco.svg.png'),
                                                                    ('Spanish Grand Prix', '2025-06-01', 9, 9, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Spain.svg/1280px-Flag_of_Spain.svg.png'),
                                                                    ('Canadian Grand Prix', '2025-06-15', 10, 10, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1280px-Flag_of_Canada_%28Pantone%29.svg.png'),
                                                                    ('Austrian Grand Prix', '2025-06-29', 11, 11, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Flag_of_Austria.svg/1280px-Flag_of_Austria.svg.png'),
                                                                    ('British Grand Prix', '2025-07-06', 12, 12, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1280px-Flag_of_the_United_Kingdom_%281-2%29.svg.png'),
                                                                    ('Belgian Grand Prix', '2025-07-27', 13, 13, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_Belgium.svg/1280px-Flag_of_Belgium.svg.png'),
                                                                    ('Hungarian Grand Prix', '2025-08-03', 14, 14, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1280px-Flag_of_Hungary.svg.png'),
                                                                    ('Dutch Grand Prix', '2025-08-31', 15, 15, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Flag_of_the_Netherlands.svg/1280px-Flag_of_the_Netherlands.svg.png'),
                                                                    ('Italian Grand Prix', '2025-09-07', 16, 16, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/1280px-Flag_of_Italy.svg.png'),
                                                                    ('Azerbaijan Grand Prix', '2025-09-21', 17, 17, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Flag_of_Azerbaijan.svg/1280px-Flag_of_Azerbaijan.svg.png'),
                                                                    ('Singapore Grand Prix', '2025-10-05', 18, 18, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Singapore.svg/1280px-Flag_of_Singapore.svg.png'),
                                                                    ('United States Grand Prix', '2025-10-19', 19, 19, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/1280px-Flag_of_the_United_States.svg.png'),
                                                                    ('Mexico City Grand Prix', '2025-10-26', 20, 20, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Mexico.svg/1280px-Flag_of_Mexico.svg.png'),
                                                                    ('São Paulo Grand Prix', '2025-11-09', 21, 21, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/1280px-Flag_of_Brazil.svg.png'),
                                                                    ('Las Vegas Grand Prix', '2025-11-22', 22, 22, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/1280px-Flag_of_the_United_States.svg.png'),
                                                                    ('Qatar Grand Prix', '2025-11-30', 23, 23, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_Qatar.svg/1280px-Flag_of_Qatar.svg.png'),
                                                                    ('Abu Dhabi Grand Prix', '2025-12-07', 24, 24, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_United_Arab_Emirates.svg/1280px-Flag_of_the_United_Arab_Emirates.svg.png');
-- F. WYNIKI WYŚCIGÓW
-- ==========================================
-- RUNDA 1: AUSTRALIAN GRAND PRIX (Race ID: 1)
-- ==========================================
INSERT INTO race_results (race_id, driver_id, team_id, position, points, fastest_lap) VALUES
                                                                                          (1, 3, 2, 1, 25, 0),  -- Leclerc (Ferrari) - P1
                                                                                          (1, 1, 1, 2, 18, 0),  -- Verstappen (Red Bull) - P2
                                                                                          (1, 7, 4, 3, 16, 1),  -- Norris (McLaren) - P3 + FL
                                                                                          (1, 4, 2, 4, 12, 0),  -- Hamilton (Ferrari) - P4
                                                                                          (1, 8, 4, 5, 10, 0),  -- Piastri (McLaren) - P5
                                                                                          (1, 5, 3, 6, 8, 0),   -- Russell (Mercedes) - P6
                                                                                          (1, 14, 7, 7, 6, 0),  -- Sainz (Williams) - P7
                                                                                          (1, 2, 1, 8, 4, 0),   -- Perez (Red Bull) - P8
                                                                                          (1, 9, 5, 9, 2, 0),   -- Alonso (Aston Martin) - P9
                                                                                          (1, 13, 7, 10, 1, 0), -- Albon (Williams) - P10
                                                                                          (1, 6, 3, 11, 0, 0),  -- Antonelli
                                                                                          (1, 11, 6, 12, 0, 0), -- Gasly
                                                                                          (1, 15, 8, 13, 0, 0), -- Tsunoda
                                                                                          (1, 17, 9, 14, 0, 0), -- Hulkenberg
                                                                                          (1, 10, 5, 15, 0, 0), -- Stroll
                                                                                          (1, 19, 10, 16, 0, 0),-- Ocon
                                                                                          (1, 16, 8, 17, 0, 0), -- Lawson
                                                                                          (1, 18, 9, 18, 0, 0), -- Bortoleto
                                                                                          (1, 20, 10, 19, 0, 0),-- Bearman
                                                                                          (1, 12, 6, 20, 0, 0); -- Doohan

-- ==========================================
-- RUNDA 2: CHINESE GRAND PRIX (Race ID: 2)
-- ==========================================
INSERT INTO race_results (race_id, driver_id, team_id, position, points, fastest_lap) VALUES
                                                                                          (2, 1, 1, 1, 26, 1),  -- Verstappen (Red Bull) - P1 + FL
                                                                                          (2, 7, 4, 2, 18, 0),  -- Norris (McLaren) - P2
                                                                                          (2, 5, 3, 3, 15, 0),  -- Russell (Mercedes) - P3
                                                                                          (2, 3, 2, 4, 12, 0),  -- Leclerc (Ferrari) - P4
                                                                                          (2, 8, 4, 5, 10, 0),  -- Piastri (McLaren) - P5
                                                                                          (2, 4, 2, 6, 8, 0),   -- Hamilton (Ferrari) - P6
                                                                                          (2, 2, 1, 7, 6, 0),   -- Perez (Red Bull) - P7
                                                                                          (2, 9, 5, 8, 4, 0),   -- Alonso (Aston Martin) - P8
                                                                                          (2, 15, 8, 9, 2, 0),  -- Tsunoda (RB) - P9
                                                                                          (2, 6, 3, 10, 1, 0),  -- Antonelli (Mercedes) - P10
                                                                                          (2, 14, 7, 11, 0, 0), -- Sainz
                                                                                          (2, 13, 7, 12, 0, 0), -- Albon
                                                                                          (2, 11, 6, 13, 0, 0), -- Gasly
                                                                                          (2, 17, 9, 14, 0, 0), -- Hulkenberg
                                                                                          (2, 10, 5, 15, 0, 0), -- Stroll
                                                                                          (2, 16, 8, 16, 0, 0), -- Lawson
                                                                                          (2, 19, 10, 17, 0, 0),-- Ocon
                                                                                          (2, 20, 10, 18, 0, 0),-- Bearman
                                                                                          (2, 18, 9, 19, 0, 0), -- Bortoleto
                                                                                          (2, 12, 6, 20, 0, 0); -- Doohan

-- ==========================================
-- RUNDA 3: JAPANESE GRAND PRIX (Race ID: 3)
-- ==========================================
INSERT INTO race_results (race_id, driver_id, team_id, position, points, fastest_lap) VALUES
                                                                                          (3, 7, 4, 1, 25, 0),  -- Norris (McLaren) - P1
                                                                                          (3, 1, 1, 2, 18, 0),  -- Verstappen (Red Bull) - P2
                                                                                          (3, 8, 4, 3, 15, 0),  -- Piastri (McLaren) - P3
                                                                                          (3, 3, 2, 4, 13, 1),  -- Leclerc (Ferrari) - P4 + FL
                                                                                          (3, 5, 3, 5, 10, 0),  -- Russell (Mercedes) - P5
                                                                                          (3, 15, 8, 6, 8, 0),  -- Tsunoda (RB) - P6 (Home Race Hero!)
                                                                                          (3, 4, 2, 7, 6, 0),   -- Hamilton (Ferrari) - P7
                                                                                          (3, 14, 7, 8, 4, 0),  -- Sainz (Williams) - P8
                                                                                          (3, 2, 1, 9, 2, 0),   -- Perez (Red Bull) - P9
                                                                                          (3, 9, 5, 10, 1, 0),  -- Alonso (Aston Martin) - P10
                                                                                          (3, 13, 7, 11, 0, 0), -- Albon
                                                                                          (3, 6, 3, 12, 0, 0),  -- Antonelli
                                                                                          (3, 17, 9, 13, 0, 0), -- Hulkenberg
                                                                                          (3, 11, 6, 14, 0, 0), -- Gasly
                                                                                          (3, 10, 5, 15, 0, 0), -- Stroll
                                                                                          (3, 16, 8, 16, 0, 0), -- Lawson
                                                                                          (3, 19, 10, 17, 0, 0),-- Ocon
                                                                                          (3, 12, 6, 18, 0, 0), -- Doohan
                                                                                          (3, 18, 9, 19, 0, 0), -- Bortoleto
                                                                                          (3, 20, 10, 20, 0, 0);-- Bearman


