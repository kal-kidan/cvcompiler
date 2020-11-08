const mongoose = require('../lib/db-connect');
const {section} = require('../model/section')
 
async function insertSections(){
    const sections = [
        {
            name: "achievement",
            category: "cv"
        },
        {
            name: "education",
            category: "cv"
        },
        {
            name: "personalInfo",
            category: "cv"
        },
        {
            name: "reference",
            category: "cv"
        },
        
        {
            name: "skills",
            category: "cv"
        },
        {
            name: "work",
            category: "cv"
        }
      
    ]

    try {
        for(let s of sections){
           let addedSection = new section(s)
           await addedSection.save()
        }
        
         console.log("sections added successfuly ...");
    } catch (error) {
        return console.log(error.message);
    }
}
insertSections();