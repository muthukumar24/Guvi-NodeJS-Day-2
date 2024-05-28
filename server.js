const express = require("express");
// Used to parse json payloads in incoming request,
// make it available in req.body
const bodyParser = require("body-parser");
// file operations => create, read folder, folder/file exist or not
const fs = require('fs-extra');
// Manage file and directory path
const path = require('path');

const app = express();
const PORT = 3000;
// will check texts folder available in current directory or not
const folderPath = path.join(__dirname, 'texts')

// check whether the folder is there ot not
if(!fs.existsSync(folderPath)){
    fs.mkdirSync(folderPath);
}

// function to remove colon and dot from filename
function getFormattedFileName(){
    return new Date().toISOString().replace(/[:.]/g, '-');
}

//endpoint to create a text file
app.post("/createFile", async (req, res) => {
    try {
        await fs.ensureDir(folderPath);
        const time = getFormattedFileName();
        // const updatedTime = time.replace(/[:.]/g, '-'); // Replace ':' and '.' with '-'
        const fileName = `${time}.txt`;
        const filePath = path.join(folderPath, fileName);

        // Write the file with the current time as content
        await fs.writeFile(filePath, time);
        res.send("File created successfully!!!");
    } 
    catch (error) 
    {
        console.error("Error writing a file:", error);
        res.status(500).send("Error writing a file - ", error);
    }
});

//Endpoint to retrieve all text files
app.get("/getFiles", async (req, res)=> {
    try{
        await fs.ensureDir(folderPath); // making sure the folder path is available
        const files = await fs.readdir(folderPath); // reading the folder path
        const textFiles = files.filter((file) => file.endsWith('.txt')); // filtering the .txt files using filter method
        res.json(textFiles) // sending the text files as json response to postman 
    }
    catch(error)
    {
        res.status(500).send("Error Reading files - ", error)
    }
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
}) 