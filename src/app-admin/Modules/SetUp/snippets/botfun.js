export default {
    getCompletions: function (editor, session, pos, prefix, callback) {
        var completions = [
            {
                caption: 'onMessage',
                snippet: `async function onMessageReceive(){\n\t//YouCodeHere\n} `,
                type: 'snippet',
            },
            {
                caption: 'onSessionStart',
                snippet: `async function onSessionStart(){\n\t//YouCodeHere\n} `,
                type: 'snippet',
            },
            {
                caption: 'onSessionRoute',
                snippet: `async function onSessionRouted(){\n\t//YouCodeHere\n} `,
                type: 'snippet',
            },
            {
                caption: 'makeApiCall',
                snippet: `await $.rest({\n\turl:"https://url.com/"//YouOptionsHere\n}).post()`,
                type: 'snippet',
            },
            {
                caption: 'route',
                snippet: `await $.session.route({\n\tqueue:"my_queue_name",\n\tparams : {\n\t//YouOtherOptionsHere\n\t}\n}) `,
                type: 'snippet',
            },
            {
                caption: 'routeTo',
                snippet: `await $.session.route.to.queue("my_queue_name", {\n\t//YouOtherOptionsHere\n\t}) `,
                type: 'snippet',
            },
            {
                caption: 'assignToAgent',
                snippet: `await $.session.route.to.agent("agent_code") `,
                type: 'snippet',
            },
            {
                caption: 'closeSession',
                snippet: `await $.session.close() `,
                type: 'snippet',
            },
        ];
        let newList = [];
        console.log("pos, prefix",pos, prefix)
        /* You Can get to know how to add more cool 
                  autocomplete features by seeing the ext-language-tools 
                  file in the ace-buils folder */
        completions.forEach((i) => {
            newList.push({
                caption: i.caption,
                snippet: i.snippet,
                type: i.type,
            })
        })
        callback(null, newList)
    },
}
