import React, { useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const SingleTask = ({ taskData }) => {

            console.log(taskData)
    const [taskActive, setTaskActive] = useState(false)
    const handleTask = () => {
        setTaskActive(!taskActive);
    };
    return (
        <div id='task-item' className={` ${taskActive ? 'task-active' : 'task-item'}`}>
            <h5>{taskData.task_name}</h5>
            <button onClick={handleTask}>
                <KeyboardArrowDownIcon className='icon-task-open'/>
            </button>
            <p>{taskData.created_at}</p>
            <p>{taskData.priority}</p>
            <p>{taskData.description_task}</p>
        </div>
    )
}

export default SingleTask
