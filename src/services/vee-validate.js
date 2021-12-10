import { extend, configure } from "vee-validate";
import { required, email, min,max,regex } from "vee-validate/dist/rules";
import { i18n } from "./i18n";
import formatters from './../services/formatters'; 

    // No message specified.
extend('email', email);
extend("regex", regex);
extend("min", min);
extend("max", max);
    // Override the default message.
extend('required', {
    ...required,
    message: 'This field is required'
});
  
  formatters.validators.forEach(ruleName => {
    if(formatters[ruleName]){
      extend(ruleName, {
        validate(value, args,a) { 
            //console.log("validate", ruleName,value, args,a)
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

  configure({
    classes: {
      valid: 'is-valid',
      invalid: 'is-invalid',
      dirty: ['is-dirty', 'is-dirty'], // multiple classes per flag!
    },
    defaultMessage: (field, values) => {
      //console.log("defaultMessage",field, values);
      // override the field name.
      let key = `fields.${field}`;
      let label = i18n.t(key)
      values._field_ = (label == key) ? field : label;
      return i18n.t(`validation.${values._rule_}`, values);
    }
});