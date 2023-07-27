import React, { useState } from 'react'
import '../styles/App.css'
import SingleTask from './SingleTask'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { Draggable } from 'react-beautiful-dnd';
import FormInsertTask from './FormInsertTask';
import { motion, AnimatePresence } from 'framer-motion';


const TaskCard = ({ title, tasks, handleTasks, provided, status }) => {
    const [formOpen, setFormOpen] = useState(false);
    const open = () => setFormOpen(true);
    const close = () => setFormOpen(false);

    return (
        <div className='task-card' ref={provided.innerRef} {...provided.droppableProps}>
            <div className='task-card-head'>
                <h4>{title}</h4>
                <motion.button className='add-new-task-btn' onClick={() => (formOpen ? close() : open())}>
                    <PlaylistAddIcon />
                </motion.button>
                <AnimatePresence
                    initial={false}
                    mode='wait'
                    onExitComplete={() => null}
                >
                    {formOpen && (
                        <FormInsertTask
                            key={formOpen ? 'open' : 'closed'}
                            formOpen={formOpen}
                            isDragDisabled={true}
                            handleClose={close}
                            handleTasks={handleTasks}
                            status={status}
                            title={title}
                            order={tasks}
                        />
                    )}
                </AnimatePresence>
            </div>
            {tasks.map((task, index) => (
                <Draggable draggableId={`${task.id_task}`} key={task.id_task} index={index}>
                    {(provided, snapshot) => (
                        <SingleTask
                            key={index}
                            taskData={task}
                            handleTasks={handleTasks}
                            provided={provided}
                        />
                    )}
                </Draggable>
            ))}
            {provided.placeholder}
        </div>
    );
};

export default TaskCard;
