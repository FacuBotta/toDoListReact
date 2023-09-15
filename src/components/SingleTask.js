import React, { useEffect, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { motion, AnimatePresence } from 'framer-motion';
import FormTask from './FormTask';

const SingleTask = ({ taskData, handleTasks, provided, snapshot, isItemOnDrag, title }) => {
    const [taskOpen, setTaskOpen] = useState(false);
    const open = () => setTaskOpen(true);
    const close = () => setTaskOpen(false);
    return (
        <>
            <div
                className='task-item'
                ref={provided.innerRef}
                {...provided.dragHandleProps}
                {...provided.droppableProps}
                {...provided.draggableProps}
                style={{
                    border: snapshot.isDragging ? ' 1px solid #0dff92' : 'none',
                    ...provided.draggableProps.style
                }}
                id='task-item'
            >
                {useEffect(() => {
                    if (snapshot.isDragging) {
                        isItemOnDrag(true);
                    }
                }, [snapshot.isDragging])}

                <h6>{ taskData.name }</h6>
                <motion.button className='open-task-icon-btn' onClick={() => (taskOpen ? close() : open())}>
                    <KeyboardArrowDownIcon  className='icon-task-open' />
                </motion.button>
            </div>

            {/* when the task is open */}
            <AnimatePresence
                initial={false}
                mode='wait'
                onExitComplete={() => null}
            >
                {taskOpen && (
                    <FormTask
                        key={taskData.id_task}
                        taskData={taskData}
                        handleClose={close}
                        handleTasks={handleTasks}
                        action={'update'}
                        title={title}
                        // taskOpen={taskOpen}
                    />
                )}
            </AnimatePresence>
        </>
    )
}

export default SingleTask
