import React, { useState } from 'react'
import axios from 'axios';

const FormInsertTask = ({ visibility }) => {
    // const [isVisible, setIsVisible] = useState(visibility)
    const [taskName, setTaskName] = useState('');
    const [priority, setPriority] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:3001/api/insertTask', {
            taskName: taskName,
            priority: priority,
            description: description
        });
        console.log(response)
        setTaskName('');
        setPriority('');
        setDescription('');
    };
    return (
        <dialog className='container-form-insert-task' open={visibility}>
            <form onSubmit={handleSubmit}>
                <input name='taskName'
                type='text'
                placeholder='Task Name'
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}/>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value=''>-- Priority --</option>
                    <option value='Alta'>Alta</option>
                    <option value='Media'>Media</option>
                    <option value='Baja'>Baja</option>
                </select>
                <textarea name='taskDescription'
                placeholder='Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}/>
                <button type='submit'>Add!</button>
                <button>Cancel</button>
            </form>
        </dialog>
    )

}

export default FormInsertTask
