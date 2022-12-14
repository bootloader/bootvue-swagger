import formatters from '@/services/formatters';

import TmplUtils from './TmplUtils';
import JsonXPath from './JsonXPath';
import mustache from 'mustache';

function toHSM(waba){
    console.log("toHSMs",waba);
    let hsm = {
        code : waba?.template?.name,
        lang : waba?.template?.language,
        category : waba?.template?.category,
        categoryType : (waba?.template?.category),
        meta : {
        }
    };
    hsm.template = (waba?.template?.components || []).filter(function(cmp){
        return cmp.type == "BODY";
    })[0]?.text;
    hsm.header = (waba?.template?.components || []).filter(function(cmp){
        if(cmp.type == "HEADER"){
            hsm.formatType = cmp.format; // VIDEO,TEXT
            return true;
        }
        return false;
    })[0]?.text;
    return hsm;
}
function cloneWABATmplSample(template,hsm) {
    hsm = hsm || {};
    let bodyText = null,headerText;
    let templateRaw = (hsm?.body || hsm?.template || "").split("---options---");
    let varMap = {buttons : []};

    
    if(templateRaw[0]){
        let body = TmplUtils.convertToOrderedVars(templateRaw[0]);
        bodyText = body.text;
        varMap.body = body.vars;
        if(hsm?.model){
            for(var i in varMap.body){
                varMap.body[i].component = "body";
                varMap.body[i].sample =  JsonXPath({ path : '$.'+varMap.body[i].path,json : hsm?.model})[0]
            }
        }
    }
    console.log("Not Returned")
    
    if(hsm?.header){
        let header = TmplUtils.convertToOrderedVars(hsm?.header);
        headerText = header.text;
        varMap.header = header.vars;
        if(hsm?.model){
            for(var i in varMap.header){
                varMap.header[i].component = "header";
                varMap.header[i].sample =  JsonXPath({ path : '$.'+varMap.header[i].path,json : hsm?.model})[0]
            }
        }
    }

    if(hsm?.options?.buttons){
        hsm?.options?.buttons.map(function(btn){
            let buttonVars = [];
            if(btn.type == "URL"){
                let btnTmpl = TmplUtils.convertToOrderedVars(btn.url);
                btn.urlWaba = btnTmpl.text;
                buttonVars = btnTmpl.vars;
                if(hsm?.model){
                    for(var i in buttonVars){
                        buttonVars[i].component = "button";
                        buttonVars[i].sample = mustache.render(btn.urlWaba, hsm?.model);
                    }
                }
            } else if(btn.type == "QUICK_REPLY"){
                let btnTmpl = TmplUtils.convertToOrderedVars(btn.code || btn.key);
                btn.codeWaba = btnTmpl.text;
                buttonVars = btnTmpl.vars;
                if(hsm?.model){
                    for(var i in buttonVars){
                        buttonVars[i].component = "button";
                        buttonVars[i].sample = mustache.render(btn.codeWaba, hsm?.model);
                    }
                }
            }
            varMap.buttons.push(buttonVars);
            return btn;
        });
    }

    let templateOptions = formatters.message_form_options(formatters.map_from_string(templateRaw[1]));

    return {
        channelId : template.channelId,
        code  : template.code,
        lang  : template.lang,
        category : template.category,
        contactType : template.contactType,
        channelType : template.channelType,
        varMap : varMap,
        hsmTemplateId : template.hsmTemplateId || hsm?.id,
        model : Object.assign(TmplUtils.sampleModel(),{
            data : hsm?.model?.data || hsm?.data,
            contact :  hsm?.model?.contact,
        }),
        template : {
            name : template.code,
            language : template.lang,
            category : template.category,
            components: [
                {
                    type: 'BODY',
                    text: bodyText
                },
                (function(){
                    let format = (function(){
                        let formatType = (hsm?.formatType || hsm?.meta?.contentType)
                        switch(formatType){
                            case "IMAGE":
                            case "VIDEO":
                            case "DOCUMENT":
                            case "TEXT":
                                return formatType;
                            default:
                                return null;    
                        }
                    })();
                    let text = (format == "TEXT") ? (headerText) : undefined; 
                    return {
                        type: 'HEADER',
                        format : format,
                        text : text
                    };
                })(),
                {
                    type: 'FOOTER',
                    text: (hsm?.footer || '').replace(/\n/,' ') || undefined,
                },
                {
                    type: 'BUTTONS',
                    buttons: (hsm?.options?.buttons || []).concat(templateOptions.buttons).map(function(button){
                        return {
                            type : button.type || "QUICK_REPLY",
                            text : button.label,
                            url :  button.urlWaba || button.url,
                            phone_number : button.phone_number
                        }
                    }),
                },
            ],
        }
    }
}

