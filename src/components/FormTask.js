import React, { useState } from 'react'
import { motion } from 'framer-motion';
import Backrop from './Backrop';
import { updateTask, insertNewTask, capitalizeFirstLetter, handleDates } from '../utils/helpers'

const FormTask = ({ taskData, handleTasks, handleClose, status, title, order, action, groupId }) => {
    const [taskName, setTaskName] = useState(`${action === 'update' ? taskData.name : ''}`);
    const [priority, setPriority] = useState(`${action === 'update' ? taskData.priority : 'Medium'}`);
    const [description, setDescription] = useState(`${action === 'update' ? taskData.description : ''}`);
    const [newDescription, setNewDescription] = useState('');
    const handlePriorityChange = (value) => {
        setPriority(value)
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
                        <input value={taskName} placeholder='Task Name' onChange={(e) => setTaskName(capitalizeFirstLetter(e.target.value))} />
                        <span className='input-bar'></span>
                    </div>
                </div>
                {action === 'update' && (
                    <div className='container-dates'>
                        <p>Created: { handleDates(taskData.created_at) }</p>
                        <p>Last update: { taskData.updated_at !== null && taskData.updated_at !== '' ? handleDates(taskData.updated_at) : 'No updates' }</p>
                    </div>
                )}
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
                <textarea
                    rows="5"
                    value={ action === 'update' ? description : newDescription }
                    placeholder='Description'
                    onChange={ action === 'update' ? (e) => setDescription(capitalizeFirstLetter(e.target.value)) : (e) => setNewDescription(capitalizeFirstLetter(e.target.value))}
                    ></textarea>
                <div className='container-btn'>
                    <button className='add-task-btn'
                        onClick={() => action === 'insert' ?
                        insertNewTask(order, status, priority, newDescription, taskName, handleTasks, handleClose, groupId) :
                        updateTask(taskData, priority, description, taskName, handleTasks, handleClose, groupId)}
                    > { action === 'insert' ? 'Add task!' : 'Add changes!' } </button>
                    <button className='close-form-btn' onClick={handleClose}>Close</button>
                </div>
            </motion.div>
        </Backrop>
    )
}

export default FormTask
