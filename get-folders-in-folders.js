// Get the folders in the folders


const query = new URLSearchParams({
    'filter[archived]': 'all'
}).toString();

let table = base.getTable("Get Projects and Folders, Create Links")
let iddyiddy = await input.recordAsync('select', table);
let folderId = iddyiddy?.getCellValue("folder_id");
let parentFolderName = iddyiddy?.getCellValue("Folder Name");
let clientFolder = iddyiddy?.getCellValue("Client Project Folder");
//console.log(clientFolder);

//Grab the names of the folders to ask for client project folder
let queryResult = await table.selectRecordsAsync({
    fields: ["Folder Name"],
});

const allFolderNames = [];

for (let record of queryResult.records){
    if (record.getCellValue("Folder Name") != null && record.getCellValue("Folder Name").includes("24SF0")){
        allFolderNames.push(record.getCellValueAsString("Folder Name"))
    }}

//console.log(allFolderNames);

let numOfFolders = []
for (let i = 0; i<allFolderNames.length; i++){
    numOfFolders.push(i)
}

//console.log (numOfFolders);

//Get folder ids of the folder so we onlt add unique folders
let queryResultTwo = await table.selectRecordsAsync({
    fields: ["folder_id"],
});

const allFolderIDs = [];

for (let record of queryResultTwo.records){
    if (record.getCellValue("folder_id") != null){
        allFolderIDs.push(record.getCellValue("folder_id"))
    }}

var clientProjectFolder;

if (clientFolder === null){
    let whatClientIsThis = await input.buttonsAsync(
        "What client project is this?",
        allFolderNames.map(item => {return {label: item, value: numOfFolders[allFolderNames.indexOf(item)]}}));

    clientProjectFolder = allFolderNames[whatClientIsThis].toString();
} else {
    clientProjectFolder = clientFolder;
};

console.log(clientProjectFolder)

const resp = await fetch(
    `https://api.frame.io/v2/assets/${folderId}/children?type=folder`,
    {
        method: 'GET',
        headers: {
            Authorization: 'Bearer YOUR FRAME TOKEN'
        }
    }
);

const data = await resp.json();

for (let i = 0; i<data.length; i++){

    if (!(allFolderIDs.includes(data[i].id))){
        await table.createRecordsAsync([
            {
                fields: {
                    'folder_id': data[i].id,
                    'Folder Name': data[i].name,
                    'Project ID': data[i].project_id,
                    'Type': data[i]._type,
                    'Project Name': data[i].project.name,
                    'parent folder id': data[i].parent_id,
                    'Parent Folder Name': parentFolderName,
                    'Client Project Folder': clientProjectFolder
                }
            }
        ])
    }
};

if(data.length === 0){
    output.markdown("There are no more folders. Grab assets now!")
}

output.text(`There are ${data.length} folders in the folder.`)

// console.log(data)
