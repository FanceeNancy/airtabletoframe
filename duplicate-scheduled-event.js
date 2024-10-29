//duplicate an event and then iterate it

//select the SCHEDULES table
let table = base.getTable("SCHEDULES");

//select a record; use a button to select the record
let record = await input.recordAsync("select", table);

//ask how many records to create
let numDays = await input.textAsync('How many events of this type do you need?')


//set the fields that already exist to copy to the new record
let eventCat = record?.getCellValue("Event Category");
let event = record?.getCellValue("Major Event");
let dayNumber = record?.getCellValue("Number Day");
let startDay = record?.getCellValue("Start Date");
let endDay = record?.getCellValue("End Date");
let project = record?.getCellValue("PROJECT LIST");

//console.log(record);

let startDayZ = new Date(startDay);
let endDayZ = new Date(endDay);

let nextday = new Date();
nextday.setDate(startDayZ.getDate() + 1)
//console.log(nextday)

// TODO: ADD IN SKIPPING WEEKENDS

for (let i = 1; i < Number(numDays); i++){

    let dayNumberZ = Number(dayNumber) + i;
    let nextStartDay = new Date();
    nextStartDay.setTime(startDayZ.getTime() + i*(8.64e+7))
    let nextEndDay = new Date();
    nextEndDay.setTime(endDayZ.getTime() + i*(8.64e+7))
    let recordIds = await table.createRecordsAsync([
            {
                fields:{
                    "PROJECT LIST": project,
                    "Event Category": eventCat,
                    "Major Event": event,
                    "Number Day": dayNumberZ.toString(),
                    "Start Date": nextStartDay,
                    "End Date": nextEndDay}
            }
        ]
    )};

output.text(`${numDays} events created.`)