
// Get the SF project folders inside of the client named project folders in Frame
// The nomenclature can be confusing -- Frame calls the folders project.
// But each folder inside the project folders are Silentface projects


const query = new URLSearchParams({
    'filter[archived]': 'all'
}).toString();

let table = base.getTable("Get Projects and Folders, Create Links")
let iddyiddy = await input.recordAsync('select', table);
let rootAssetId = iddyiddy?.getCellValue("Root Asset ID (from Notes)");

//Grab the names of the folders currently in the table so we can add only new folders
let queryResult = await table.selectRecordsAsync({
    fields: ["Folder Name"],
});

const allFolderNames = [];

for (let record of queryResult.records){
    allFolderNames.push(record.getCellValueAsString("Folder Name"))
}

const resp = await fetch(
    `https://api.frame.io/v2/assets/${rootAssetId}/children?type=folder`,
    {
        method: 'GET',
        headers: {
            Authorization: 'Bearer YOUR FRAME TOKEN'
        }
    }
);

const data = await resp.json();

for (let i = 0; i<data.length; i++){

    if (!(allFolderNames.includes(data[i].name))){
        await table.createRecordsAsync([
            {
                fields: {
                    'folder_id': data[i].id,
                    'Folder Name': data[i].name,
                    'Project ID': data[i].project_id,
                    'Type': data[i]._type,
                    'Project Name': data[i].project.name,
                    'Root Asset ID': data[i].project.root_asset_id
                }
            }
        ])
    }};

console.log(data)