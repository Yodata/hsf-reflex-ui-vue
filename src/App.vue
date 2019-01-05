<template>
  <div id="content">
    <section id="hero" class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Automate Data Sharing</h1>
          <h2
            class="subtitle"
          >Turning on an application below will allow your data to flow to that application.</h2>
          <h2
            class="subtitle"
          >Note: All new leads and contacts will flow automatically into Marketing Resource.</h2>
        </div>
      </div>
    </section>
    <section id="office_selector" class="section">
      <div class="container">
        <b-dropdown v-model="selectedOffice">
          <button class="button is-primary" slot="trigger">
            <span>Company: {{selectedOffice}}</span>
            <b-icon icon="caret-down"></b-icon>
          </button>
          <b-dropdown-item :key="office" v-for="office in offices" :value="office">{{office}}</b-dropdown-item>
        </b-dropdown>
      </div>
    </section>
    <b-collapse :open="currentUserIsFranchiseAdmin">
      <section class="section">
        <div class="container">
          <div class="notification box" style="background-color: rgb(231, 231, 231);">
            <h1 class="heading title">Franchise Settings:</h1>
            <b-switch
              v-model="franchise.agentControl"
              @input="handleAuth(application.identifier, $event)"
            >{{franchise.agentControl ? 'Franchise agents manage their own vendor data access.': 'All franchise agents share the data access settings configured here.'}}</b-switch>
          </div>
        </div>
      </section>
    </b-collapse>
    <section id="app_list" class="section">
      <div class="container">
        <div class="tile is-ancestor" style="flex-wrap: wrap;">
          <div
            class="tile is-parent is-6"
            v-for="application in applications"
            :key="application.identifier"
          >
            <div class="tile is-child card">
              <div class="card-header">
                <figure class="card-header-icon is-64x64">
                  <img :src="application.logo" height="64" width="64">
                </figure>
                <div class="card-header-title">{{application.name}}</div>
                <b-switch
                  :id="application.identifier"
                  v-model="applications[application.identifier].isActive"
                  @input="handleAuth(application.identifier, $event)"
                />
              </div>
              <div class="card-content">
                <p>{{application.description}}</p>
              </div>
              <b-collapse :open="applications[application.identifier].isActive">
                <div class="card-content">
                  <h4 class="heading" style="margin-bottom: 2em;">Has access to:</h4>
                  <div v-for="permission in application.permissions" :key="permission.name">
                    <b-checkbox
                      v-model="applications[application.identifier].permissions[permission.name].enabled"
                    >{{permission.description}}</b-checkbox>
                  </div>
                  <p class="is-size-7" style="margin-top: 1em;">
                    The application provider requests access to this data.
                    You may restrict access for this provider by unchecking specific items from the list.
                    Note: changing these values may alter the integration features for this provider, please contact your provider for details.
                  </p>
                </div>
              </b-collapse>
            </div>
          </div>
        </div>
      </div>
    </section>
    <footer class="footer">
      <div class="container">
        <a href="#" class="link">Privacy Policy</a>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    let { apiKey, userId, offices, acl } = window.__reflexData;
    let applications = this.getApplications();
    return {
      userId: userId,
      apiKey: apiKey,
      offices: offices,
      acl: acl,
      selectedOffice: offices[1],
      applications,
      franchise: {
        agentControl: true
      }
    };
  },
  computed: {
    inboxURL: function() {
      return `https://${this.selectedOffice.toLowerCase()}.ds.bhhsresource.com/inbox/`;
    },
    currentUserIsFranchiseAdmin() {
      return this.selectedOffice === "FranchiseAdminExample";
    }
  },
  methods: {
    getApplications() {
      return {
        "real-estate-digital": {
          id: "https://dev.yodata.io/profile/rdesk",
          identifier: "real-estate-digital",
          type: "SoftwareApplication",
          name: "RDesk Real Estate CRM",
          description: `
            ## Stop talking, brain thinking. Hush.
            All I've got to do is pass as an ordinary human being. Simple. What could possibly go wrong? I hate yogurt. It's just stuff with bits in. You hit me with a cricket bat. It's a fez. I wear a fez now. Fezes are cool.
            1. The way I see it, every life is a pile of good things and bad things.…hey.…the good things don't always soften the bad things; but vice-versa the bad things don't necessarily spoil the good things and make them unimportant.
            2. Did I mention we have comfy chairs?
            3. I am the Doctor, and you are the Daleks!
            `,
          logo:
            "http://realestatedigital.com/wp-content/uploads/2018/04/red-logo-sml.jpg",
          creator: {
            name: "Real Estate Digital",
            url: "https://realestatedigital.com/"
          },
          isActive: false,
          permissions: {
            RosterDataReadOnly: {
              name: "RosterDataReadOnly",
              description: "Read only access to office and agent events",
              enabled: true
            },
            ContactsFullAccess: {
              name: "ContactsFullAccess",
              description: "See, edit, share and delete contacts",
              enabled: true
            }
          }
        },
        buyside: {
          id: "https://dev.yodata.io/profile/buyside",
          identifier: "buyside",
          type: "SoftwareApplication",
          name: "Buyside",
          creator: {
            name: "Buyside",
            url: "https://getbuyside.com/"
          },
          description:
            "The top brokerage firms in the country use Buyside to transform their data into actionable insights and intelligent marketing tools that win new business.",
          logo:
            "https://pbs.twimg.com/profile_images/933363551065989120/ulvaUEl8_400x400.jpg",
          isActive: false,
          permissions: {
            ListingsReadOnly: {
              name: "ListingsReadOnly",
              description: "See and share your listings",
              enabled: true
            },
            WebsiteEvents: {
              name: "WebsiteEvents",
              description:
                "See, share, edit and delete leads from your website",
              enabled: true
            }
          }
        },
        yodata: {
          id: "https://dev.yodata.io/profile/yodata",
          identifier: "yodata",
          type: "SoftwareApplication",
          name: "Moxiworks",
          creator: {
            name: "Moxiworks",
            url: "https://moxiworks.com/"
          },
          description: `But I know you in the future. I cleaned your poop.
            Meh. You mean while I'm sleeping in it? I am the man with no name, Zapp Brannigan! Switzerland is small and neutral! We are more like Germany, ambitious and misunderstood! Shinier than yours, meatbag.
            `,
          logo:
            "https://media.glassdoor.com/sql/1013582/moxi-works-squarelogo-1472481081078.png",
          isActive: false,
          permissions: {
            ListingsReadOnly: {
              name: "ListingsReadOnly",
              description: "See and share your listings",
              enabled: true
            },
            WebsiteEvents: {
              name: "WebsiteEvents",
              description:
                "See, share, edit and delete leads from your website",
              enabled: true
            }
          }
        },
        "example-app": {
          id: "https://dev.yodata.io/profile/example",
          identifier: "example-app",
          type: "SoftwareApplication",
          name: "Example.com",
          creator: {
            name: "Example.com",
            url: "https://example.com/"
          },
          description: `Hello, Dexter Morgan.
          I feel like a jigsaw puzzle missing a piece. And I'm not even sure what the picture should be. Tonight's the night. And it's going to happen again and again. It has to happen. I think he's got a crush on you, Dex!
          God created pudding, and then he rested.
          Under normal circumstances, I'd take that as a compliment.
          I am not a killer.
          `,
          logo:
            "http://additionplus.com/wp-content/uploads/2018/02/example-logo-2.png",
          isActive: true,
          permissions: {
            ListingsReadOnly: {
              name: "ListingsReadOnly",
              description: "See and share your listings",
              enabled: true
            },
            WebsiteEvents: {
              name: "WebsiteEvents",
              description:
                "See, share, edit and delete leads from your website",
              enabled: true
            }
          }
        }
      };
    },
    sendMessage: function sendAction(action) {
      return fetch(this.inboxURL, {
        method: "POST",
        body: JSON.stringify(action),
        headers: {
          "x-api-key": this.apiKey,
          "Content-Type": "application/ld+json"
        }
      });
    },
    handleAuth: function(recipient, authorized) {
      let action = {
        type: authorized ? "AuthorizeAction" : "RevokeAction",
        actionStatus: "PotentialActionStatus",
        agent: `https://${this.userId}.ds.bhhsresource.com/profile/card#me`,
        object: this.inboxURL,
        recipient: `https://yodata.io/app/${recipient}`
      };
      return this.sendMessage(action);
    }
  }
};
</script>

<style lang='sass'>
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

<style lang='css'>
.section {
  padding: 1em 0;
}
</style>
