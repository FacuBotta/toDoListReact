import React, { useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import OpenTask from './OpenTask';
import { motion, AnimatePresence } from 'framer-motion';

const SingleTask = ({ taskData, handleTasks, provided }) => {
    const [taskOpen, setTaskOpen] = useState(false);
    const open = () => setTaskOpen(true);
    const close = () => setTaskOpen(false);


    return (
        <div
            className='task-item'
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.droppableProps}
            {...provided.draggableProps}
            id='task-item'
        >
            <h6>{taskData.task_name}</h6>
            <motion.button onClick={() => (taskOpen ? close() : open())}>
                <KeyboardArrowDownIcon className='icon-task-open' />
            </motion.button>
            <AnimatePresence
                initial={false}
                mode='wait'
                onExitComplete={()=> null}
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
    )
}

export default SingleTask
