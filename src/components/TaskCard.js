import React, { useState } from 'react'
import '../styles/App.css'
import SingleTask from './SingleTask'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { Draggable } from 'react-beautiful-dnd';
import FormTask from './FormTask';
import { motion, AnimatePresence } from 'framer-motion';


const TaskCard = ({ title, tasks, handleTasks, provided, status, groupId, handleGroupTasks }) => {
    const [formOpen, setFormOpen] = useState(false);
    const open = () => setFormOpen(true);
    const close = () => setFormOpen(false);

    return (
        <div
            className='task-card'
            ref={provided.innerRef}
            {...provided.droppableProps}
        >
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
                        <FormTask
                            key={formOpen ? 'insertOpen' : 'insertClosed'}
                            handleClose={close}
                            handleTasks={handleTasks}
                            handleGroupTasks={handleGroupTasks}
                            status={status}
                            title={title}
                            order={tasks}
                            action={'insert'}
                            groupId={groupId}
                        />
                    )}
                </AnimatePresence>
            </div>
            {tasks.map((task, index) => (
                <Draggable
                    draggableId={`${task.id_task}`}
                    key={task.id_task}
                    index={index}
                >
                    {(provided, snapshot) => (
                        <SingleTask
                            key={index}
                            provided={provided}
                            snapshot={snapshot}
                            taskData={task}
                            handleTasks={handleTasks}
                            title={title}
                            groupId={groupId}
                        />
                    )}
                </Draggable>
            ))}
            {provided.placeholder}
        </div>
    );
};

export default TaskCard;
