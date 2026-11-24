const employee = {
    name: "Damir",
    age: 21,
    salary: 3000,
    language: "JavaScript"
};

const { name: employeeName, salary, language  } = employee;

console.log( employeeName, salary, language );

const { age: employeeAge } = employee;

const { country = "Georgia"} = employee;

