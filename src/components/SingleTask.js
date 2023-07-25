import React, { useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import OpenTask from './OpenTask';
import { motion, AnimatePresence } from 'framer-motion';

const SingleTask = ({ taskData, handleTasks, provided }) => {
    const [taskOpen, setTaskOpen] = useState(false);
    const open = () => setTaskOpen(true);
    const close = () => setTaskOpen(false);

    const createdAt = new Date(taskData.created_at);
    const now = Date.now();
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const ageInMs = now - createdAt;
    const opacity = Math.min(1, ageInMs / thirtyDaysInMs);

    // Calcular el color RGB en función del tiempo
    const green = Math.floor(255 - opacity * 255);
    const red = Math.floor(opacity * 255 + 150);
    const color = `rgb(${red}, ${green}, 0)`;

    // Establecer el estilo inline con el gradiente de verde a rojo
    const shadowStyle = {
        background: `linear-gradient(to right, ${color}, rgba(0, 255, 0, 1))`,
        height: 'fit-content',
        margin: '2px 0',
        borderRadius: '5px',
    };

    return (
        <div style={shadowStyle}>
            <div

                className='task-item'
                ref={provided.innerRef}
                {...provided.dragHandleProps}
                {...provided.droppableProps}
                {...provided.draggableProps}
                id='task-item'
            // style={style}
            >
                <h6>{taskData.task_name}</h6>
                <motion.button onClick={() => (taskOpen ? close() : open())}>
                    <KeyboardArrowDownIcon className='icon-task-open' />
                </motion.button>
                <AnimatePresence
                    initial={false}
                    mode='wait'
                    onExitComplete={() => null}
                >
                    {taskOpen && (
                        <OpenTask
                            key={taskData.id}
                            taskData={taskData}
                            taskOpen={taskOpen}
                            handleClose={close}
                            isDragDisabled={true}
                            handleTasks={handleTasks}
                        />
                    )}
                </AnimatePresence>

            </div>
        </div>

    )
}

export default SingleTask
