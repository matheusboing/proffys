const DataBase = require("./database/db")

const {subjects, weekdays, getSubject, convertHoursToMinutes} = require('./utils/format')

function pageLanding(req, res) {
    return res.render("index.html")
}

async function pageStudy(req, res) {
    const filters = req.query

    // Ele só busca caso todos os 3 campos para busca estiverem completos
    if(!filters.subject || !filters.weekday || !filters.time) {
        const query = ` 
        SELECT classes.*, proffys.*
        FROM proffys
        JOIN classes ON (classes.proffy_id = proffys.id)
        WHERE EXISTS(
            SELECT class_schedule.*
            FROM class_schedule
            WHERE class_schedule.class_id = classes.id
        )
        `
        // Caso haja erro na consulta de banco de dados
        try {
            const db = await DataBase
            const proffys = await db.all(query)
    
            proffys.map((proffy) => {
                proffy.subject = getSubject(proffy.subject)
            })
    
        return res.render("study.html", {proffys, subjects, filters, weekdays})
    } catch (error) {
        console.log(error)        
    }
}

    // Converter horas em minutos
    const timeToMinutes = convertHoursToMinutes(filters.time)

    console.log('Não tem campos vazios')
    console.log(filters)
    console.log(timeToMinutes)
    const query = ` 
    SELECT classes.*, proffys.*
    FROM proffys
    JOIN classes ON (classes.proffy_id = proffys.id)
    WHERE EXISTS(
        SELECT class_schedule.*
        FROM class_schedule
        WHERE class_schedule.class_id = classes.id
        AND class_schedule.weekday = ${filters.weekday}
        AND class_schedule.time_from <= ${timeToMinutes}
        AND class_schedule.time_to > ${timeToMinutes}
    )
    AND classes.subject = '${filters.subject}'
    `
    // Caso haja erro na consulta de banco de dados
    try {
        const db = await DataBase
        const proffys = await db.all(query)

        proffys.map((proffy) => {
            proffy.subject = getSubject(proffy.subject)
        })

        return res.render('study.html', {proffys, subjects, filters, weekdays})
        
    } catch (error) {
        console.log(error)        
    }
}

function pageGiveClasses(req, res) {
    return res.render("give-classes.html", {subjects, weekdays})
}

async function saveClasses(req, res) {
    const createProffy = require("./database/createProffy")
    const data = req.body

    const proffyValue = {
        name: data.name,
        avatar: data.avatar,
        whatsapp: data.whatsapp,
        bio: data.bio
    }

    const classValue = {
        subject: data.subject,
        cost: data.cost
    }

    const classScheduleValues = data.weekday.map(
        (weekday, index) => {
            return {
                weekday,
                time_from: convertHoursToMinutes(data.time_from[index]),
                time_to: convertHoursToMinutes(data.time_to[index])
            }
        })
 
        try {
            const db = await DataBase
            await createProffy(db, {proffyValue, classValue, classScheduleValues})

            let queryString = "?subject" + data.subject
            queryString += "&weekday=" + data.weekday[0]
            queryString += "&time=" + data.time_from[0]
            
            return res.redirect("/study" + queryString) 
        } catch (error) {
            console.log(error)
        }
}
module.exports = {
    pageLanding,
    pageStudy,
    pageGiveClasses,
    saveClasses
}