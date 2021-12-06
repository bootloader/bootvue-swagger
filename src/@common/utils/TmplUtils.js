const varFinder = /({{([\w\d\.]+)}})/g
function getVars(replaceVars, regex = varFinder) {
    var myArray = replaceVars.match(regex) || []
    var varList = []
    let unique = [...new Set(myArray)]
    for (var i in unique) {
        varList.push({
            index: i,
            number : (i+1),
            variable : unique[i],
            path: unique[i].replace(/(\{\{)|(\}\})/g, ''),
        })
    }
    return varList
}
function convertToOrderedVars(content,regex = varFinder) {
    let vars = [];
    return {
        vars : vars,
        text: content.replace(
            regex,
            (() => {
                var counter = 0
                return (variable) => {
                    let index = counter++;
                    let numVar = `{{${counter}}}`;
                    vars.push({
                        index : index,
                        number : counter,
                        variable : variable,
                        path: variable.replace(/(\{\{)|(\}\})/g, ''),
                        numVar : numVar
                    });
                    return numVar;
                }
            })()
        ),
    }
}
let counter = 0;
function sampleModel (){
    return  {
        contact : {
          name : "John Doe", phone : "919876543210", email : "John.Doe."+(counter++)+"@company.com"
        },
        data : {}
    };
}

export default { getVars, convertToOrderedVars,sampleModel }
