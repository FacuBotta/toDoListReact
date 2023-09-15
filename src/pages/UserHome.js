import React, { Children, useEffect, useState } from 'react'
import '../styles/App.css'
import axios from 'axios';
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import TaskCard from '../components/TaskCard'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { updateTasksInDrag, deleteTask } from '../utils/helpers'
import BarGroupTasks from '../components/BarGroupTasks';
import GroupDetails from '../components/GroupDetails';

const UserHome = () => {
    const [groups, setGroups] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [trigger, setTrigger] = useState(false)
    const [tasksToDo, setTasksToDo] = useState([]);
    const [tasksInProgress, setTasksInProgress] = useState([]);
    const [tasksCompleted, setTasksCompleted] = useState([]);
    const [isOnDrag, setIsOnDrag] = useState(false);
    const [currentGroup, setCurrectGroup] = useState([]);
    
    const itemOnDrag = (value) => setIsOnDrag(value);
    const handleTasks = () => {
        setTrigger(!trigger);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('http://localhost:3001/api/getUser', null, { withCredentials: true });
                // console.log(response.data);
                // const lastGroupOpenStorage = localStorage.getItem('lastGroupOpenStorage');
                // const lastGroupIndex = parseInt(lastGroupOpenStorage, 10);
                setGroups(response.data)
                setIsLoading(false);
                // console.log(lastGroupIndex, groups[lastGroupIndex])
                // handleGroupTasks(lastGroupIndex)
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

    const handleGroupTasks = (groupIndex) => {
        // console.log(groupIndex)
        const jsonTasks = JSON.parse(groups[groupIndex].tasks)
        setCurrectGroup(groups[groupIndex])
        setTasks(jsonTasks)
    }

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
        <DragDropContext onDragEnd={(results) => handleDragEnd(results, tasks)}>

        <div className='container-all'>
            <BarGroupTasks 
                handleGroupTasks={handleGroupTasks}
                groups={groups} 
                handleTasks={handleTasks}
                />

            {tasks.length === 0 ? (
                <div className='container-cards'>
                    <h3>Select or create a group <br /> of tasks to start! 📚</h3>
                </div>
            ) :
                <>
                    <GroupDetails tasks={tasks} group={currentGroup} />
                    <div className='container-cards'>
                            <Droppable droppableId='toDo' type='group'>
                                {(provided) => (
                                    <TaskCard
                                        title='To Do'
                                        tasks={tasksToDo}
                                        handleTasks={handleTasks}
                                        handleGroupTasks={handleGroupTasks}
                                        provided={provided}
                                        status='toDo'
                                        isItemOnDrag={itemOnDrag}
                                        currentGroup={currentGroup}
                                    />
                                )}
                            </Droppable>
                            <Droppable droppableId='inProgress' type='group'>
                                {(provided) => (
                                    <TaskCard
                                        title='In Progress'
                                        tasks={tasksInProgress}
                                        handleTasks={handleTasks}
                                        handleGroupTasks={handleGroupTasks}
                                        provided={provided}
                                        status='inProgress'
                                        isItemOnDrag={itemOnDrag}
                                        currentGroup={currentGroup}
                                    />
                                )}
                            </Droppable>
                            <Droppable droppableId='Completed' type='group'>
                                {(provided) => (
                                    <TaskCard
                                        title='Completed'
                                        tasks={tasksCompleted}
                                        handleTasks={handleTasks}
                                        handleGroupTasks={handleGroupTasks}
                                        provided={provided}
                                        status='Completed'
                                        isItemOnDrag={itemOnDrag}
                                        currentGroup={currentGroup}
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
                    </div>
                </>
            }
        </div>
        </DragDropContext>

    );
};

export default UserHome;