function createWABATmplSample(template) {
    return {
        channelId : template.channelId,
        code  : template.code,
        lang  : template.lang,
        category : template.category,
        contactType : template.contactType,
        channelType : template.channelType,
        varMap : template.varMap,
        template : {
            name : template.code,
            language : template.lang,
            category : template.category,
            components: [
                {
                    type: 'BODY',
                    text: null,
                    example: {body_text:[[]]}
                },
                {
                    type: 'HEADER',
                    format: null
                },
                {
                    type: 'FOOTER',
                    text: null,
                },
                {
                    type: 'BUTTONS',
                    buttons: [
                    ],
                },
            ],
        }
    }
}

function createWABATmplSimple(template) {
    let templateSimple =  {
        header: {
            type: null,
            text: null,
        },
        body: {
            text: null,
        },
        footer: {
            text: null,
        },
        buttons: {
            type: 'None',
            urlType : 'STATIC',
            buttons: [],
        },
        examples : {
            header_text : null,
            header_handler : null,
            header_preview : "",
            body_text : [],
            body_preview : "",
            button_url : null
        },
        varMap : {
            body : [],
            header  : []
        },
        model : TmplUtils.sampleModel()
    }

    //console.log("template.template.components",template?.template)
    
    if(template && template.template && template.template){
        template.template.components.map(function(cmp){
            if (cmp.type == "HEADER"){
                templateSimple.header = cmp;
            } else if(cmp.type == "BODY"){
                templateSimple.body = cmp;
            } else if(cmp.type == "FOOTER"){
                templateSimple.footer = cmp;
            } else if(cmp.type == "BUTTONS"){
                templateSimple.buttons = cmp;
                //console.log("templateSimple.buttons",templateSimple?.buttons)
                templateSimple.buttons.buttons.map(function(btn){
                    if(btn.type == "URL"){
                        //templateSimple.examples.button_url = 
                    }
                })
            }
        });
        console.log("template.varMap",template.varMap)
        templateSimple.varMap = template.varMap || templateSimple.varMap;
    }
    return templateSimple;
}



function waMarkDown(text) {
    if (text) {
        let format = text;
        format = whatsappStyles(format, "_", "<i>", "</i>");
        format = whatsappStyles(format, "*", "<b>", "</b>");
        format = whatsappStyles(format, "~", "<s>", "</s>");

        if (format !== undefined) {
            format = format.replace(/\n/gi, "<br>");
        }
        return whatsappLinkStyle(format);
    }
    return text;
}

function is_aplhanumeric(c) {
    let x = c.charCodeAt(0);
    return ((x >= 65 && x <= 90) || (x >= 97 && x <= 122) || (x >= 48 && x <= 57));
}

function whatsappStyles(format, wildcard, opTag, clTag) {
    let indices = [];

    if (format !== undefined) {
        for (let i = 0; i < format.length; i++) {
            if (format[i] === wildcard) {
                if (indices.length % 2)
                    (format[i - 1] === " ") ? null : ((typeof (format[i + 1]) == "undefined") ? indices.push(i) : (is_aplhanumeric(format[i + 1]) ? null : indices.push(i)));
                else
                    (typeof (format[i + 1]) == "undefined") ? null : ((format[i + 1] === " ") ? null : (typeof (format[i - 1]) == "undefined") ? indices.push(i) : ((is_aplhanumeric(format[i - 1])) ? null : indices.push(i)));
            } else {
                (format[i].charCodeAt() === 10 && indices.length % 2) ? indices.pop() : null;
            }
        }
    }

    (indices.length % 2) ? indices.pop() : null;

    let e = 0;
    indices.forEach(function (v, i) {
        let t = (i % 2) ? clTag : opTag;
        v += e;
        format = format.substr(0, v) + t + format.substr(v + 1);
        e += (t.length - 1);
    });
    return format;
}

function whatsappLinkStyle(text) {
    let pattern = new RegExp("^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$", "i");

    if (pattern.test(text)) {
        return`<a href="${text}" target="_blank" rel="noreferrer">${text}</a>`;
    }
    return text;
}



export { createWABATmplSample, createWABATmplSimple ,cloneWABATmplSample,toHSM, waMarkDown}
