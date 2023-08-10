import axios from 'axios';
// handle tasks functions
export const updateTask = async (e, taskData, priority, description, taskName, handleTasks, handleClose) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:3001/api/updateTask', {
            withCredentials: true,
            idUser: taskData.id_user,
            idTask: taskData.id_task,
            priority: priority,
            description: description,
            taskName: taskName
        });
        handleTasks();
        handleClose();
        console.log(response, taskData.id_task, description, taskName)
    } catch (error) {
        console.log(error);
    }
};
export const insertNewTask = async (e, order, status, priority, description, taskName, handleTasks, handleClose) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:3001/api/insertTask', {
            status: status,
            priority: priority,
            description: description,
            taskName: taskName,
            order: order.length + 1,
        }, { withCredentials: true })
    } catch (error) {
        console.log(error)
    }
    handleTasks();
    handleClose();
};
export const updateTasksInDrag = async (newTasks) => {
    try {
        const response = await axios.post('http://localhost:3001/api/updateTaskDrag', {
            withCredentials: true,
            tasks: newTasks,
        });
    } catch (error) {
        console.log(error);
    }
}
export const deleteTask = async (task) => {
    try {
        const response = await axios.post('http://localhost:3001/api/deleteTask',
        { task }, 
        { withCredentials: true });
        console.log(response.data)
    } catch (error) {
        console.log (error)
    }
}
