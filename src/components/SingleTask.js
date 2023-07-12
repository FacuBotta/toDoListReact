import React, { useEffect, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import axios from 'axios';
import { useDrag, useDrop } from 'react-dnd';

const SingleTask = ({ taskData, handleTasks }) => {
    console.log(taskData)
    const [status, setStatus] = useState(taskData.status);
    const [priority, setPriority] = useState(taskData.priority);
    const [description, setDescription] = useState(taskData.description_task);
    const [taskName, setTaskName] = useState(taskData.task_name);
    const [dropId, setDropId] = useState(null);
    const [taskActive, setTaskActive] = useState(false); 

    const handlePriorityChange = (value) => {
        setPriority(value)
    };
    const handleTaskVisivility = () => {
        setTaskActive(!taskActive);
    };
    const updateTaskInDrop = (value, id) => {
        setStatus(value);
        setDropId(id);
    };
    useEffect (() => {
            updateTask(dropId);
    }, [status])

    const updateTaskInForm = (e, id) => {
        e.preventDefault();
        updateTask(id)
        handleTaskVisivility();
    };

    const updateTask = async (id) => {
        try {
            const response = await axios.post('http://localhost:3001/api/updateTask', {
                withCredentials: true,
                idUser: taskData.id_user,
                idTask: id,
                status: status,
                priority: priority,
                description: description,
                taskName: taskName
            });
            handleTasks();
        } catch (error) {
            console.log(error);
        }
    };

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'task',
        item: {
            id: taskData.id_task,
            updateTaskInDrop: updateTaskInDrop
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div ref={drag} id='task-item' className={` ${taskActive ? 'task-active' : 'task-item'}`} style={{ border: isDragging ? '2px solid red' : '0px' }}>
            <input value={taskName} onChange={(e) => setTaskName(e.target.value)}/>
            <button onClick={handleTaskVisivility}>
                <KeyboardArrowDownIcon className='icon-task-open' />
            </button>
            <div className='container-dates'>
                <p>Created: {taskData.created_at}</p>
                <p>Last update: {taskData.updated_at !== null && taskData.updated_at !== '' ? taskData.updated_at : 'No updates'}</p>
            </div>

            <p>Priority:</p>
            <div className='container-radios'>
                <label>
                    <input
                        type="radio"
                        value="High"
                        checked={priority === 'High'}
                        onChange={() => handlePriorityChange('High')}
                    />
                    High
                </label>
                <label>
                    <input
                        type="radio"
                        value="Medium"
                        checked={priority === 'Medium'}
                        onChange={() => handlePriorityChange('Medium')}
                    />
                    Medium
                </label>
                <label>
                    <input
                        type="radio"
                        value="Low"
                        checked={priority === 'Low'}
                        onChange={() => handlePriorityChange('Low')}
                    />
                    Low
                </label>
            </div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            <button onClick={(e) => updateTaskInForm(e, taskData.id_task)}>Add Changes!</button>
        </div>
    )
}

export default SingleTask
