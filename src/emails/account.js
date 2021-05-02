const sgmail = require("@sendgrid/mail");
const sendGridKey = "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";

sgmail.setApiKey(sendGridKey);


try{
    sgmail.send({
    to: "kewal_94shah@yahoo.co.in",
    from: "kewal_94shah@yahoo.co.in",
    subject: "This is my first Email",
    text: "Hope you are doing well"
})
}catch(error){
    console.log(error);
}