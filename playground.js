
const fs = require('fs')
const pdfparse = require('pdf-parse')
let {section} = require('./model/section')
let sections = section.find({})
console.log(sections.docs)
 
// const path = "uploads/cvs/kal.pdf"
// const file = fs.readFileSync(path)
// const sections = ['education', 'skill', 'experience', 'contact', 'certification']
// pdfparse(file).then((data)=>{
//   let {text} = data 
//   let cvSections = []
//   sections.forEach((section, index)=>{
//     let Section = section + " \n"
//     var regex = new RegExp( `${Section}`  , "ig")
//     let start = text.search(regex) 
//     cvSections.push({start, name:section}) 
//   })
//   let uploadedSection = []
//   cvSections = cvSections.sort(function(a, b){return  a.start - b.start })
//   cvSections.forEach((cvsection,index)=>{
//     let description
//     if(index===cvSections.length-1){
//       let start = cvSections[index].start + cvsection.name.length
//       description = text.substring(start)
//       description = description.trim()
//       description = description.replace("\n", "")
//     }
//     else{
//       let start = cvSections[index].start + cvsection.name.length
//       let end =  cvSections[index+1].start 
//       description = text.substring(start, end)
//       description = description.trim()
//       description = description.replace("\n", "")
//     }
     
//       uploadedSection.push(
//         {
//           name: cvsection.name,
//           description

//         }
//       )
//   })

//   console.log(uploadedSection)
 
  
// })