require("../src/db/mongoose");
const User = require("../src/models/user");

/* User.findByIdAndUpdate("5d4a4d0db485a31320207b6c", {age:1}).then((user) => {
  console.log(user);
  return User.countDocuments({age:1});
}).then((count) => {
    console.log(count);
}).catch((error)=> {
    console.log(error);
}) */


const updateAgeAndCount = async (id,age) => { 
 const user = await User.findByIdAndUpdate(id, {age: age});
 const count = await User.countDocuments({age: age});
 return count;
}

updateAgeAndCount("5d43b608a08ef727c09634ed",2).then(count => {
  console.log(count);
}).catch(error =>{
  console.log(error);
})