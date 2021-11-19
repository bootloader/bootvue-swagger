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
    }
}

export { createWABATmplSample, createWABATmplSimple }
