<template>
  <div id="app">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Automate Data Sharing</h1>
          <h2 class="subtitle">
            Turn on an application to allow new leads across all users of your company to flow
            automatically into Marketing REsource.
          </h2>
          <h2 class="subtitle">
            Turning off an application will stop new leads from flowing into Marketing REsource.
          </h2>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <b-dropdown v-model="selectedOffice">
          <button class="button is-primary" slot="trigger">
            <span>Company: {{selectedOffice}}</span>
            <b-icon icon="caret-down"></b-icon>
          </button>
          <b-dropdown-item v-for="office in offices" :value="office">{{office}}</b-dropdown-item>
        </b-dropdown>
      </div>
    </section>
    <section id="app_list" class="section">
      <div class="container">
        <div class="media">
          <div class="media-left">
            <div class="image is-64x64">
              <img src="./assets/red-logo.jpg" alt=""/>
            </div>
          </div>
          <div class="media-content">
            <div class="content">
              <h5 class="card-header-title">rDesk® CRM</h5>
            </div>
          </div>
          <div class="media-right">
            <b-switch id="real-estate-digital"
                      v-model="acl[selectedOffice]['real-estate-digital']"
                      @input="handleAuth('real-estate-digital', $event)"/>
          </div>
        </div>
        <div class="media">
          <div class="media-left">
            <div class="image is-64x64">
              <img src="./assets/smarter-agent-icon.png" alt=""/>
            </div>
          </div>
          <div class="media-content">
            <div class="content">
              <h5 class="card-header-title">Smarter Agent Mobile</h5>
            </div>
          </div>
          <div class="media-right">
            <b-switch id="smarter-agent"
                      v-model="acl[selectedOffice]['smarter-agent']"
                      @input="handleAuth('smarter-agent', $event)"/>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name:     'app',
    data() {
      let {apiKey, userId, offices, acl} = window.__reflexData;
      return {
        userId:         userId,
        apiKey:         apiKey,
        offices:        offices,
        acl:            acl,
        selectedOffice: offices[0]
      }
    },
    computed: {
      inboxURL: function() {
        return `https://${this.selectedOffice.toLowerCase()}.ds.bhhsresource.com/inbox/`
      }
    },
    methods:  {
      sendMessage: function sendAction(action) {
        return fetch(this.inboxURL, {
          method:  'POST',
          body:    JSON.stringify(action),
          headers: {
            'x-api-key':    this.apiKey,
            'Content-Type': 'application/ld+json',
          }
        });
      },
      handleAuth:  function(recipient, authorized) {
        let action = {
          type:         authorized ? 'AuthorizeAction' : 'RevokeAction',
          actionStatus: 'PotentialActionStatus',
          agent:        `https://${this.userId}.ds.bhhsresource.com/profile/card#me`,
          object:       this.inboxURL,
          recipient:    `https://yodata.io/app/${recipient}`
        };
        return this.sendMessage(action);
      }
    }
  }


</script>

<style lang="sass">
  // Import Bulma's core
  @import "~bulma/sass/utilities/_all";

  // Set your colors
  $primary: #552448;
  $primary-invert: findColorInvert($primary);

  // Setup $colors to use as bulma classes (e.g. 'is-twitter')
  $colors: ( "white": ($white, $black), "black": ($black, $white), "light": ($light, $light-invert), "dark": ($dark, $dark-invert), "primary": ($primary, $primary-invert), "info": ($info, $info-invert), "success": ($success, $success-invert), "warning": ($warning, $warning-invert), "danger": ($danger, $danger-invert) );

  // Links
  $link: $primary;
  $link-invert: $primary-invert;
  $link-focus-border: $primary;

  // Import Bulma and Buefy styles
  @import "~bulma";
  @import "~buefy/src/scss/buefy";
</style>
