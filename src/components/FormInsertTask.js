import React, { useState } from 'react'
import axios from 'axios';
import { motion } from 'framer-motion';
import Backrop from './Backrop';

const FormInsertTask = ({ handleTasks, handleClose, status, title, order }) => {
    const [taskName, setTaskName] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [description, setDescription] = useState('');
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
            }, { withCredentials: true })
        } catch (error) {
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
            x: '-100vh',
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
            >   <div className='task-head'>
                    <h4>{title}</h4>
                    <div className='input-container'>
                        <input value={taskName} placeholder='Task Name' onChange={(e) => setTaskName(e.target.value)} />
                        <span className='input-bar'></span>
                    </div>
                </div>
                <h4>Priority:</h4>
                <div className='container-radios'>
                    <ul>
                        <li>
                            <input
                                type="radio"
                                id="f-option"
                                name="selector"
                                value="High"
                                checked={priority === 'High'}
                                onChange={() => handlePriorityChange('High')}
                            />
                            <label htmlFor="f-option">High</label>
                            <div className="check"></div>
                        </li>

                        <li>
                            <input
                                type="radio"
                                id="s-option"
                                name="selector"
                                value="Medium"
                                checked={priority === 'Medium'}
                                onChange={() => handlePriorityChange('Medium')}
                            />
                            <label htmlFor="s-option">Medium</label>
                            <div className="check">
                                <div className="inside"></div>
                            </div>
                        </li>

                        <li>
                            <input
                                type="radio"
                                id="t-option"
                                name="selector"
                                value="Low"
                                checked={priority === 'Low'}
                                onChange={() => handlePriorityChange('Low')}
                            />
                            <label htmlFor="t-option">Low</label>
                            <div className="check">
                                <div className="inside"></div>
                            </div>
                        </li>
                    </ul>
                </div>
                <textarea rows="5" value={description} placeholder='Description' onChange={(e) => setDescription(e.target.value)}></textarea>
                <div className='container-btn'>
                    <button className='add-task-btn' onClick={(e) => insertNewTask(e)}>Add Task!</button>
                    <button className='close-form-btn' onClick={handleClose}>Close</button>
                </div>
            </motion.div>
        </Backrop>
    )
}

export default FormInsertTask
