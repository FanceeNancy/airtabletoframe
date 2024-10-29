// Get the table to put the records into
// This code only works with the airtable scripting extension
let table = base.getTable("Team and Projects in Frame");

//Grab the names of the teams currently in the table so we can add only new teams (if any)
let queryResult = await table.selectRecordsAsync({
    fields: ["Team Name"],
});

const allTeamNames = [];

for (let record of queryResult.records){
    allTeamNames.push(record.getCellValueAsString("Team Name"))
}

//get teams from Frame.io
const resp = await fetch(
    `https://api.frame.io/v2/teams`,
    {
        method: 'GET',
        headers: {

            Authorization: 'YOUR FRAME TOKEN'
        }
    }
);


const data = await resp.json();
console.log(data);
//put the team names and ids in the table
for (let i = 0; i<data.length; i++){
    if(!(allTeamNames.includes(data[i].name))){
        await table.createRecordsAsync([
            {
                fields: {
                    'Team Name': data[i].name,
                    'Team ID' : data[i].id,
                },
            },

        ]);
    }};

