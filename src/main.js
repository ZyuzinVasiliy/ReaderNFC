import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

/*
var app = {
    initialize: function() {
        //Делаем инициализацию
        this.bindEvents();
        this.setupVue();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {

        setTimeout(
            function () {
                cordova.exec(
                    function () {
                        alert("Initialized the NfcPlugin");
                        console.log("Initialized the NfcPlugin");
                        app.receivedEvent('deviceready');
                    },
                    function (reason) {
                        alert("Failed to initialize the NfcPlugin " + reason);
                        console.log("Failed to initialize the NfcPlugin " + reason);
                    },
                    "NfcPlugin", "init", []
                );
            }, 10
        );

    },
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
        new Vue({
            router,
            store,
            render: function (h) { return h(App) }
        }).$mount('#app')
    },
    setupVue: function() {

    }
}

//Запускаем приложение
app.initialize();
*/

document.addEventListener('deviceready', handleNfc, false);

function handleNfc() {

    if (cordova.platformId === "android" || cordova.platformId === "windows") {
        setTimeout(
            function () {
                cordova.exec(
                    function () {
                        alert("Плагин инициализирован");
                        window.nfc.enabled(
                            () => {
                                alert('Ридер готов, поднесите карту')
                                window.nfc.addTagDiscoveredListener(readTag);
                            },
                            (error) => {
                                if (error === 'NFC_DISABLED') {
                                    // Trigger the phone settings to enable the NFC settings
                                    window.nfc.showSettings()
                                } else if (error === 'NO_NFC') {
                                    alert('Cannot scan NFC', () => {}, 'No NFC', 'OK')
                                }
                            }
                        )
                    },
                    function (reason) {
                        console.log("Failed to initialize the NfcPlugin " + reason);
                        alert("Failed to initialize the NfcPlugin " + reason);
                    },
                    "NfcPlugin", "init", []
                );
            }, 10
        );
    }

}


async function readTag(nfcEvent) {

    let tag   = nfcEvent.tag;
    let tagId = window.nfc.bytesToHexString(tag.id);
    let data  = '';

    try {
        await window.nfc.connect('android.nfc.tech.MifareClassic', 100);
        data = window.nfc.transceive([0x4C]);
    } catch (error) {
        alert(error);
    } finally {
        alert(JSON.stringify(nfcEvent));
        alert('Успешно прочитан тег: ' + tagId);
        alert('Result: ' + util.arrayBufferToHexString(data));
        alert('Closed');
        await window.nfc.close();
    }

}


var textHelper = {

    decodePayload: function (data) {

        var languageCodeLength = (data[0] & 0x3F), // 6 LSBs
            languageCode = data.slice(1, 1 + languageCodeLength),
            utf16 = (data[0] & 0x80) !== 0; // assuming UTF-16BE

        // TODO need to deal with UTF in the future
        if (utf16) {
            alert('WARNING: utf-16 data may not be handled properly for' + languageCode);
        }
        // Use TextDecoder when we have enough browser support
        // new TextDecoder('utf-8').decode(data.slice(languageCodeLength + 1));
        // new TextDecoder('utf-16').decode(data.slice(languageCodeLength + 1));

        return util.bytesToString(data.slice(languageCodeLength + 1));
    },

    // encode text payload
    // @returns an array of bytes
    encodePayload: function(text, lang, encoding) {

        // ISO/IANA language code, but we're not enforcing
        if (!lang) { lang = 'en'; }

        var encoded = util.stringToBytes(lang + text);
        encoded.unshift(lang.length);

        return encoded;
    }

};
