USE list_to_do_db;

CREATE TABLE users (
    id_user INT AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(60) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_user)
);

CREATE TABLE tasks (
    id_task INT AUTO_INCREMENT,
    status VARCHAR(25) NOT NULL,
    priority ENUM('low', 'medium', 'high') NOT NULL,
    id_user INT NOT NULL,
    description_task TEXT NULL,
    task_name VARCHAR(25) NOT NULL,
    order_task INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_task),
    FOREIGN KEY (id_user) REFERENCES Users (id_user)
);