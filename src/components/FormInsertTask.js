import React, { useState } from 'react'
import axios from 'axios';
import { motion } from 'framer-motion';
import Backrop from './Backrop';

const FormInsertTask = ({ handleTasks, handleClose, status, title, order }) => {
    const [taskName, setTaskName] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [description, setDescription] = useState('');
    console.log(order.length + 1)
    const handlePriorityChange = (value) => {
        setPriority(value)
    };

    const insertNewTask = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/insertTask', {
                status: status,
                priority: priority,
                description: description,
                taskName: taskName,
                order: order.length + 1,
            }, {withCredentials: true})
        }catch (error) {
            console.log(error)
        }
        handleTasks();
        handleClose();
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
                <h4>{title}</h4>
                <input value={taskName} placeholder='Task Name' onChange={(e) => setTaskName(e.target.value)} />
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
                <textarea value={description} placeholder='Description' onChange={(e) => setDescription(e.target.value)}></textarea>
                <button onClick={(e) => insertNewTask(e)}>Add Task!</button>
                <button onClick={handleClose}>Close</button>
            </motion.div>
        </Backrop>
    )
}

export default FormInsertTask
