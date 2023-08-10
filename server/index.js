const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

require('dotenv').config({ path: '../.env' });

const app = express();
const port = process.env.SERVER_PORT || 3002;
const dbOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));

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
const { createToken, validatedToken } = require('./jwt');

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
                const accessToken = createToken(user);
                res.cookie("access_token", accessToken, {
                    maxAge: 60 * 60 * 1000,
                    httpOnly: true,
                })
                res.json({ auth: true, id: user.id_user, name: user.name });
            } else {
                res.json({ auth: false, message: 'Invalid username or password' });
            }
        } else {
            res.json({ auth: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});
app.post('/api/logOut', (req, res) => {
    res.clearCookie('access_token');
    res.status(200).json({ logout: true, message: 'Logout successful' });
});
app.get('/api/isAuth', (req, res) => {
    try {
        // Aquí se aplicará el middleware de autenticación
        validatedToken(req, res, () => {
            // Una vez que el middleware ha validado el token, el control pasa a esta función
            if (!req.authenticated) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const userId = req.userId;
            const userName = req.userName
            return res.json({ auth: true, userId: userId, userName: userName });
        });
    } catch (err) {
        // Si el middleware lanza una excepción, el control pasa a esta sección para manejar el error.
        return res.status(400).json({ error: 'Invalid token or session expired' });
    }
});
app.post('/api/getUser', (req, res) => {
    validatedToken(req, res, () => {
        if (!req.authenticated) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const idUser = req.userId;
        const sqlSelectedUser = `SELECT u.id_user, u.name, u.updated_at, ( SELECT GROUP_CONCAT(t.task_name SEPARATOR ', ') FROM tasks t WHERE t.id_user = u.id_user)\
    AS task_names, ( SELECT GROUP_CONCAT(t.order_task SEPARATOR ', ') FROM tasks t WHERE t.id_user = u.id_user) AS order_tasks,\
    ( SELECT GROUP_CONCAT(t.id_task SEPARATOR ', ') FROM tasks t WHERE t.id_user = u.id_user) AS id_tasks,\
    ( SELECT GROUP_CONCAT(t.description_task SEPARATOR ', ') FROM tasks t WHERE t.id_user = u.id_user)\
    AS task_descriptions, ( SELECT GROUP_CONCAT(t.created_at SEPARATOR ', ') FROM tasks t WHERE t.id_user = u.id_user)\
    AS task_created_at, ( SELECT GROUP_CONCAT(t.status SEPARATOR ', ') FROM tasks t WHERE t.id_user = u.id_user)\
    AS task_status, ( SELECT GROUP_CONCAT(t.priority SEPARATOR ', ') FROM tasks t WHERE t.id_user = u.id_user)\
    AS task_priority, ( SELECT GROUP_CONCAT(t.updated_at SEPARATOR ', ') FROM tasks t WHERE t.id_user = u.id_user)\
    AS task_updated_at FROM users u WHERE u.id_user = ?;`;
        db.query(sqlSelectedUser, idUser, (err, result) => {
            if (err) {
                res.status(500).send('Internal server error');
                return;
            }
            res.send(result);
        });
    })

});
app.post('/api/insertTask', (req, res) => {
    validatedToken(req, res, () => {
        if (!req.authenticated) {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        const { status, priority, description, taskName, order } = req.body;
        const idUser = req.userId;
        const insertTask = 'INSERT INTO tasks (status, priority, id_user, description_task, task_name, order_task) VALUES (?, ?, ?, ?, ?, ?)';
        const result = dbQuery(insertTask, [status, priority, idUser, description, taskName, order]);
        res.send(result);
    })
    
});
app.post('/api/updateTaskDrag', async (req, res) => {
    const { tasks } = req.body;
    const updateTask = `UPDATE tasks t SET status = ?, order_task = ? WHERE id_user = ? AND id_task = ?`;
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
        WHERE id_user = ? AND id_task = ?`;
    try {
        const result = await dbQuery(updateTask, [priority, description, taskName, idUser, idTask]);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});
app.post('/api/deleteTask', (req, res) => {
    const { task } = req.body;
    validatedToken(req, res, () => {
        if (!req.authenticated) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const deleteTask = `DELETE FROM tasks WHERE id_task = ? AND id_user = ?`
        const idUser = req.userId;
        const result = dbQuery(deleteTask, [task, idUser]);
        res.send(result)
    })
})
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

