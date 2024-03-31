odoo.define('rec_list.last_five', ["@web/core/network/rpc_service", "@web/session", "@web/views/widgets/widget"], function (require) {
    'use strict'

    const { jsonrpc } = require("@web/core/network/rpc_service")
    const { session } = require("@web/session")
    const {Widget} = require("@web/views/widgets/widget");
    window.onload =function () {
        var element = document.getElementsByClassName("mk_apps_sidebar_logo")
        var ulResponse = document.createElement('ul')
        var ulPinned = document.createElement('ul')
        ulResponse.setAttribute('class', 'unSortList')
        ulPinned.setAttribute('class', 'unPinned')
        console.log(element)
        function ulAdd() {
            if(document.getElementsByClassName("mk_apps_sidebar_logo")[0] === undefined){
                setTimeout(function () {
                console.log('700ms stop');
                ulAdd(); // Рекурсивный вызов для продолжения проверки
            }, 300);
        }else {
                element[0].insertBefore(ulResponse, element[0].firstChild)
                element[0].insertBefore(ulPinned, element[0].firstChild)
            }
        }
        ulAdd()
        function pinLoadPage(){
            jsonrpc('/pinned_recs_get', {
                "jsonrpc": "2.0",
                "params": {
                    "user_id": session.uid
                }
            }).then(result => {
                ulPinned.innerHTML = ''
                result.forEach(function (item){
                    var pinListItem = document.createElement("li");
                    var linkApiFirst = document.createElement("a");
                    var linkApiSecond = document.createElement("a");
                    linkApiFirst.textContent = item.page_path
                    linkApiFirst.href = item.url;
                    linkApiSecond.href = '#'
                    linkApiSecond.textContent = '- '
                    linkApiSecond.onclick = function (){
                        var linkHref = this.nextElementSibling.href
                        jsonrpc('/pinned_recs_del', {
                            "jsonrpc": "2.0",
                            "params": {
                                "url": linkHref,
                            }
                        }).then(() => {
                            pinLoadPage();
                        })
                    }
                    pinListItem.appendChild(linkApiSecond)
                    pinListItem.appendChild(linkApiFirst)
                    ulPinned.appendChild(pinListItem)
                })
            })
        }
        pinLoadPage()
        let stat = []
        function updateList(){

                    jsonrpc('/last_five_visits', {
                        "jsonrpc": "2.0",
                        "params": {
                            "user_id": session.uid,
                        }
                    }).then(result => {
                        if(JSON.stringify(stat) == JSON.stringify(result)){
                            //pass
                        }else{
                            document.getElementsByClassName('unSortList')[0].innerHTML = ''
                            result.forEach(obj => {
                                stat.push(obj)}
                            )
                            result.forEach(function (item){
                            var listItem = document.createElement("li");
                            var linkApiFirst = document.createElement("a");
                            var linkApiSecond = document.createElement("a");
                            listItem.setAttribute('value', item.id)
                            linkApiFirst.textContent = String(item.page_path  + '\n');
                            linkApiFirst.href = item.url
                            linkApiSecond.textContent = '+ '
                            linkApiSecond.href = '#'
                            linkApiSecond.onclick = function (){
                                var linkText = this.nextElementSibling.textContent
                                var linkHref = this.nextElementSibling.href
                                console.log(session.uid)
                                jsonrpc('/pinned_rec_create', {
                                    "jsonrpc": "2.0",
                                    "params": {
                                        "page_path": linkText,
                                        "url": linkHref,
                                        "user_id": session.uid
                                    }
                                }).then(pinLoadPage)
                            }
                            listItem.appendChild(linkApiSecond)
                            listItem.appendChild(linkApiFirst)
                            ulResponse.appendChild(listItem)
                        })
                        }


                    }).catch(function(error) {
                        console.error('Fail: ', error);
                    });
        }
        updateList()

        setInterval(updateList, 500)


    }


})