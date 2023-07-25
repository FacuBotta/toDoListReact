import React, { useEffect, useState } from 'react'
import '../styles/App.css'
import axios from 'axios';
import TasksFilter from '../components/TasksFilter';
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import TaskCard from '../components/TaskCard'

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
                const response = await axios.post('http://localhost:3001/api/getUser', { withCredentials: true });
                setUser(response.data);
                if (response.data[0].task_names !== null) {
                    const processedTasks = response.data.map((item) => {
                        const idUser = item.id_user;
                        const idTask = item.id_tasks.split(', ');
                        const order = item.order_tasks ? item.order_tasks.split(', ') : [];
                        const taskNames = item.task_names.split(', ');
                        const taskDescriptions = item.task_descriptions ? item.task_descriptions.split(', ') : [];
                        const taskCreatedAt = item.task_created_at.split(', ');
                        const taskStatus = item.task_status.split(', ');
                        const taskPriority = item.task_priority.split(', ');
                        const taskUpdatedAt = item.task_updated_at.split(', ');

                        const taskArray = [];

                        for (let i = 0; i < idTask.length; i++) {
                            const task = {
                                id_user: parseInt(idUser),
                                id_task: parseInt(idTask[i]),
                                order_task: parseInt(order[i]),
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
                    setTasks(processedTasks[0]);
                    // handleStatusTasks(tasks);
                }
                setIsLoading(false);
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchData();
    }, [trigger]);
    useEffect(() => {
        if (tasks.length > 0) {
            handleStatusTasks(tasks);
        }
    }, [tasks]);

    const handleStatusTasks = (tasks) => {
        const tasksToDoTemp = [];
        const tasksInProgressTemp = [];
        const tasksCompletedTemp = [];
        tasks.forEach((task) => {
            if (task.status === 'toDo') {
                tasksToDoTemp.push(task);
            } else if (task.status === 'inProgress') {
                tasksInProgressTemp.push(task);
            } else if (task.status === 'Completed') {
                tasksCompletedTemp.push(task);
            }
        });
        //order tasks by order_task column
        tasksToDoTemp.sort((taskA, taskB) => taskA.order_task - taskB.order_task);
        tasksInProgressTemp.sort((taskA, taskB) => taskA.order_task - taskB.order_task);
        tasksCompletedTemp.sort((taskA, taskB) => taskA.order_task - taskB.order_task);

        setTasksToDo(tasksToDoTemp);
        setTasksInProgress(tasksInProgressTemp);
        setTasksCompleted(tasksCompletedTemp);
    };

    if (isLoading) {
        return <p>Cargando...</p>;
    }

    const handleDragEnd = (results, tasks) => {
        const { source, destination, combine } = results;
        if (!destination) return;
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index &&
            !combine
        ) return;

        const taskDragged = results.draggableId;
        const oldStatus = source.droppableId;
        const newStatus = destination.droppableId;
        const newOrder = destination.index;
        const sourceIndex = source.index;

        let updatedTasks = tasks.map((task) => {
            if (task.id_task == taskDragged) {
                if (oldStatus !== newStatus) {
                    // Si la tarea se movió a una nueva columna, establece su nuevo status y orden
                    return {
                        ...task,
                        status: newStatus,
                        order_task: newOrder,
                    };
                } else {
                    // Si la tarea sigue en la misma columna, solo establece su nuevo orden
                    return {
                        ...task,
                        order_task: newOrder,
                    };
                }
            } else {
                return task;
            }
        });

        // Actualizar los valores de 'order_task' de las demás tareas en la misma columna
        if (oldStatus === newStatus) {
            updatedTasks = updatedTasks.map((task) => {
                if (task.id_task !== taskDragged && task.status === newStatus) {
                    if (task.order_task >= newOrder) {
                        return {
                            ...task,
                            order_task: task.order_task + 1,
                        };
                    } else {
                        return task;
                    }
                } else {
                    return task;
                }
            });
        }

        setTasks(updatedTasks);
        handleStatusTasks(updatedTasks);
        updateTasksInDrag(updatedTasks);
    };

    const updateTasksInDrag = async (newTasks) => {
        console.log(newTasks)
        try {
            const response = await axios.post('http://localhost:3001/api/updateTaskDrag', {
                withCredentials: true,
                tasks: newTasks,
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='container-all'>
            <TasksFilter user={user[0]} tasks={tasks} handleTasks={handleTasks} />
            {tasks.length === 0 ? (
                <div className='container-cards'>
                    <h1>no hay tareas</h1>
                </div>
            ) : (
                <div className='container-cards'>
                    <DragDropContext onDragEnd={(results) => handleDragEnd(results, tasks)}>
                        <Droppable droppableId='toDo' type='group'>
                            {(provided, snapshot) => (
                                <TaskCard
                                    title='To Do'
                                    tasks={tasksToDo}
                                    handleTasks={handleTasks}
                                    provided={provided}
                                    status='toDo'
                                />
                            )}
                        </Droppable>

                        <Droppable droppableId='inProgress' type='group'>
                            {(provided, snapshot) => (
                                <TaskCard
                                    title='In Progress'
                                    tasks={tasksInProgress}
                                    handleTasks={handleTasks}
                                    provided={provided}
                                    status='inProgress'
                                />
                            )}
                        </Droppable>

                        <Droppable droppableId='Completed' type='group'>
                            {(provided, snapshot) => (
                                <TaskCard
                                    title='Completed'
                                    tasks={tasksCompleted}
                                    handleTasks={handleTasks}
                                    provided={provided}
                                    status='Completed'
                                />
                            )}
                        </Droppable>
                    </DragDropContext>

                </div>
            )}
        </div>

    );
};

export default UserHome;