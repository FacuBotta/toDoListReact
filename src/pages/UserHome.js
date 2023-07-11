import React, { useEffect, useState } from 'react'
import '../styles/App.css'
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import TasksFilter from '../components/TasksFilter';
import TasksList from '../components/TasksList';

const UserHome = () => {
    const [user, setUser] = useState('');
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/getUser', {
                    withCredentials: true
                });
                setUser(response.data[0].name);

                const processedTasks = response.data.map((item) => {
                    const idTask = item.id_tasks.split(', ');
                    const taskNames = item.task_names.split(', ');
                    const taskDescriptions = item.task_descriptions ? item.task_descriptions.split(', ') : [];
                    const taskCreatedAt = item.task_created_at.split(', ');
                    const taskStatus = item.task_status.split(', ');
                    const taskPriority = item.task_priority.split(', ');
                    const taskUpdatedAt = item.task_updated_at.split(', ');

                    const taskArray = [];

                    for (let i = 0; i < idTask.length; i++) {
                        const task = {
                            id_task: idTask[i],
                            task_name: taskNames[i],
                            description_task: taskDescriptions[i] || '',
                            created_at: taskCreatedAt[i],
                            status: taskStatus[i],
                            priority: taskPriority[i],
                            updated_at: taskUpdatedAt[i]
                        };

                        taskArray.push(task);
                    }

                    return taskArray;
                });

                setTasks(processedTasks);
                setIsLoading(false);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <p>Cargando...</p>;
    }

    const tasksToDo = [];
    const tasksInProgress = [];
    const tasksCompleted = [];

    for (let i = 0; i < tasks[0].length; i++) {
        if (tasks[0][i].status === 'Pendiente') {
            tasksToDo.push(tasks[0][i]);
        } else if (tasks[0][i].status === 'En progreso') {
            tasksInProgress.push(tasks[0][i]);
        } else if (tasks[0][i].status === 'Completada') {
            tasksCompleted.push(tasks[0][i]);
        }
    }

    return (
        <div className='container-all'>
            <TasksFilter name={user} tasks={tasks[0]} />
            {tasks.length === 0 ? (
                <div className='container-cards'>
                    <h1>no hay tareas</h1>
                </div>
            ) : (
                <TasksList
                    tasksToDo={tasksToDo}
                    tasksInProgress={tasksInProgress}
                    tasksCompleted={tasksCompleted}
                />
            )}
        </div>
    );
};

export default UserHome;


