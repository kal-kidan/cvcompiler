const mongoose = require('../lib/db-connect');
const {section} = require('../model/section')
 
async function insertSections(){
    const sections = [
        {
            name: "education",
            category: "cv"
        },
        {
            name: "work",
            category: "cv"
        },
        {
            name: "personal_info",
            category: "cv"
        },
        {
            name: "achievement",
            category: "cv"
        },
        {
            name: "skill",
            category: "cv"
        }
    ]

    try {
        await section.create(sections)
        return console.log("sections added successfuly ...");
    } catch (error) {
        return console.log(error.message);
    }
}
insertSections();