import React from 'react'
import '../styles/App.css'
import SingleTask from './SingleTask'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

const TaskCard = ({ title, taskStatus }) => {
    return (
        <div className='task-card'>
            <div className='task-card-head'>
                <h4>{title}</h4>
                <button>
                    <PlaylistAddIcon />
                </button>
            </div>
            {taskStatus.map((task, index) => (
                <SingleTask key={index} taskData={task} />
            ))}
        </div>
    );
};

export default TaskCard;
