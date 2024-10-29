let table = base.getTable("Get Links for Projects");
let proIddyIddy = await input.recordAsync('select', table);

let projectId = proIddyIddy?.getCellValue("Project ID (from PROJECT)")

if (projectId === ""){
    output.text("Select the button with an active Project // Client")
    throw new Error('Script Terminated')
}

let queryResult = await table.selectRecordsAsync({
    fields: ["short_url"],
});

const allURLs = [];

for (let record of queryResult.records){
    allURLs.push(record.getCellValueAsString("short_url"))
}
//const projectId = 'YOUR_project_id_PARAMETER';
const resp = await fetch(
    `https://api.frame.io/v2/projects/${projectId}/review_links`,
    {
        method: 'GET',
        headers: {
            Authorization: 'Bearer YOUR FRAME TOKEN'
        }
    }
);

const data = await resp.json();
console.log(data);


for (let i = 0; i<data.length; i++){
    //console.log(data[i].short_url, data[i].id);
    if (!(allURLs.includes(data[i].short_url))){
        await table.createRecordsAsync([
            {
                fields: {
                    'short_url': data[i].short_url,
                    'Password On' : data[i].has_password.toString(),
                    'Password':data[i].password,
                    'Downloadable' : data[i].enable_downloading.toString(),
                    'Project ID' : data[i].project_id,
                    'Project Name': data[i].project.name,
                    'Asset name' : data[i].name,
                    'Link ID': data[i].id,
                    'Link Type': data[i]._type,
                },
            },

        ])

    }};