import React, { useState } from 'react'
import axios from 'axios';

const FormInsertTask = ({ visibility, handleTasks, user, tasks }) => {
    // console.log(tasks[tasks.length - 1].id_task)
    const [taskName, setTaskName] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [description, setDescription] = useState('');
    const [statusTask, setStatusTask] = useState('toDo');

    const handlePriorityChange = (value) => {
        setPriority(value)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:3001/api/insertTask', {
            taskName: taskName,
            priority: priority,
            description: description,
            status: statusTask,
        }).then((response) => {
            console.log(response);
        }).catch((error) => console.log(error));

        handleTasks();

        setTaskName('');
        setPriority('');
        setDescription('');
        setStatusTask('toDo');
    };

    return (
        <dialog className='container-form-insert-task' open={visibility}>
            <form onSubmit={handleSubmit}>
                <input name='taskName'
                    type='text'
                    placeholder='Task Name'
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)} />
                <h3>Priority:</h3>
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
                <textarea name='taskDescription'
                    placeholder='Description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} />
                <button type='submit'>Add!</button>
                <button>Cancel</button>
            </form>
        </dialog>
    )

}

export default FormInsertTask
