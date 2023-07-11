const express = require('express');
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'list_to_do_db',
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database!');
    connection.release();
});

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    key: "userId",
    secret: "suscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24 * 1000,
    }
}))

app.post('/api/login', async (req, res) => {
    const { userName, password } = req.body;
    const sqlSelect = 'SELECT * FROM users WHERE name = ?';

    try {
        const result = await dbQuery(sqlSelect, [userName]);
        if (result.length > 0) {
            const user = result[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const userData = {
                    id_user: user.id_user,
                    name: user.name,
                };
                req.session.user = userData;
                res.send(userData);
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
app.post('/api/insertTask', async (req, res) => {
    const { priority, description, taskName } = req.body;
    const idUser = req.session.user.id_user;
    const status = 'Pendiente';
    const insertTask = 'INSERT INTO tasks (status, priority, id_user, description_task, task_name) VALUES (?, ?, ?, ?, ?)';
    try {
        const result = await dbQuery(insertTask, [status, priority, idUser, description, taskName]);
        console.log(result)
        // req.send(result);
    } catch(error) {
        console.log(error);
    }

})
app.get('/api/getUser', (req, res) => {
    const idUser = req.session.user.id_user;
    console.log(req.session.user)
    const sqlSelectedUser = `SELECT u.name, u.updated_at, ( SELECT GROUP_CONCAT(t.task_name SEPARATOR ', ') FROM tasks t WHERE t.id_user = u.id_user)\
    AS task_names, ( SELECT GROUP_CONCAT(t.id_task SEPARATOR ', ') FROM tasks t WHERE t.id_user = u.id_user) AS id_tasks,\
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







app.listen(3001, () => {
    console.log('Running on port 3001');
});
