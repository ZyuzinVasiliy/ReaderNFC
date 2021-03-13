import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

const DESFIRE_SELECT_PICC = '00 A4 04 00 07 D2 76 00 00 85 01 00';  // 198282724446373308988195072
const DESFIRE_SELECT_AID = '90 5A 00 00 03 AA AA AA 00'; // 2662816330093337160192


async function handleDesfire(nfcEvent) {

    const tagId = nfc.bytesToHexString(nfcEvent.tag.id);
    alert('Processing', tagId);

    try {
        await nfc.connect('android.nfc.tech.IsoDep', 500);
        alert('connected to', tagId);

        let response = await nfc.transceive(DESFIRE_SELECT_PICC);
        ensureResponseIs('9000', response);

        response = await nfc.transceive(DESFIRE_SELECT_AID);
        ensureResponseIs('9100', response);

        alert('Selected application AA AA AA');

    } catch (error) {
        alert(error);
    } finally {
        await nfc.close();
        alert('closed');
    }

}


function ensureResponseIs(expectedResponse, buffer) {
    const responseString = util.arrayBufferToHexString(buffer);
    if (expectedResponse !== responseString) {
        const error = 'Expecting ' + expectedResponse + ' but received ' + responseString;
        throw error;
    }
}


function onDeviceReady() {
    nfc.addTagDiscoveredListener(handleDesfire);
}


document.addEventListener('deviceready', onDeviceReady, false);