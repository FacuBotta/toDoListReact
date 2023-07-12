import React from 'react'
import '../styles/App.css'
import SingleTask from './SingleTask'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { useDrop } from 'react-dnd';

const TaskCard = ({ title, taskStatus, handleTasks }) => {
    const [, drop] = useDrop(()=> ({
        accept: 'task',
        drop: (item) => {
            const draggedTaskId = item.id;
            const updateTaskInDrop = item.updateTaskInDrop;

            if (title == 'To Do') {
                updateTaskInDrop('toDo', draggedTaskId);
            } else if (title == 'In Progress') {
                updateTaskInDrop('InProgress', draggedTaskId);
            } else if (title == 'Completed') {
                updateTaskInDrop('Completed', draggedTaskId);
            }
        },
    }));

    return (
        <div ref={drop} className='task-card'>
            <div className='task-card-head'>
                <h4>{title}</h4>
                <button>
                    <PlaylistAddIcon />
                </button>
            </div>
            {taskStatus.map((task, index) => (
                <SingleTask key={index} taskData={task} handleTasks={handleTasks}/>
            ))}
        </div>
    );
};

export default TaskCard;
