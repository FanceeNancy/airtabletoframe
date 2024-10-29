// Get the assets in the folders

const query = new URLSearchParams({
    'filter[archived]': 'all'
}).toString();

let table = base.getTable("Get Projects and Folders, Create Links")
let iddyiddy = await input.recordAsync('select', table);
let folderId = iddyiddy?.getCellValue("folder_id");
let parentFolderName = iddyiddy?.getCellValue("Folder Name");
let clientFolder = iddyiddy?.getCellValue("Client Project Folder");

//Grab the names of the assets currently in the table so we can add only new assets
let queryResult = await table.selectRecordsAsync({
    fields: ["Asset Name"],
});

const allAssetNames = [];

for (let record of queryResult.records){
    allAssetNames.push(record.getCellValueAsString("Asset Name"))
}


const respTwo = await fetch(
    `https://api.frame.io/v2/assets/${folderId}/children`,
    {
        method: 'GET',
        headers: {
            Authorization: 'Bearer YOUR FRAME TOKEN'
        }
    }
);

const dataTwo = await respTwo.json();

for (let i = 0; i<dataTwo.length; i++){

    if (!(allAssetNames.includes(dataTwo[i].name))){
        await table.createRecordsAsync([
            {
                fields: {
                    'asset_id': dataTwo[i].id,
                    'Asset Name': dataTwo[i].name,
                    'Project ID': dataTwo[i].project_id,
                    'Type': dataTwo[i]._type,
                    'Project Name': dataTwo[i].project.name,
                    'parent folder id': dataTwo[i].parent_id,
                    'Parent Folder Name': parentFolderName,
                    'Client Project Folder': clientFolder
                }
            }
        ])
    }
};


if(dataTwo.length === 0){
    output.text("There are no assets in the folder.")
}

output.text(`There are ${dataTwo.length} assets in the folder.`)

// console.log(dataTwo)
