import React, { useEffect, useState } from 'react'
import '../styles/App.css'
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import TasksFilter from '../components/TasksFilter';
import TasksList from '../components/TasksList';

const UserHome = () => {
    const [user, setUser] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [trigger, setTrigger] = useState(false)
    const [tasksToDo, setTasksToDo] = useState([]);
    const [tasksInProgress, setTasksInProgress] = useState([]);
    const [tasksCompleted, setTasksCompleted] = useState([]);

    const handleTasks = () => {
        setTrigger(!trigger);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/getUser', {
                    withCredentials: true
                });
                setUser(response.data);
                console.log(response.data[0])
                if (response.data[0].task_names !== null) {
                    const tasksToDoTemp = [];
                    const tasksInProgressTemp = [];
                    const tasksCompletedTemp = [];

                    const processedTasks = response.data.map((item) => {
                        const idUser = item.id_user;
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
                                id_user: idUser,
                                task_name: taskNames[i],
                                description_task: taskDescriptions[i] || '',
                                created_at: taskCreatedAt[i],
                                status: taskStatus[i],
                                priority: taskPriority[i],
                                updated_at: taskUpdatedAt[i]
                            };

                            taskArray.push(task);

                            if (task.status === 'toDo') {
                                tasksToDoTemp.push(task);
                            } else if (task.status === 'inProgress') {
                                tasksInProgressTemp.push(task);
                            } else if (task.status === 'Completed') {
                                tasksCompletedTemp.push(task);
                            }
                        }

                        return taskArray;
                    });

                    setTasks(processedTasks);
                    setTasksToDo(tasksToDoTemp);
                    setTasksInProgress(tasksInProgressTemp);
                    setTasksCompleted(tasksCompletedTemp);
                } else {
                    setTasks([]);
                    setTasksToDo([]);
                    setTasksInProgress([]);
                    setTasksCompleted([]);
                }
                setIsLoading(false);
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchData();
    }, [trigger]);

    if (isLoading) {
        return <p>Cargando...</p>;
    }
    return (
        
            <div className='container-all'>
                <TasksFilter user={user[0]} tasks={tasks[0]} handleTasks={handleTasks} />
                {tasks.length === 0 ? (
                    <div className='container-cards'>
                        <h1>no hay tareas</h1>
                    </div>
                ) : (
                    <TasksList
                        handleTasks={handleTasks}
                        tasksToDo={tasksToDo}
                        tasksInProgress={tasksInProgress}
                        tasksCompleted={tasksCompleted}
                    />
                )}
            </div>
        
    );
};

export default UserHome;