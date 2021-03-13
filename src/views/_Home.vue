<template>
    <div>
        <br>
        <a v-on:click="scanNFC()" class="btn">Включить NFC</a>
        <a v-on:click="deactivated()" class="btn">Отключить NFC</a>
        <br><br>
        <p><b>Данные транспортной карты:</b></p>
        <p>tagId:   {{tagId}}</p>
        <p>message: {{message}}</p>
    </div>
</template>

<script>

export default {
    name: 'Home',
    components: {
    },
    data(){
        return {
            tag: '',
            tagId: '',
            message: ''
        }
    },
    async mounted(){
    },
    methods: {

        scanNFC(){
            window.nfc.enabled(
                () => {
                    // NFC enabled
                    navigator.notification.alert('NFC enabled');
                    this.registerTagEvent()
                },
                (error) => {
                    if (error === 'NFC_DISABLED') {
                        // Trigger the phone settings to enable the NFC settings
                        window.nfc.showSettings()
                    } else if (error === 'NO_NFC') {
                        navigator.notification.alert('Cannot scan NFC', () => {}, 'No NFC', 'OK')
                    }
                }
            )
        },

        registerTagEvent () {
            window.nfc.addNdefListener(
                this.displayNdef,
                () => {
                    navigator.notification.alert('succeess registering ndef listener');
                    console.log('succeess registering ndef listener')
                },
                (error) => {
                    navigator.notification.alert('failure registering ndef listener');
                    console.log('failure registering ndef listener', error)
                }
            )
        },

        displayNdef (nfcEvent) {

            // Decode tag data from the plugin
            this.tag = nfcEvent.tag
            this.tagId = window.nfc.bytesToHexString(this.tag.id)
            this.message = window.nfc.bytesToString(this.tag.ndefMessage[0].payload)

        },

        deactivated () {
            this.unregisterTagEvent()
        },

        unregisterTagEvent () {
            // Test if the plugin is defined
            if ((typeof nfc) !== 'undefined') {
                navigator.notification.alert('NFC disabled');
                window.nfc.removeNdefListener(this.displayNdef)
            }
        },
    }
}

</script>

<style>
    a{
        display: block;
        margin: 20px auto;
        width: 170px;
        padding-top: 10px;
        padding-bottom: 10px;
        text-align: center;
        border: 1px solid  #000;
        cursor: pointer;
    }
</style>