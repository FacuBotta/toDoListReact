import React, { Children, useEffect, useState } from 'react'
import '../styles/App.css'
import axios from 'axios';
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import TaskCard from '../components/TaskCard'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { updateTasksInDrag, deleteTask, deleteGroupTask, handleDates } from '../utils/helpers'
import BarGroupTasks from '../components/BarGroupTasks';
import GroupDetails from '../components/GroupDetails';

const UserHome = () => {
    const courrentGroupStorage = () => {
        const indexString = localStorage.getItem('currentGroupStorage')
        if (indexString != '' && indexString) {
            setCurrectGroup(parseInt(indexString));
        } else {
            setCurrectGroup(0);
        }
    };

    const [currentGroup, setCurrectGroup] = useState(0);
    const [groups, setGroups] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [trigger, setTrigger] = useState(false)
    const [isOnDrag, setIsOnDrag] = useState(false);

    const handleTasks = () => {
        setTrigger(!trigger);
    };

    useEffect(() => {
        const fetchData = async () => {
            courrentGroupStorage()
            try {
                const response = await axios.post('http://localhost:3001/api/getUser', null, { withCredentials: true });
                handleData(response.data)
                setIsLoading(false);
            } catch (error) {
                console.log(error.message);
                setIsLoading(false);
            }
        };
        fetchData();

    }, [trigger]);

    const handleData = (data) => {
        const procecedGroups = data.map(group => {
            const groupTasks = JSON.parse(group.tasks)
            const tasksToDo = [];
            const tasksInProgress = [];
            const tasksCompleted = [];
            groupTasks.forEach((task) => {
                if (task.status === 'toDo') {
                    tasksToDo.push(task);
                } else if (task.status === 'inProgress') {
                    tasksInProgress.push(task);
                } else if (task.status === 'Completed') {
                    tasksCompleted.push(task);
                }
            });
            return ({
                id: group.id_group,
                name: group.group_name,
                created_at: group.created_at,
                updated_at: group.updated_at,
                tasks: groupTasks,
                tasksToDo: tasksToDo.sort((taskA, taskB) => taskA.order_task - taskB.order_task),
                tasksInProgress: tasksInProgress.sort((taskA, taskB) => taskA.order_task - taskB.order_task),
                tasksCompleted: tasksCompleted.sort((taskA, taskB) => taskA.order_task - taskB.order_task)
            })

        })
        setGroups(procecedGroups);
    }

    if (isLoading) {
        return <p>Cargando...</p>;
    }

    const handleDragEnd = (results) => {
        setIsOnDrag(false);
        const { source, destination, combine } = results;
        if (!destination) return;
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index &&
            !combine
        ) return;

        if (destination.droppableId === 'deleted') {
            if (source.droppableId === 'containerGroupsTasks') {
                localStorage.setItem('currentGroupStorage', 0);
                deleteGroupTask(results.draggableId, handleTasks);
                return;
            } else {
                deleteTask(results.draggableId, groups[currentGroup].id, handleTasks);
                return;
            }
        }
        
        if (source.droppableId != 'containerGroupsTasks') {
            let tasks = groups[currentGroup].tasks

            const taskDragged = results.draggableId;
            const oldStatus = source.droppableId;
            const newStatus = destination.droppableId;
            const newOrder = destination.index;

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
            updateTasksInDrag(updatedTasks, groups[currentGroup].id, handleTasks);
        }
    };
    return (
        <DragDropContext
            onDragEnd={(results) => handleDragEnd(results, tasks)}
            onDragStart={() => setIsOnDrag(true)}
        >
            <div className='container-all'>
                {<Droppable droppableId="containerGroupsTasks" type='group' >
                    {(provided) => (
                        <BarGroupTasks
                            provided={provided}
                            currentGroup={currentGroup}
                            groups={groups}
                            handleTasks={handleTasks}
                        />
                    )}
                </Droppable>}

                {groups.length === 0 ? (
                    <div className='container-cards'>
                        <h3>Select or create a group <br /> of tasks to start! 📚</h3>
                    </div>
                ) :
                    <>
                        <GroupDetails group={groups[currentGroup]} />
                        <div className='container-cards'>
                            <Droppable droppableId='toDo' type='group'>
                                {(provided) => (
                                    <TaskCard
                                        title='To Do'
                                        tasks={groups[currentGroup].tasksToDo}
                                        handleTasks={handleTasks}
                                        provided={provided}
                                        status='toDo'
                                        groupId={groups[currentGroup].id}
                                    />
                                )}
                            </Droppable>
                            <Droppable droppableId='inProgress' type='group'>
                                {(provided) => (
                                    <TaskCard
                                        title='In Progress'
                                        tasks={groups[currentGroup].tasksInProgress}
                                        handleTasks={handleTasks}
                                        provided={provided}
                                        status='inProgress'
                                        groupId={groups[currentGroup].id}
                                    />
                                )}
                            </Droppable>
                            <Droppable droppableId='Completed' type='group'>
                                {(provided) => (
                                    <TaskCard
                                        title='Completed'
                                        tasks={groups[currentGroup].tasksCompleted}
                                        handleTasks={handleTasks}
                                        provided={provided}
                                        status='Completed'
                                        groupId={groups[currentGroup].id}
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