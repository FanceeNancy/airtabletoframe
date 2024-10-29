let table = base.getTable("Get Links for Projects")
let proIddyIddy = await input.recordAsync('select', table);
let projectId = proIddyIddy?.getCellValue("Project ID (from PROJECT)");



const resp = await fetch(
    `https://api.frame.io/v2/projects/${projectId}/presentations`,
    {
        method: 'GET',
        headers: {
            Authorization: 'Bearer YOUR FRAME TOKEN'
        }
    }
);

let queryResult = await table.selectRecordsAsync({
    fields: ["short_url"],
});

const allURLs = [];

for (let record of queryResult.records){
    allURLs.push(record.getCellValueAsString("short_url"))
}

const data = await resp.json();
console.log(data);

for (let i = 0; i<data.length; i++){
    console.log(data[i].short_url, data[i].id);
    if (!(allURLs.includes(data[i].short_url))){
        await table.createRecordsAsync([
            {
                fields: {
                    'short_url': data[i].short_url,
                    'Password' : data[i].password,
                    'Downloadable' : data[i].can_download.toString(),
                    'Project ID' : data[i].project_id,
                    'Asset name' : data[i].name,
                    'Link ID': data[i].id,
                    'Link Type': data[i]._type,
                },
            },

        ])

    }};
