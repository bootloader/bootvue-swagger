export default {
    listof(value,[rule]){
        let values = value.split(",");
        for(var i in values){
            let msg = this[rule](values[i]);
            if(msg!==true){
                return msg;
            }
        }
        return true;
    },
    ipaddress(value){
      // if the field is empty
      if (!value) {
        return 'This field is required';
      }
      // if the field is not a valid email
      const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!regex.test(value)) {
        return 'This field must be a valid IP Address';
      }
      // All is good
      return true;
    }
};