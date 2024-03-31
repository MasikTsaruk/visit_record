odoo.define('rec_list.url_tracker',["@web/core/network/rpc_service", "@web/session"],function (require) {
    'use strict'
    const { jsonrpc } = require("@web/core/network/rpc_service")
    const { session } = require("@web/session")
    var currentUrl = window.location.href;

    function shouldExcludeTitle(title) {
        const excludedTitles = [
            'Odoo - Test Record',
            'Odoo - Website Preview'
        ];

        return excludedTitles.includes(title);
    }
    function checkUrlChange() {
        var newUrl = window.location.href;
        if (newUrl !== currentUrl && !shouldExcludeTitle(document.title)) {
            console.log('URL изменился:', newUrl);
            jsonrpc('/create/visit_record', {
                "jsonrpc": "2.0",
                "method": "call",
                "params": {
                    "user_id": session.uid,
                    "visit_datetime": new Date().toISOString().replace('T', ' ').split('.')[0],
                    "page_path": document.title,
                    "url": newUrl
                },
                "id": session.uid
            }).then(function(result) {
                console.log(result);
            }).catch(function(error) {
                console.error('Failed to create visit record:', error);
            });
            currentUrl = newUrl;
        }
    }

    setInterval(checkUrlChange, 300);



});
