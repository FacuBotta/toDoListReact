const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config({path:'../.env'});

const app = express();
const port = process.env.SERVER_PORT || 3002;
const dbOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};
const sessionOptions = {
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    store: new MySQLStore(dbOptions),
    resave: false,
    saveUninitialized: false,
};
const db = mysql.createPool(dbOptions);

db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    };
    console.log('Connected to database!');
    connection.release();
});

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session(sessionOptions));

app.on('close', () => {
    db.end((err) => {
        if (err) {
            console.error('Error closing database connection:', err);
        } else {
            console.log('Database connection closed.');
        }
    });
});
app.listen(port, () => {
    console.log(`Running on port: ${port} `);
});

function dbQuery(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
};
app.post('/api/login', async (req, res) => {
    const { userName, password } = req.body;
    const sqlSelect = 'SELECT * FROM users WHERE name = ?';
    try {
        const result = await dbQuery(sqlSelect, [userName]);
        if (result.length > 0) {
            const user = result[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.user = user.name;
                req.session.userId = user.id_user;
                res.send(req.session);e
            } else {
                res.status(401).send('Invalid username or password');
            }
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});
app.post('/api/getUser', (req, res) => {
        const idUser = req.session.userId;
        const sqlSelectedUser = `SELECT u.id_user, u.name, u.updated_at, ( SELECT GROUP_CONCAT(t.task_name SEPARATOR ', ') FROM tasks t WHERE t.id_user = u.id_user)\
    AS task_names, ( SELECT GROUP_CONCAT(t.order_task SEPARATOR ', ') FROM tasks t WHERE t.id_user = u.id_user) AS order_tasks,\
    ( SELECT GROUP_CONCAT(t.id_task SEPARATOR ', ') FROM tasks t WHERE t.id_user = u.id_user) AS id_tasks,\
    ( SELECT GROUP_CONCAT(t.description_task SEPARATOR ', ') FROM tasks t WHERE t.id_user = u.id_user)\
    AS task_descriptions, ( SELECT GROUP_CONCAT(t.created_at SEPARATOR ', ') FROM tasks t WHERE t.id_user = u.id_user)\
    AS task_created_at, ( SELECT GROUP_CONCAT(t.status SEPARATOR ', ') FROM tasks t WHERE t.id_user = u.id_user)\
    AS task_status, ( SELECT GROUP_CONCAT(t.priority SEPARATOR ', ') FROM tasks t WHERE t.id_user = u.id_user)\
    AS task_priority, ( SELECT GROUP_CONCAT(t.updated_at SEPARATOR ', ') FROM tasks t WHERE t.id_user = u.id_user)\
    AS task_updated_at FROM users u WHERE u.id_user = 1;`;
        db.query(sqlSelectedUser, [idUser], (err, result) => {
            if (err) {
                res.status(500).send('Internal server error');
                return;
            }
            res.send(result);
        });
});
app.post('/api/insertTask', async (req, res) => {
    const { status, priority, description, taskName, order } = req.body;
    const idUser = req.session.userId;
    console.log(req.session)
    const insertTask = 'INSERT INTO tasks (status, priority, id_user, description_task, task_name, order_task) VALUES (?, ?, ?, ?, ?, ?)';
    try {
        const result = await dbQuery(insertTask, [status, priority, idUser, description, taskName, order]);
        res.send(result);
    } catch (error) {
        console.log(error);
    }
});
app.post('/api/updateTaskDrag', async (req, res) => {
    const { tasks } = req.body;
    const updateTask = `UPDATE tasks t SET status = ?, order_task = ? WHERE id_user = ? && id_task = ?`;
    try {
        for (const task of tasks) {
            const result = await dbQuery(updateTask, [
                task.status,
                task.order_task,
                task.id_user,
                task.id_task,
            ]);
        }
        res.send({ message: 'Tareas actualizadas correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Error al actualizar las tareas' });
    }
});
app.post('/api/updateTask', async (req, res) => {
    const { idUser, idTask, priority, description, taskName } = req.body;
    const updateTask = `UPDATE tasks t SET priority = ?, description_task = ?, task_name = ? \
        WHERE id_user = ? && id_task = ?`;
    try {
        const result = await dbQuery(updateTask, [priority, description, taskName, idUser, idTask]);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});
app.post('/api/signup', async (req, res) => {
    const { userName, password, passwordConfirm, userEmail } = req.body;

    // Validar que la contraseña y su confirmación coincidan
    if (password !== passwordConfirm) {
        return res.status(400).json({ error: 'La contraseña y su confirmación no coinciden' });
    }

    // Validar el formato del correo electrónico utilizando una expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
        return res.status(400).json({ error: 'El formato del correo electrónico es inválido' });
    }

    try {
        // Generar un hash de la contraseña utilizando bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Guardar el nuevo usuario en la base de datos
        const sqlInsert = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

        db.query(sqlInsert, [userName, userEmail, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error interno del servidor');
            }
            return res.status(201).json({ message: 'Usuario registrado exitosamente' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

