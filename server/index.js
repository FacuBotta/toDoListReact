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
                res.status(400).json({ auth: false, message: 'Invalid username or password' });
            }
        } else {
            res.status(400).json({ auth: false, message: 'Invalid username or password' });
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
        validatedToken(req, res, () => {
            if (!req.authenticated) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const userId = req.userId;
            const userName = req.userName
            return res.json({ auth: true, userId: userId, userName: userName });
        });
    } catch (err) {
        return res.status(400).json({ error: 'Invalid token or session expired' });
    }
});

app.post('/api/getUser', async (req, res) => {
    validatedToken(req, res, async () => {
        if (!req.authenticated) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const idUser = req.userId;
        const sqlSelectedUser = `SELECT g.id_group, g.group_name, g.created_at, g.updated_at, \
            JSON_ARRAYAGG(JSON_OBJECT('id_task', t.id_task, 'status', t.status, 'priority', t.priority, \ 
            'name', t.task_name, 'description', t.description_task, 'order_task', t.order_task, 'created_at', \ 
            t.created_at, 'updated_at', t.updated_at, 'id_user', t.id_user, 'id_group', t.id_group)) AS tasks \
            FROM grouptask g \
            LEFT JOIN tasks t \
            ON g.id_user = t.id_user AND g.id_group = t.id_group \ 
            WHERE g.id_user = ? \
            GROUP BY g.id_group, g.group_name;`;

        try {
            const result = await dbQuery(sqlSelectedUser, idUser);
            res.send(result);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});

app.post('/api/insertTask', (req, res) => {
    validatedToken(req, res, () => {
        if (!req.authenticated) {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        const { status, priority, newDescription, taskName, order, groupId } = req.body;
        const idUser = req.userId;
        const insertTask = 'INSERT INTO tasks (status, priority, id_user, id_group, description_task, task_name, order_task) VALUES (?, ?, ?, ?, ?, ?, ?)';
        try {
            const result = dbQuery(insertTask, [status, priority, idUser, groupId, newDescription, taskName, order]);
            res.send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Error adding task, try again' });
        }
    })
});
app.post('/api/insertGroup', (req, res) => {
    validatedToken(req, res, () => {
        if (!req.authenticated) {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        const { groupName } = req.body;
        const idUser = req.userId;
        const insertGroup = 'INSERT INTO grouptask (id_user, group_name) VALUES (?, ?)';
        try {
            const result = dbQuery(insertGroup, [idUser, groupName]);
            res.send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Error adding group, try again' });
        }
    })
});
app.post('/api/deleteGroupTasks', (req, res) => {
    try {
        validatedToken(req, res, async () => {
            if (!req.authenticated) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { groupId } = req.body;
            const idUser = req.userId;

            const deleteTasksQuery = `DELETE FROM tasks WHERE id_group = ? AND id_user = ?`;
            await dbQuery(deleteTasksQuery, [idUser, groupId]);

            const deleteGroupQuery = `DELETE FROM grouptask WHERE id_group = ? AND id_user = ?`;
            await dbQuery(deleteGroupQuery, [groupId, idUser]);

            res.status(200).json({ message: 'Group and tasks deleted' });
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting group and tasks' });
    }
})

app.post('/api/updateTaskDrag', async (req, res) => {
    const { tasks, groupId } = req.body;
    const updateTask = `UPDATE tasks t SET status = ?, order_task = ? WHERE id_user = ? AND id_task = ? AND id_group = ?`;
    try {
        for (const task of tasks) {
            const result = await dbQuery(updateTask, [
                task.status,
                task.order_task,
                task.id_user,
                task.id_task,
                groupId,
            ]);
        }
        res.send({ message: 'Tasks updates!' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Error updating task, try again' });
    }
});
app.post('/api/updateTask', async (req, res) => {
    const { priority, description, taskName, idUser, idTask, groupId } = req.body;
    const updateTask = `UPDATE tasks t SET priority = ?, description_task = ?, task_name = ? \
        WHERE id_user = ? AND id_task = ? AND id_group = ?`;
    try {
        const result = await dbQuery(updateTask, [priority, description, taskName, idUser, idTask, groupId]);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Error deleting task, try again' });
    }
});
/* app.post('/api/deleteTask', (req, res) => {
    const { task, groupId } = req.body;
    validatedToken(req, res, () => {
        if (!req.authenticated) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const deleteTask = `DELETE FROM tasks WHERE id_task = ? AND id_user = ? AND id_group = ?`
        const idUser = req.userId;
        try {
            const result = dbQuery(deleteTask, [task, idUser, groupId]);
            res.send(result)
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Error deleting task, try again' });
        }
    })
}) */
app.post('/api/deleteTask', async (req, res) => {
    const { task, groupId } = req.body;
    validatedToken(req, res, async () => {
        if (!req.authenticated) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const deleteTask = `DELETE FROM tasks WHERE id_task = ? AND id_user = ? AND id_group = ?`;
        const idUser = req.userId;
        try {
            const result = await dbQuery(deleteTask, [task, idUser, groupId]);
            res.send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Error deleting task, try again' });
        }
    });
});
app.post('/api/signup', async (req, res) => {
    const { userName, password, passwordConfirm, userEmail } = req.body;
    if (password !== passwordConfirm) {
        return res.status(400).json({ error: 'Passwords do not match!' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
        return res.status(400).json({ error: 'Invalid email format!' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sqlInsert = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

        db.query(sqlInsert, [userName, userEmail, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal server error');
            }
            return res.status(201).json({ message: 'User created!' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/deleteUser', (req, res) => {
    try {
        validatedToken(req, res, async () => {
            if (!req.authenticated) {
                return res.status(401).json({ error: 'Unauthorized', message: 'Login to continue' });
            }
            const idUser = req.userId;

            const deleteTasksQuery = `DELETE FROM tasks WHERE id_user = ?`;
            await dbQuery(deleteTasksQuery, idUser);

            const deleteGroupQuery = `DELETE FROM grouptask WHERE id_user = ?`;
            await dbQuery(deleteGroupQuery, idUser);

            const deleteUserQuery = `DELETE FROM users WHERE id_user = ?`;
            await dbQuery(deleteUserQuery, idUser);

            res.status(200).json({ message: 'User and associated tasks deleted' });
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting user and tasks' });
    }
})