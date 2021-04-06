const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// common questions related to all employees
const employeeQuestions=[
    {
        type: 'input',
        name: 'name',
        validate: (val) => val !== '',
        message: 'Please enter name ?'
    },
    {
        type: 'input',
        name: 'id',
        validate: (val) => val !== '',
        message: 'Please enter employee id ?'
    },
    {
        type: 'input',
        name: 'email',
        validate: (val) => /\S+@\S+\.\S+/.test(val),
        message: 'Please enter employee email id ?'
    },
]

// manager specific questions
const managerQuestions = [
    {
        type: 'input',
        name: 'officeNumber',
        validate: (val) => val !== '',
        message: 'Please enter office number ?'
    },
]

// engineer specific questions
const engineerQuestions = [
    {
        type: 'input',
        name: 'github',
        validate: (val) => val !== '',
        message: 'Please enter github username ?'
    },
]

const internQuestions = [
    {
        type: 'input',
        name: 'school',
        validate: (val) => val !== '',
        message: 'Please enter school username ?'
    },
]

const addEmployees = async () =>{
    console.log("Please enter employee details \n")
    const employees = []
    let addMoreEmployees = true
    do{
        // ask for employee type to add
        const employeeTypeAnswer = await inquirer.prompt([
            {
            name: "employeeType",
            type: "list",
            message: "Select Employee Type",
            choices: ['Engineer', 'Intern'],
            },
        ])
        let questions = [...employeeQuestions]
        let employee
        if(employeeTypeAnswer.employeeType == 'Intern'){
            questions.push(...internQuestions)
            const employeeAnswers = await inquirer.prompt(questions)
            const {name, id, email, school} = employeeAnswers
            employee = new Intern(name, id, email, school)
        }else{
            questions.push(...engineerQuestions)
            const employeeAnswers = await inquirer.prompt(questions)
            const {name, id, email, github} = employeeAnswers
            employee = new Engineer(name, id, email, github)
        }
        employees.push(employee)
        // Ask user if he wants to add more employees ?
        const confirmationAnswer = await inquirer.prompt([{
                type: 'confirm',
                name: 'confirmation',
                message: 'Would you like to add more employees ?'
            }])
        addMoreEmployees = confirmationAnswer.confirmation
    }
    while(addMoreEmployees)
    return employees
}

const addManager = async ()=>{
    console.log("Please enter manager details \n")
    const answers = await inquirer.prompt([...employeeQuestions, ...managerQuestions])
    console.log({answers})
    const {name, id, email, officeNumber} = answers
    return new Manager(name, id, email, officeNumber)
}

const init = async ()=>{

    const team = []
    const manager = await addManager()
    const employees = await addEmployees()
    
    team.push(...[manager, ...employees])
    
    const html = render(team)

    if(!fs.existsSync(OUTPUT_DIR)){
        fs.mkdirSync(OUTPUT_DIR)
    }
    fs.writeFileSync(outputPath, html)
    console.log(`Team html file is created at ${outputPath}`)
}
init()


