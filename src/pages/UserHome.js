import React, { Children, useEffect, useState } from 'react'
import '../styles/App.css'
import axios from 'axios';
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import TaskCard from '../components/TaskCard'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { updateTasksInDrag, deleteTask } from '../utils/helpers'

const UserHome = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [trigger, setTrigger] = useState(false)
    const [tasksToDo, setTasksToDo] = useState([]);
    const [tasksInProgress, setTasksInProgress] = useState([]);
    const [tasksCompleted, setTasksCompleted] = useState([]);
    const [isOnDrag, setIsOnDrag] = useState(false);

    const itemOnDrag = (value) => setIsOnDrag(value)

    const handleTasks = () => {
        setTrigger(!trigger);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('http://localhost:3001/api/getUser', null, { withCredentials: true });
                // console.log(response.data);
                setTasks(response.data)
                setIsLoading(false);
            } catch (error) {
                console.log(error.message);
                setIsLoading(false);
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
        itemOnDrag(false);
        const { source, destination, combine } = results;
        
        if (!destination) return;
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index &&
            !combine
        ) return;
        
        if (destination.droppableId === 'deleted') {
            deleteTask(results.draggableId);
        }
        const taskDragged = results.draggableId;
        const oldStatus = source.droppableId;
        const newStatus = destination.droppableId;
        const newOrder = destination.index;
        const sourceIndex = source.index;

        let updatedTasks = tasks.map((task) => {
            if (task.id_task == taskDragged) {
                if (oldStatus !== newStatus) {
                    return {
                        ...task,
                        status: newStatus,
                        order_task: newOrder,
                    };
                } else {
                    return {
                        ...task,
                        order_task: newOrder,
                    };
                }
            } else {
                return task;
            }
        });

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
    return (
        <div className='container-all'>
            {tasks.length === 0 && (
                <div className='container-cards'>
                    <h3>No tasks to show</h3>
                </div>
            )}
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
                                    isItemOnDrag={itemOnDrag}
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
                                    isItemOnDrag={itemOnDrag}
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
                                    isItemOnDrag={itemOnDrag}
                                />
                            )}
                        </Droppable>
                        {/* delete drop zone */}
                        <Droppable droppableId='deleted' type='group' isDropDisabled={Children ? false : true}>
                            {(provided, snapshot) => (
                                    <div className='container-delete-task' ref={provided.innerRef}
                                        style={{
                                            Height: '300px',
                                            padding: '10px',
                                            border: snapshot.isDraggingOver && 'solid 2px red',
                                        }}>
                                        {isOnDrag && (<DeleteForeverIcon
                                            className='icon-delete-task'
                                            style={{ fontSize: snapshot.isDraggingOver && '3rem' }}
                                            />)}
                                        {provided.placeholder}
                                    </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
        </div>
    );
};

export default UserHome;