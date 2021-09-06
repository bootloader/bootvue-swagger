import Vue from "vue";
import VueI18n from "vue-i18n";
import ar from "vee-validate/dist/locale/ar.json";
import en from "vee-validate/dist/locale/en.json";

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: "en",
  messages: {
    ar: {
      fields: {
        email: "البريد الاليكتروني",
        password: "كلمة السر"
      },
      validation: ar.messages
    },
    en: {
      fields: {
        email: "E-mail",
        name: "Name",
        phone : "Phone",
        company : "Company Name",
        country : "Country",
        role : "Role",
        password: "Password"
      },
      validation: en.messages,
      errors : {
        'NotNull' : "The {_field_} is required",
        'ValidPhone' : 'Enter valid {_field_} eg +91 XXXXX XXXXX',
        'ValidPhonesPerLine' : 'Enter valid mobile number eg 91XXXXXXXXXX per line',
        'ValidEmail' : "Enter valid email address eg you@company.com",
        'Pattern' : "Enter valid {_field_}"
      }
    }
  }
});

export { i18n };
