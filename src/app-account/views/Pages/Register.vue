<template>
  <div>
    <!-- Page content -->
    <b-container class="x-position-absolute">
      <!-- Table -->
      <b-row class="justify-content-center">
        <b-col lg="6" md="8" >
          <b-card no-body class="bg-secondary border-0 " >
            <b-card-header class="px-lg-5 bg-transparent pb-2 d-none">
               <h2> Get started free </h2>
                <small> No credit card required</small>
            </b-card-header>
            <b-card-body class="px-lg-5 py-lg-4">
              <div class="text-muted mb-4">
               <h2> Get started free </h2>
                <small> No credit card required</small>
              </div>
              <div class="d-none">
                <div class="text-muted text-center mt-2 mb-4"><small>Sign up with</small></div>
                <div class="text-center">
                  <a href="#" class="btn btn-neutral btn-icon mr-4">
                    <span class="btn-inner--icon"><img src="/argon/img//icons/common/github.svg"></span>
                    <span class="btn-inner--text">Github</span>
                  </a>
                  <a href="#" class="btn btn-neutral btn-icon">
                    <span class="btn-inner--icon"><img src="/argon/img//icons/common/google.svg"></span>
                    <span class="btn-inner--text">Google</span>
                  </a>
                </div>
              </div>
              <div class="text-center text-muted mb-4 d-none">
                <small>Or sign up with credentials</small>
              </div>
              <validation-observer v-slot="{handleSubmit}" ref="formValidator">
                <b-form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input alternative question feedback
                              class="mb-3" 
                              ho="ho"
                              label="Name"
                              name="Name"
                              :rules="{required: true}"  required
                              v-model="model.name">
                  </base-input>

                  <base-input alternative question feedback
                              class="mb-3"
                              placeholder="Email" label="Email" 
                              name="Email"
                              :rules="{required: true, email: true}" required
                              :valid="true"
                              v-model="model.email">
                  </base-input>


                  <base-input alternative question feedback
                              class="mb-3"
                              placeholder="Company Name" label="Company Name"
                              name="Company Name"
                              :rules="{required: true}"  required
                              v-model="model.company">
                  </base-input>

                <base-select alternative
                              class="mb-3"
                              placeholder="Role"
                              name="Role"
                              :rules="{required: true}"  required
                              v-model="model.role">
                  <option value="" disabled selected hidden>Role</option>
                  <option value="agency_partner_developer">Agency / Partner Developer</option>
                  <option value="professional_developer">Professional Developer</option>
                  <option value="technology_business_manager">Technology / Business Manager</option>
                  <option value="other">Other</option>
                </base-select>

            <base-select  alternative
                              class="mb-3"
                              placeholder="Country"
                              name="Country"
                              :rules="{required: true}"  required
                              v-model="model.country">
              <option value="" disabled selected hidden >Country</option>
              <option data-newsletter-checkbox="hidden" value="United States">United States</option>
              <option data-newsletter-checkbox="hidden" value="Afghanistan">Afghanistan</option>
              <option data-newsletter-checkbox="unchecked" value="Aland Islands">Aland Islands</option>
              <option data-newsletter-checkbox="hidden" value="Albania">Albania</option>
              <option data-newsletter-checkbox="hidden" value="Algeria">Algeria</option>
              <option data-newsletter-checkbox="unchecked" value="Andorra">Andorra</option>
              <option data-newsletter-checkbox="hidden" value="Angola">Angola</option>
              <option data-newsletter-checkbox="hidden" value="Anguilla">Anguilla</option>
              <option data-newsletter-checkbox="hidden" value="Antarctica">Antarctica</option>
              <option data-newsletter-checkbox="hidden" value="Antigua and Barbuda">Antigua and Barbuda</option>
              <option data-newsletter-checkbox="hidden" value="Argentina">Argentina</option>
              <option data-newsletter-checkbox="hidden" value="Armenia">Armenia</option>
              <option data-newsletter-checkbox="hidden" value="Aruba">Aruba</option>
              <option data-newsletter-checkbox="unchecked" value="Australia">Australia</option>
              <option data-newsletter-checkbox="unchecked" value="Austria">Austria</option>
              <option data-newsletter-checkbox="hidden" value="Azerbaijan">Azerbaijan</option>
              <option data-newsletter-checkbox="hidden" value="Bahamas">Bahamas</option>
              <option data-newsletter-checkbox="hidden" value="Bahrain">Bahrain</option>
              <option data-newsletter-checkbox="hidden" value="Bangladesh">Bangladesh</option>
              <option data-newsletter-checkbox="hidden" value="Barbados">Barbados</option>
              <option data-newsletter-checkbox="hidden" value="Belarus">Belarus</option>
              <option data-newsletter-checkbox="unchecked" value="Belgium">Belgium</option>
              <option data-newsletter-checkbox="hidden" value="Belize">Belize</option>
              <option data-newsletter-checkbox="hidden" value="Benin">Benin</option>
              <option data-newsletter-checkbox="hidden" value="Bermuda">Bermuda</option>
              <option data-newsletter-checkbox="hidden" value="Bhutan">Bhutan</option>
              <option data-newsletter-checkbox="hidden" value="Bolivia, Plurinational State of">Bolivia, Plurinational State of</option>
              <option data-newsletter-checkbox="checked" value="Bonaire, Sint Eustatius and Saba">Bonaire, Sint Eustatius and Saba</option>
              <option data-newsletter-checkbox="hidden" value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
              <option data-newsletter-checkbox="hidden" value="Botswana">Botswana</option>
              <option data-newsletter-checkbox="hidden" value="Bouvet Island">Bouvet Island</option>
              <option data-newsletter-checkbox="hidden" value="Brazil">Brazil</option>
              <option data-newsletter-checkbox="unchecked" value="British Indian Ocean Territory">British Indian Ocean Territory</option>
              <option data-newsletter-checkbox="hidden" value="Brunei Darussalam">Brunei Darussalam</option>
              <option data-newsletter-checkbox="unchecked" value="Bulgaria">Bulgaria</option>
              <option data-newsletter-checkbox="hidden" value="Burkina Faso">Burkina Faso</option>
              <option data-newsletter-checkbox="hidden" value="Burundi">Burundi</option>
              <option data-newsletter-checkbox="hidden" value="Cambodia">Cambodia</option>
              <option data-newsletter-checkbox="hidden" value="Cameroon">Cameroon</option>
              <option data-newsletter-checkbox="unchecked" value="Canada">Canada</option>
              <option data-newsletter-checkbox="hidden" value="Cape Verde">Cape Verde</option>
              <option data-newsletter-checkbox="hidden" value="Cayman Islands">Cayman Islands</option>
              <option data-newsletter-checkbox="hidden" value="Central African Republic">Central African Republic</option>
              <option data-newsletter-checkbox="hidden" value="Chad">Chad</option>
              <option data-newsletter-checkbox="hidden" value="Chile">Chile</option>
              <option data-newsletter-checkbox="unchecked" value="China*">China*</option>
              <option data-newsletter-checkbox="checked" value="Chinese Taipei">Chinese Taipei</option>
              <option data-newsletter-checkbox="hidden" value="Christmas Island">Christmas Island</option>
              <option data-newsletter-checkbox="hidden" value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
              <option data-newsletter-checkbox="unchecked" value="Colombia">Colombia</option>
              <option data-newsletter-checkbox="hidden" value="Comoros">Comoros</option>
              <option data-newsletter-checkbox="hidden" value="Congo, the Democratic Republic of the">Congo, the Democratic Republic of the</option>
              <option data-newsletter-checkbox="hidden" value="Cook Islands">Cook Islands</option>
              <option data-newsletter-checkbox="hidden" value="Costa Rica">Costa Rica</option>
              <option data-newsletter-checkbox="hidden" value="Cote d'Ivoire">Cote d'Ivoire</option>
              <option data-newsletter-checkbox="unchecked" value="Crimea">Crimea</option>
              <option data-newsletter-checkbox="unchecked" value="Croatia">Croatia</option>
              <option data-newsletter-checkbox="checked" value="Cuba">Cuba</option>
              <option data-newsletter-checkbox="checked" value="Curaçao">Curaçao</option>
              <option data-newsletter-checkbox="unchecked" value="Cyprus">Cyprus</option>
              <option data-newsletter-checkbox="unchecked" value="Czech Republic">Czech Republic</option>
              <option data-newsletter-checkbox="unchecked" value="Denmark">Denmark</option>
              <option data-newsletter-checkbox="hidden" value="Djibouti">Djibouti</option>
              <option data-newsletter-checkbox="hidden" value="Dominica">Dominica</option>
              <option data-newsletter-checkbox="hidden" value="Dominican Republic">Dominican Republic</option>
              <option data-newsletter-checkbox="hidden" value="Ecuador">Ecuador</option>
              <option data-newsletter-checkbox="hidden" value="Egypt">Egypt</option>
              <option data-newsletter-checkbox="hidden" value="El Salvador">El Salvador</option>
              <option data-newsletter-checkbox="hidden" value="Equatorial Guinea">Equatorial Guinea</option>
              <option data-newsletter-checkbox="hidden" value="Eritrea">Eritrea</option>
              <option data-newsletter-checkbox="unchecked" value="Estonia">Estonia</option>
              <option data-newsletter-checkbox="hidden" value="Ethiopia">Ethiopia</option>
              <option data-newsletter-checkbox="unchecked" value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
              <option data-newsletter-checkbox="unchecked" value="Faroe Islands">Faroe Islands</option>
              <option data-newsletter-checkbox="hidden" value="Fiji">Fiji</option>
              <option data-newsletter-checkbox="unchecked" value="Finland">Finland</option>
              <option data-newsletter-checkbox="unchecked" value="France">France</option>
              <option data-newsletter-checkbox="hidden" value="French Guiana">French Guiana</option>
              <option data-newsletter-checkbox="unchecked" value="French Polynesia">French Polynesia</option>
              <option data-newsletter-checkbox="unchecked" value="French Southern Territories">French Southern Territories</option>
              <option data-newsletter-checkbox="hidden" value="Gabon">Gabon</option>
              <option data-newsletter-checkbox="hidden" value="Gambia">Gambia</option>
              <option data-newsletter-checkbox="hidden" value="Georgia">Georgia</option>
              <option data-newsletter-checkbox="unchecked" value="Germany">Germany</option>
              <option data-newsletter-checkbox="hidden" value="Ghana">Ghana</option>
              <option data-newsletter-checkbox="unchecked" value="Gibraltar">Gibraltar</option>
              <option data-newsletter-checkbox="unchecked" value="Greece">Greece</option>
              <option data-newsletter-checkbox="unchecked" value="Greenland">Greenland</option>
              <option data-newsletter-checkbox="hidden" value="Grenada">Grenada</option>
              <option data-newsletter-checkbox="unchecked" value="Guadeloupe">Guadeloupe</option>
              <option data-newsletter-checkbox="hidden" value="Guatemala">Guatemala</option>
              <option data-newsletter-checkbox="unchecked" value="Guernsey">Guernsey</option>
              <option data-newsletter-checkbox="hidden" value="Guinea">Guinea</option>
              <option data-newsletter-checkbox="hidden" value="Guinea-Bissau">Guinea-Bissau</option>
              <option data-newsletter-checkbox="hidden" value="Guyana">Guyana</option>
              <option data-newsletter-checkbox="hidden" value="Haiti">Haiti</option>
              <option data-newsletter-checkbox="hidden" value="Heard Island and McDonald Islands">Heard Island and McDonald Islands</option>
              <option data-newsletter-checkbox="unchecked" value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
              <option data-newsletter-checkbox="hidden" value="Honduras">Honduras</option>
              <option data-newsletter-checkbox="unchecked" value="Hong Kong">Hong Kong</option>
              <option data-newsletter-checkbox="unchecked" value="Hungary">Hungary</option>
              <option data-newsletter-checkbox="unchecked" value="Iceland">Iceland</option>
              <option data-newsletter-checkbox="hidden" value="India">India</option>
              <option data-newsletter-checkbox="hidden" value="Indonesia">Indonesia</option>
              <option data-newsletter-checkbox="checked" value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
              <option data-newsletter-checkbox="hidden" value="Iraq">Iraq</option>
              <option data-newsletter-checkbox="unchecked" value="Ireland">Ireland</option>
              <option data-newsletter-checkbox="unchecked" value="Isle of Man">Isle of Man</option>
              <option data-newsletter-checkbox="unchecked" value="Israel">Israel</option>
              <option data-newsletter-checkbox="unchecked" value="Italy">Italy</option>
              <option data-newsletter-checkbox="hidden" value="Jamaica">Jamaica</option>
              <option data-newsletter-checkbox="checked" value="Japan">Japan</option>
              <option data-newsletter-checkbox="unchecked" value="Jersey">Jersey</option>
              <option data-newsletter-checkbox="hidden" value="Jordan">Jordan</option>
              <option data-newsletter-checkbox="hidden" value="Kazakhstan">Kazakhstan</option>
              <option data-newsletter-checkbox="hidden" value="Kenya">Kenya</option>
              <option data-newsletter-checkbox="hidden" value="Kiribati">Kiribati</option>
              <option data-newsletter-checkbox="checked" value="Korea, Democratic People’s Republic of">Korea, Democratic People’s Republic of</option>
              <option data-newsletter-checkbox="unchecked" value="Korea, Republic of">Korea, Republic of</option>
              <option data-newsletter-checkbox="hidden" value="Kuwait">Kuwait</option>
              <option data-newsletter-checkbox="hidden" value="Kyrgyzstan">Kyrgyzstan</option>
              <option data-newsletter-checkbox="hidden" value="Lao People’s Democratic Republic">Lao People’s Democratic Republic</option>
              <option data-newsletter-checkbox="unchecked" value="Latvia">Latvia</option>
              <option data-newsletter-checkbox="hidden" value="Lebanon">Lebanon</option>
              <option data-newsletter-checkbox="hidden" value="Lesotho">Lesotho</option>
              <option data-newsletter-checkbox="hidden" value="Liberia">Liberia</option>
              <option data-newsletter-checkbox="hidden" value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
              <option data-newsletter-checkbox="unchecked" value="Liechtenstein">Liechtenstein</option>
              <option data-newsletter-checkbox="unchecked" value="Lithuania">Lithuania</option>
              <option data-newsletter-checkbox="unchecked" value="Luxembourg">Luxembourg</option>
              <option data-newsletter-checkbox="hidden" value="Macao">Macao</option>
              <option data-newsletter-checkbox="hidden" value="Macedonia, the former Yugoslav Republic of">Macedonia, the former Yugoslav Republic of</option>
              <option data-newsletter-checkbox="hidden" value="Madagascar">Madagascar</option>
              <option data-newsletter-checkbox="hidden" value="Malawi">Malawi</option>
              <option data-newsletter-checkbox="hidden" value="Malaysia">Malaysia</option>
              <option data-newsletter-checkbox="hidden" value="Maldives">Maldives</option>
              <option data-newsletter-checkbox="hidden" value="Mali">Mali</option>
              <option data-newsletter-checkbox="unchecked" value="Malta">Malta</option>
              <option data-newsletter-checkbox="unchecked" value="Martinique">Martinique</option>
              <option data-newsletter-checkbox="hidden" value="Mauritania">Mauritania</option>
              <option data-newsletter-checkbox="hidden" value="Mauritius">Mauritius</option>
              <option data-newsletter-checkbox="unchecked" value="Mayotte">Mayotte</option>
              <option data-newsletter-checkbox="hidden" value="Mexico">Mexico</option>
              <option data-newsletter-checkbox="hidden" value="Moldova, Republic of">Moldova, Republic of</option>
              <option data-newsletter-checkbox="unchecked" value="Monaco">Monaco</option>
              <option data-newsletter-checkbox="hidden" value="Mongolia">Mongolia</option>
              <option data-newsletter-checkbox="hidden" value="Montenegro">Montenegro</option>
              <option data-newsletter-checkbox="hidden" value="Montserrat">Montserrat</option>
              <option data-newsletter-checkbox="unchecked" value="Morocco">Morocco</option>
              <option data-newsletter-checkbox="hidden" value="Mozambique">Mozambique</option>
              <option data-newsletter-checkbox="hidden" value="Myanmar">Myanmar</option>
              <option data-newsletter-checkbox="hidden" value="Namibia">Namibia</option>
              <option data-newsletter-checkbox="hidden" value="Nauru">Nauru</option>
              <option data-newsletter-checkbox="hidden" value="Nepal">Nepal</option>
              <option data-newsletter-checkbox="unchecked" value="Netherlands">Netherlands</option>
              <option data-newsletter-checkbox="unchecked" value="New Caledonia">New Caledonia</option>
              <option data-newsletter-checkbox="unchecked" value="New Zealand">New Zealand</option>
              <option data-newsletter-checkbox="hidden" value="Nicaragua">Nicaragua</option>
              <option data-newsletter-checkbox="hidden" value="Niger">Niger</option>
              <option data-newsletter-checkbox="hidden" value="Nigeria">Nigeria</option>
              <option data-newsletter-checkbox="hidden" value="Niue">Niue</option>
              <option data-newsletter-checkbox="hidden" value="Norfolk Island">Norfolk Island</option>
              <option data-newsletter-checkbox="unchecked" value="Norway">Norway</option>
              <option data-newsletter-checkbox="hidden" value="Oman">Oman</option>
              <option data-newsletter-checkbox="hidden" value="Pakistan">Pakistan</option>
              <option data-newsletter-checkbox="hidden" value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
              <option data-newsletter-checkbox="unchecked" value="Panama">Panama</option>
              <option data-newsletter-checkbox="hidden" value="Papua New Guinea">Papua New Guinea</option>
              <option data-newsletter-checkbox="hidden" value="Paraguay">Paraguay</option>
              <option data-newsletter-checkbox="hidden" value="Peru">Peru</option>
              <option data-newsletter-checkbox="hidden" value="Philippines">Philippines</option>
              <option data-newsletter-checkbox="hidden" value="Pitcairn">Pitcairn</option>
              <option data-newsletter-checkbox="unchecked" value="Poland">Poland</option>
              <option data-newsletter-checkbox="unchecked" value="Portugal">Portugal</option>
              <option data-newsletter-checkbox="hidden" value="Qatar">Qatar</option>
              <option data-newsletter-checkbox="unchecked" value="Reunion">Reunion</option>
              <option data-newsletter-checkbox="unchecked" value="Romania">Romania</option>
              <option data-newsletter-checkbox="unchecked" value="Russian Federation">Russian Federation</option>
              <option data-newsletter-checkbox="hidden" value="Rwanda">Rwanda</option>
              <option data-newsletter-checkbox="hidden" value="Saint Barthélemy">Saint Barthélemy</option>
              <option data-newsletter-checkbox="unchecked" value="Saint Helena, Ascension and Tristan da Cunha">Saint Helena, Ascension and Tristan da Cunha</option>
              <option data-newsletter-checkbox="hidden" value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
              <option data-newsletter-checkbox="hidden" value="Saint Lucia">Saint Lucia</option>
              <option data-newsletter-checkbox="unchecked" value="Saint Martin (French part)">Saint Martin (French part)</option>
              <option data-newsletter-checkbox="unchecked" value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
              <option data-newsletter-checkbox="hidden" value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
              <option data-newsletter-checkbox="hidden" value="Samoa">Samoa</option>
              <option data-newsletter-checkbox="unchecked" value="San Marino">San Marino</option>
              <option data-newsletter-checkbox="hidden" value="Sao Tome and Principe">Sao Tome and Principe</option>
              <option data-newsletter-checkbox="hidden" value="Saudi Arabia">Saudi Arabia</option>
              <option data-newsletter-checkbox="hidden" value="Senegal">Senegal</option>
              <option data-newsletter-checkbox="unchecked" value="Serbia">Serbia</option>
              <option data-newsletter-checkbox="hidden" value="Seychelles">Seychelles</option>
              <option data-newsletter-checkbox="hidden" value="Sierra Leone">Sierra Leone</option>
              <option data-newsletter-checkbox="unchecked" value="Singapore">Singapore</option>
              <option data-newsletter-checkbox="checked" value="Sint Maarten (Dutch part)">Sint Maarten (Dutch part)</option>
              <option data-newsletter-checkbox="unchecked" value="Slovakia">Slovakia</option>
              <option data-newsletter-checkbox="unchecked" value="Slovenia">Slovenia</option>
              <option data-newsletter-checkbox="hidden" value="Solomon Islands">Solomon Islands</option>
              <option data-newsletter-checkbox="hidden" value="Somalia">Somalia</option>
              <option data-newsletter-checkbox="hidden" value="South Africa">South Africa</option>
              <option data-newsletter-checkbox="unchecked" value="South Georgia and the South Sandwich Islands">South Georgia and the South Sandwich Islands</option>
              <option data-newsletter-checkbox="hidden" value="South Sudan">South Sudan</option>
              <option data-newsletter-checkbox="unchecked" value="Spain">Spain</option>
              <option data-newsletter-checkbox="hidden" value="Sri Lanka">Sri Lanka</option>
              <option data-newsletter-checkbox="checked" value="Sudan">Sudan</option>
              <option data-newsletter-checkbox="hidden" value="Suriname">Suriname</option>
              <option data-newsletter-checkbox="unchecked" value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
              <option data-newsletter-checkbox="hidden" value="Swaziland">Swaziland</option>
              <option data-newsletter-checkbox="unchecked" value="Sweden">Sweden</option>
              <option data-newsletter-checkbox="unchecked" value="Switzerland">Switzerland</option>
              <option data-newsletter-checkbox="checked" value="Syrian Arab Republic">Syrian Arab Republic</option>
              <option data-newsletter-checkbox="hidden" value="Taiwan">Taiwan</option>
              <option data-newsletter-checkbox="hidden" value="Tajikistan">Tajikistan</option>
              <option data-newsletter-checkbox="hidden" value="Tanzania, United Republic of">Tanzania, United Republic of</option>
              <option data-newsletter-checkbox="hidden" value="Thailand">Thailand</option>
              <option data-newsletter-checkbox="hidden" value="Timor-Leste">Timor-Leste</option>
              <option data-newsletter-checkbox="hidden" value="Togo">Togo</option>
              <option data-newsletter-checkbox="hidden" value="Tokelau">Tokelau</option>
              <option data-newsletter-checkbox="hidden" value="Tonga">Tonga</option>
              <option data-newsletter-checkbox="hidden" value="Trinidad and Tobago">Trinidad and Tobago</option>
              <option data-newsletter-checkbox="hidden" value="Tunisia">Tunisia</option>
              <option data-newsletter-checkbox="hidden" value="Turkey">Turkey</option>
              <option data-newsletter-checkbox="hidden" value="Turkmenistan">Turkmenistan</option>
              <option data-newsletter-checkbox="hidden" value="Turks and Caicos Islands">Turks and Caicos Islands</option>
              <option data-newsletter-checkbox="hidden" value="Tuvalu">Tuvalu</option>
              <option data-newsletter-checkbox="hidden" value="Uganda">Uganda</option>
              <option data-newsletter-checkbox="unchecked" value="Ukraine">Ukraine</option>
              <option data-newsletter-checkbox="hidden" value="United Arab Emirates">United Arab Emirates</option>
              <option data-newsletter-checkbox="unchecked" value="United Kingdom">United Kingdom</option>
              <option data-newsletter-checkbox="hidden" value="Uruguay">Uruguay</option>
              <option data-newsletter-checkbox="hidden" value="Uzbekistan">Uzbekistan</option>
              <option data-newsletter-checkbox="hidden" value="Vanuatu">Vanuatu</option>
              <option data-newsletter-checkbox="hidden" value="Venezuela, Bolivarian Republic of">Venezuela, Bolivarian Republic of</option>
              <option data-newsletter-checkbox="hidden" value="Vietnam">Vietnam</option>
              <option data-newsletter-checkbox="unchecked" value="Virgin Islands, British">Virgin Islands, British</option>
              <option data-newsletter-checkbox="hidden" value="Wallis and Futuna">Wallis and Futuna</option>
              <option data-newsletter-checkbox="hidden" value="Western Sahara">Western Sahara</option>
              <option data-newsletter-checkbox="hidden" value="Yemen">Yemen</option>
              <option data-newsletter-checkbox="hidden" value="Zambia">Zambia</option>
              <option data-newsletter-checkbox="hidden" value="Zimbabwe">Zimbabwe</option>
</base-select>


                  <div class="text-center">
                    <b-button type="submit" variant="primary" class="mt-4">Create account</b-button>
                  </div>
                </b-form>
              </validation-observer>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>

  import "@fortawesome/fontawesome-free/css/all.css";

  export default {
    name: 'register',
    data() {
      return {
        model: {
          name: '',
          email: '',
          company: '',
          password: '',
          role: '',
          country: '',
          agree: false
        }
      }
    },
    methods: {
      onSubmit() {
        // this will be called only after form is valid. You can do an api call here to register users
        this.$router.push("/register-done")
      }
    }

  };
</script>
<style  lang="scss">





@-webkit-keyframes appear {
  100% {
    opacity: 1;
  }
}

@keyframes appear {
  100% {
    opacity: 1;
  }
}

</style>
