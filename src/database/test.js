const Database = require("./db")
const createProffy = require("./createProffy")

Database.then(async (db) => {
    // Inserir dados 
    proffyValue = {
        name: "Diego Fernandes", 
        avatar: "https://avatars2.githubusercontent.com/u/2254731?s=460&amp;u=0ba16a79456c2f250e7579cb388fa18c5c2d7d65&amp;v=4",
        whatsapp: "47997797859",
        bio: "Entusiasta das melhores tecnologias de química avançada. Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma das minhas explosões.",
    }

    classValue = {
        subject: 1,
        cost: "40",
        // o PROFFY_ID irá vir do DB
    }

    classScheduleValues = [
        // CLASS_ID irá vir do DB
        {
            weekday: 1,
            time_from: 720,
            time_to: 1220,
        },
        {
            weekday: 0,
            time_from: 520,
            time_to: 1220,
        }
    ]

    //await createProffy(db, {proffyValue, classValue, classScheduleValues})
    // Consultar dados inseridos

    // Todos os proffys
    const selectedProffys = await db.all("SELECT * FROM proffys")
    //console.log(selectedProffys)

    // Consultar classes de um determinado professor 

    const selectClassAndProffys = await db.all(`
        SELECT classes.*, proffys.*
        FROM proffys
        JOIN classes ON (classes.proffy_id = proffys.id)
        WHERE classes.proffy_id = 1;
    `)

    // console.log(selectClassAndProffys)

    // O horário a qual a pessoa trabalha, por exemplo, é das 8h - 18h
    // O horário  do time_from (8h) precisa ser menor ou igual o horário solicitado 
    // O time_to precisa ser acima
    const selectClassesSchedules = await db.all(`
        SELECT class_schedule.*
        FROM class_schedule
        WHERE class_schedule.class_id = "1"
        AND class_schedule.weekday = "1"
        AND class_schedule.time_from <= "720"
        AND class_schedule.time_to > "520"
    `)

    //console.log(selectClassesSchedules)
})