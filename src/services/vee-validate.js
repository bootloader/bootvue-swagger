import { extend, configure } from "vee-validate";
import { required, email, min,regex } from "vee-validate/dist/rules";
import { i18n } from "./i18n";
import formatters from './../services/formatters'; 

configure({
    defaultMessage: (field, values) => {
        console.log("defaultMessage",field, values);
      // override the field name.
      values._field_ = i18n.t(`fields.${field}`);
      return i18n.t(`validation.${values._rule_}`, values);
    }
});
  
    // No message specified.
extend('email', email);
extend("regex", regex);
extend("min", min);
    // Override the default message.
extend('required', {
    ...required,
    message: 'This field is required'
});
  
  formatters.validators.forEach(ruleName => {
    if(formatters[ruleName]){
      extend(ruleName, {
        validate(value, args,a) { 
            console.log("validate", ruleName,value, args,a)
            //values._field_ = i18n.t(`fields.${field}`);
            let vResult = formatters[ruleName](value, args);
            if(vResult === true){
                return true;
            }
            else return i18n.t(vResult);
        }
      });
    }
  });
  