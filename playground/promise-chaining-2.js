require("../src/db/mongoose");
const Task = require("../src/models/task");

/* Task.findByIdAndDelete("5d43bacfa53cb123bc0a7858").then(task => {
    console.log(task);
    return Task.countDocuments({completed: false});
}).then(count => {
    console.log(count);
}).catch(error => {
    console.log(error);
}) */

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed: false});
    return count;
};

deleteTaskAndCount("5d6d229f6610f919e454b96b").then(count => {
    console.log(count);
}).catch(error => {
    console.log(error);
})