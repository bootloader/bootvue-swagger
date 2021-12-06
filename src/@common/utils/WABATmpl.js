import formatters from '@/services/formatters';

import TmplUtils from './TmplUtils';
import JsonXPath from './JsonXPath';

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
    let varMap = {};

    
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
                    let text = (format == "TEXT") ? (headerText) : null; 
                    return {
                        type: 'HEADER',
                        format : format,
                        text : text
                    };
                })(),
                {
                    type: 'FOOTER',
                    text: hsm?.footer,
                },
                {
                    type: 'BUTTONS',
                    buttons: (hsm?.options?.buttons || []).concat(templateOptions.buttons).map(function(button){
                        return {
                            type : button.type || "QUICK_REPLY",
                            text : button.label,
                            url : button.url,
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

    if(template && template.template && template.template.components){
        template.template.components.map(function(cmp){
            if (cmp.type == "HEADER"){
                templateSimple.header = cmp;
            } else if(cmp.type == "BODY"){
                templateSimple.body = cmp;
            } else if(cmp.type == "FOOTER"){
                templateSimple.footer = cmp;
            } else if(cmp.type == "BUTTONS"){
                templateSimple.buttons = cmp;
            }
        });
        console.log("template.varMap",template.varMap)
        templateSimple.varMap = template.varMap || templateSimple.varMap;
    }
    return templateSimple;
}

export { createWABATmplSample, createWABATmplSimple ,cloneWABATmplSample,toHSM}
