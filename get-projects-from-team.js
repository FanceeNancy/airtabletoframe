// Get all the projects in the team
// This can only be used with airtable scripting extension

const query = new URLSearchParams({
    'filter[archived]': 'all'
}).toString();
let table = base.getTable("Team and Projects in Frame");
let iddyiddy = await input.recordAsync('select', table);
let teamId = iddyiddy?.getCellValue("Team ID");

//Grab the names of the projects currently in the table so we can add only newly created teams
let queryResult = await table.selectRecordsAsync({
    fields: ["Project // Client Name"],
});

const allProjectNames = [];

for (let record of queryResult.records){
    allProjectNames.push(record.getCellValueAsString("Project // Client Name"))
}

const resp = await fetch(
    `https://api.frame.io/v2/teams/${teamId}/projects?${query}`,
    {
        method: 'GET',
        headers: {
            Authorization: 'Bearer YOUR FRAME TOKEN'
        }
    }
);

const data = await resp.json();

for (let i = 0; i<data.length; i++){
    //console.log(data[i].id, data[i].name)
    if (!(allProjectNames.includes(data[i].name))){
        await table.createRecordsAsync([
            {
                fields: {
                    'Project ID': data[i].id,
                    'Project // Client Name': data[i].name,
                    'Team ID': data[i].team_id,
                    'Root Asset ID': data[i].root_asset_id
                }
            }
        ])
    }};

console.log(data)