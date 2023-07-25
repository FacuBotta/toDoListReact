import React, { useState } from 'react'
import axios from 'axios';
import { motion } from 'framer-motion';
import Backrop from './Backrop';

const OpenTask = ({ taskData, handleClose, handleTasks }) => {
    const [taskName, setTaskName] = useState(taskData.task_name);
    const [priority, setPriority] = useState(taskData.priority);
    const [description, setDescription] = useState(taskData.description_task);

    const handlePriorityChange = (value) => {
        setPriority(value)
    };

    const updateTask = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/updateTask', {
                withCredentials: true,
                idUser: taskData.id_user,
                idTask: taskData.id_task,
                priority: priority,
                description: description,
                taskName: taskName
            });
            handleTasks();
            handleClose();
            console.log(response)
        } catch (error) {
            console.log(error);
        }
    };

    const dropIn = {
        hidden: {
            y: '-100vh',
            opacity: 0,
        },
        visible: {
            opacity: 1,
            y: '0',
            transition: {
                duration: 0.1,
                type: 'spring',
                damping: 25,
                stiffness: 500,
            }
        },
        exit: {
            y: '100vh',
            opacity: 0,

        },
    }
    return (
        <Backrop onClick={handleClose}>
            <motion.div
                onClick={(e) => e.stopPropagation()}
                className='task-active'
                variants={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <input value={taskName} onChange={(e) => setTaskName(e.target.value)} />

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
                <button onClick={(e) => updateTask(e)}>Add Changes!</button>
                <button onClick={handleClose}>Close</button>
            </motion.div>
        </Backrop>

    )
}

export default OpenTask
