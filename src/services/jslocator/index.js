const axios = require('axios')


/**
 * Buy plans
 * 
 * https://ipgeolocation.io/pricing.html
 * https://www.abstractapi.com/ip-geolocation-api#pricing
 * https://ip-api.com/docs/api:json
 * https://ipapi.com/product
 * 
 * 
 */
var jslocator = {
    location: {
        isUpdated : false,
        ip: '2405:201:400f:dc54:3029:c1b5:8ba8:b874',
        continent_code: 'AS',
        continent_name: 'Asia',
        country_code2: 'IN',
        country_code3: 'IND',
        country_name: 'India',
        country_capital: 'New Delhi',
        state_prov: 'Maharashtra',
        district: 'Ghansoli',
        city: 'Navi Mumbai',
        zipcode: '400701',
        latitude: '19.13215',
        longitude: '73.00368',
        is_eu: false,
        calling_code: '+91',
        country_tld: '.in',
        languages:
            'en-IN,hi,bn,te,mr,ta,ur,gu,kn,ml,or,pa,as,bh,sat,ks,ne,sd,kok,doi,mni,sit,sa,fr,lus,inc',
        country_flag: 'https://ipgeolocation.io/static/flags/in_64.png',
        geoname_id: '10337890',
        isp: 'Reliance Jio Infocomm Limited',
        connection_type: '',
        organization: 'Reliance Jio Infocomm Limited',
        currency: { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
        time_zone: {
            name: 'Asia/Kolkata',
            offset: 5.5,
            current_time: '2022-01-13 20:41:17.225+0530',
            current_time_unix: 1642086677.225,
            is_dst: false,
            dst_savings: 0,
        },
    },
    options: {},
    request: null,
    async fetch() {
        if (this.options.ipgeolocation && this.options.ipgeolocation.apiKey) {
            try {
                this.request = axios.get(
                    'https://api.ipgeolocation.io/ipgeo?apiKey=' +
                        this.options.ipgeolocation.apiKey
                )
                let response = await this.request
                this.location = Object.assign({ isUpdated : true},response.data);
                return this.location
            } catch (e) {
                console.log(e)
            }
        } else {
            this.request = fetch(
                'https://ip2c.org/self'
            );
            let response = await this.request;
            let text = await response.text();
            let d = text.split(";");
            this.location = { isUpdated : true};
            this.location.country_code2 = d[1];
            this.location.country_code3 = d[2];
            this.location.country_name= d[3];
            this.location.isUpdated = false;
            return this.location;
        }
        return this.location;
    },
    async config(options) {
        this.options.ipgeolocation = options.ipgeolocation
        return await this.fetch()
    },
    async get() {
        if (this.location.isUpdated) {
            return this.location
        } else if (this.request) {
            await this.request
            return this.location;
        } else {
            return await this.fetch()
        }
    },
}

export default jslocator
