function createWABATmplSample(template) {
    return {
        channelId : template.channelId,
        code  : template.code,
        lang  : template.lang,
        category : template.category,
        contactType : template.contactType,
        channelType : template.channelType,
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

function createWABATmplSimple() {
    return {
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
        exmaples : {
            header_text : null,
            header_handler : null,
            body_text : [],
            button_url : null
        }
    }
}

export { createWABATmplSample, createWABATmplSimple }
