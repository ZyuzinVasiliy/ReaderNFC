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
            tag     : '',
            tagId   : '',
            message : ''
        }
    },

    async mounted(){
    },

    methods: {

        scanNFC(){
            window.nfc.enabled(
                () => {
                    // NFC enabled
                    this.registerTagEvent()
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

        registerTagEvent () {
            alert('addNdefListener');
            window.nfc.addTagDiscoveredListener(
                () =>{
                    alert('displayNdef');
                },
                () => {
                    alert('succeess registering ndef listener');
                },
                (error) => {
                    alert('failure registering ndef listener');
                }
            );
            window.nfc.addMimeTypeListener("text/bogus",
                () =>{
                    alert('displayNdef');
                },
                () => {
                    alert('succeess registering ndef listener');
                },
                (error) => {
                    alert('failure registering ndef listener');
                }
            );
        },

        displayNdef (nfcEvent) {
            // Decode tag data from the plugin
            this.tag     = nfcEvent.tag
            this.tagId   = window.nfc.bytesToHexString(this.tag.id)
            this.message = window.nfc.bytesToString(this.tag.ndefMessage[0].payload)
        },

        deactivated () {
            alert('removeNdefListener');
            window.nfc.removeNdefListener(() =>{alert('displayNdef')})
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