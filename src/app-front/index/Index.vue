<template>
  <div>
    <index-navbar
      position="fixed"
      bgColor="white"
      shadow
     />
    <section
      class="header relative pt-16 items-center flex h-screen max-h-860-px"
    >
      <div class="container mx-auto items-center flex flex-wrap">
        <div class="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
          <div class="pt-32 sm:pt-0">
            <h2 class="font-semibold text-4xl text-blueGray-600">
              A Simple And Smart Tool That Will Help Grow Your Business
            </h2>
            <p class="mt-4 text-lg leading-relaxed text-blueGray-500">
              {{ $config.PROP_SERVICE_NAME }}'s social media messaging engine
              provides an all new way of keeping up to your customer acquisition
              and customer commitments. Powered by intelligent virtual
              assistants, enterprise data and Machine Learning, enhance your
              customer delight and Digital ROI's.
            </p>
            <div class="mt-12">
              <a
                href="/partner/auth/register"
                class="
                  get-started
                  text-white
                  font-bold
                  px-6
                  py-4
                  rounded
                  outline-none
                  focus:outline-none
                  mr-1
                  mb-1
                  bg-emerald-500
                  active:bg-emerald-600
                  uppercase
                  text-sm
                  shadow
                  hover:shadow-lg
                  ease-linear
                  transition-all
                  duration-150
                "
              >
                Get started
              </a>
              <router-link
                tag="a"
                to="/landing"
                class="
                  github-star
                  ml-1
                  text-white
                  font-bold
                  px-6
                  py-4
                  rounded
                  outline-none
                  focus:outline-none
                  mr-1
                  mb-1
                  bg-blueGray-700
                  active:bg-blueGray-600
                  uppercase
                  text-sm
                  shadow
                  hover:shadow-lg
                  ease-linear
                  transition-all
                  duration-150
                "
              >
                Read more
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <img
        class="
          absolute
          top-0
          b-auto
          right-0
          pt-16
          sm:w-6/12
          -mt-48
          sm:mt-0
          w-10/12
          max-h-860-px
        "
        :src="patternVue"
        alt="..."
      />
    </section>

    <section class="mt-48 md:mt-40 pb-40 relative bg-blueGray-100">
      <div
        class="-mt-20 top-0 bottom-auto left-0 right-0 w-full absolute h-20"
        style="transform: translateZ(0)"
      >
        <svg
          class="absolute bottom-0 overflow-hidden"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          version="1.1"
          viewBox="0 0 2560 100"
          x="0"
          y="0"
        >
          <polygon
            class="text-blueGray-100 fill-current"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>
      <div class="container mx-auto">
        <div class="flex flex-wrap items-center">
          <div
            class="
              w-10/12
              md:w-6/12
              lg:w-4/12
              px-12
              md:px-4
              mr-auto
              ml-auto
              -mt-32
            "
          >
            <div
              class="
                relative
                flex flex-col
                min-w-0
                break-words
                bg-white
                w-full
                mb-6
                shadow-lg
                rounded-lg
                bg-emerald-500
              "
            >
              <img
                alt="..."
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80"
                class="w-full align-middle rounded-t-lg"
              />
              <blockquote class="relative p-8 mb-4">
                <svg
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 583 95"
                  class="absolute left-0 w-full block h-95-px -top-94-px"
                >
                  <polygon
                    points="-30,95 583,95 583,65"
                    class="text-emerald-500 fill-current"
                  ></polygon>
                </svg>
                <h4 class="text-xl font-bold text-white">
                  All The Tools You Need In One Workspace
                </h4>
                <p class="text-md font-light mt-2 text-white">
                  Yes, you've come to the right place if you're looking out to
                  drive higher customer conversation ratios and handling your
                  enquiries and business flexibly. There's more we got to offer
                  you
                </p>
              </blockquote>
            </div>
          </div>

          <div class="w-full md:w-6/12 px-4">
            <div class="flex flex-wrap">
              <div class="w-full md:w-6/12 px-4">
                <div class="relative flex flex-col mt-4">
                  <div class="px-4 py-5 flex-auto">
                    <div
                      class="
                        text-blueGray-500
                        p-3
                        text-center
                        inline-flex
                        items-center
                        justify-center
                        w-12
                        h-12
                        mb-5
                        shadow-lg
                        rounded-full
                        bg-white
                      "
                    >
                      <i class="fas fa-sitemap"></i>
                    </div>
                    <h6 class="text-xl mb-1 font-semibold">Messaging API's</h6>
                    <p class="mb-4 text-blueGray-500">
                      {{ $config.PROP_SERVICE_NAME }}’s integrated messaging
                      API, connects you to multiple social media messaging
                      platforms.
                    </p>
                  </div>
                </div>
                <div class="relative flex flex-col min-w-0">
                  <div class="px-4 py-5 flex-auto">
                    <div
                      class="
                        text-blueGray-500
                        p-3
                        text-center
                        inline-flex
                        items-center
                        justify-center
                        w-12
                        h-12
                        mb-5
                        shadow-lg
                        rounded-full
                        bg-white
                      "
                    >
                      <i class="fas fa-drafting-compass"></i>
                    </div>
                    <h6 class="text-xl mb-1 font-semibold">
                      Smart Conversations
                    </h6>
                    <p class="mb-4 text-blueGray-500">
                      {{ $config.PROP_SERVICE_NAME }}’s Messaging Channel,
                      Enterprise integrated BOT and Agent Communicator
                    </p>
                  </div>
                </div>
              </div>
              <div class="w-full md:w-6/12 px-4">
                <div class="relative flex flex-col min-w-0 mt-4">
                  <div class="px-4 py-5 flex-auto">
                    <div
                      class="
                        text-blueGray-500
                        p-3
                        text-center
                        inline-flex
                        items-center
                        justify-center
                        w-12
                        h-12
                        mb-5
                        shadow-lg
                        rounded-full
                        bg-white
                      "
                    >
                      <i class="fas fa-newspaper"></i>
                    </div>
                    <h6 class="text-xl mb-1 font-semibold">
                      Intelligent Conversations
                    </h6>
                    <p class="mb-4 text-blueGray-500">
                      {{ $config.PROP_SERVICE_NAME }}’s Smart Conversations
                      powered by Machine Learning
                    </p>
                  </div>
                </div>
                <div class="relative flex flex-col min-w-0">
                  <div class="px-4 py-5 flex-auto">
                    <div
                      class="
                        text-blueGray-500
                        p-3
                        text-center
                        inline-flex
                        items-center
                        justify-center
                        w-12
                        h-12
                        mb-5
                        shadow-lg
                        rounded-full
                        bg-white
                      "
                    >
                      <i class="fas fa-file-alt"></i>
                    </div>
                    <h6 class="text-xl mb-1 font-semibold">Documentation</h6>
                    <p class="mb-4 text-blueGray-500">
                      You will love how easy is to to work with
                      {{ $config.PROP_SERVICE_NAME }}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto overflow-hidden pb-20">
        <div class="flex flex-wrap items-center">
          <div class="w-full md:w-4/12 px-12 md:px-4 ml-auto mr-auto mt-48">
            <div
              class="
                text-blueGray-500
                p-3
                text-center
                inline-flex
                items-center
                justify-center
                w-16
                h-16
                mb-6
                shadow-lg
                rounded-full
                bg-white
              "
            >
              <i class="fas fa-sitemap text-xl"></i>
            </div>
            <h3 class="text-3xl mb-2 font-semibold leading-normal">
              Smart Conversations
            </h3>
            <p
              class="
                text-lg
                font-light
                leading-relaxed
                mt-4
                mb-4
                text-blueGray-600
              "
            >
              {{ $config.PROP_SERVICE_NAME }}’s Messaging Channel, Enterprise
              integrated BOT and Agent Communicator driven responses give your
              organization an incredible edge – in getting intelligent and
              educated data to customers via a BOT or by means of an Agent
              driving customer satisfaction and enhancing Customer Acquisition
              and Customer Engagement team’s productivity.
            </p>
            <div class="block pb-6">
              <span
                class="
                  text-xs
                  font-semibold
                  inline-block
                  py-1
                  px-2
                  uppercase
                  rounded-full
                  text-blueGray-500
                  bg-white
                  uppercase
                  last:mr-0
                  mr-2
                  mt-2
                "
              >
                Buttons
              </span>
              <span
                class="
                  text-xs
                  font-semibold
                  inline-block
                  py-1
                  px-2
                  uppercase
                  rounded-full
                  text-blueGray-500
                  bg-white
                  uppercase
                  last:mr-0
                  mr-2
                  mt-2
                "
              >
                Menu
              </span>
              <span
                class="
                  text-xs
                  font-semibold
                  inline-block
                  py-1
                  px-2
                  uppercase
                  rounded-full
                  text-blueGray-500
                  bg-white
                  uppercase
                  last:mr-0
                  mr-2
                  mt-2
                "
              >
                Customer Labels
              </span>
              <span
                class="
                  text-xs
                  font-semibold
                  inline-block
                  py-1
                  px-2
                  uppercase
                  rounded-full
                  text-blueGray-500
                  bg-white
                  uppercase
                  last:mr-0
                  mr-2
                  mt-2
                "
              >
                Chat Tags
              </span>
              <span
                class="
                  text-xs
                  font-semibold
                  inline-block
                  py-1
                  px-2
                  uppercase
                  rounded-full
                  text-blueGray-500
                  bg-white
                  uppercase
                  last:mr-0
                  mr-2
                  mt-2
                "
              >
                Sticky Notes
              </span>
              <span
                class="
                  text-xs
                  font-semibold
                  inline-block
                  py-1
                  px-2
                  uppercase
                  rounded-full
                  text-blueGray-500
                  bg-white
                  uppercase
                  last:mr-0
                  mr-2
                  mt-2
                "
              >
                Quick Replies
              </span>
              <span
                class="
                  text-xs
                  font-semibold
                  inline-block
                  py-1
                  px-2
                  uppercase
                  rounded-full
                  text-blueGray-500
                  bg-white
                  uppercase
                  last:mr-0
                  mr-2
                  mt-2
                "
              >
                Quick Media
              </span>
              <span
                class="
                  text-xs
                  font-semibold
                  inline-block
                  py-1
                  px-2
                  uppercase
                  rounded-full
                  text-blueGray-500
                  bg-white
                  uppercase
                  last:mr-0
                  mr-2
                  mt-2
                "
              >
                Quick Actions
              </span>
            </div>
            <a
              hidden
              href="https://www.creative-tim.com/learning-lab/tailwind/vue/alerts/notus?ref=vn-index"
              target="_blank"
              class="
                font-bold
                text-blueGray-700
                hover:text-blueGray-500
                ease-linear
                transition-all
                duration-150
              "
            >
              View All
              <i class="fa fa-angle-double-right ml-1 leading-relaxed"></i>
            </a>
          </div>

          <div class="w-full md:w-5/12 px-4 mr-auto ml-auto mt-32">
            <div
              class="relative flex flex-col min-w-0 w-full mb-6 mt-48 md:mt-0"
            >
              <img
                alt="..."
                :src="componentBtn"
                class="
                  w-full
                  align-middle
                  rounded
                  absolute
                  shadow-lg
                  max-w-100-px
                  left-145-px
                  -top-29-px
                  z-3
                "
              />
              <img
                alt="..."
                :src="componentProfileCard"
                class="
                  w-full
                  align-middle
                  rounded-lg
                  absolute
                  shadow-lg
                  max-w-210-px
                  left-260-px
                  -top-160-px
                "
              />
              <img
                alt="..."
                :src="componentInfoCard"
                class="
                  w-full
                  align-middle
                  rounded-lg
                  absolute
                  shadow-lg
                  max-w-180-px
                  left-40-px
                  -top-225-px
                  z-2
                "
              />
              <img
                alt="..."
                :src="componentInfo2"
                class="
                  w-full
                  align-middle
                  rounded-lg
                  absolute
                  shadow-2xl
                  max-w-200-px
                  -left-50-px
                  top-25-px
                "
              />
              <img
                alt="..."
                :src="componentMenu"
                class="
                  w-full
                  align-middle
                  rounded
                  absolute
                  shadow-lg
                  max-w-580-px
                  -left-20-px
                  top-210-px
                "
              />
              <img
                alt="..."
                :src="componentBtnPink"
                class="
                  w-full
                  align-middle
                  rounded
                  absolute
                  shadow-xl
                  max-w-120-px
                  left-195-px
                  top-95-px
                "
              />
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center pt-32">
          <div class="w-full md:w-6/12 px-4 mr-auto ml-auto mt-32">
            <div class="justify-center flex flex-wrap relative">
              <div class="my-4 w-full lg:w-6/12 px-4">
                <a
                  href="https://www.creative-tim.com/learning-lab/tailwind/svelte/alerts/notus?ref=vn-index"
                  target="_blank"
                >
                  <div class="bg-red-600 shadow-lg rounded-lg text-center p-8">
                    <span
                      alt="..."
                      class="
                        shadow-md
                        rounded-full
                        max-w-full
                        w-16
                        mx-auto
                        p-2
                        bg-white
                        fab
                        fa-chrome
                        h-16
                        text-red-500 text-5xl
                      "
                      src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/svelte.jpg"
                    />
                    <p class="text-lg text-white mt-4 font-semibold">Web</p>
                  </div>
                </a>
                <a
                  href="https://www.creative-tim.com/learning-lab/tailwind/react/alerts/notus?ref=vn-index"
                  target="_blank"
                >
                  <div
                    class="
                      bg-lightBlue-500
                      shadow-lg
                      rounded-lg
                      text-center
                      p-8
                      mt-8
                    "
                  >
                    <span
                      alt="..."
                      class="
                        shadow-md
                        rounded-full
                        max-w-full
                        w-16
                        mx-auto
                        p-2
                        bg-white
                        fab
                        fa-twitter
                        h-16
                        text-lightBlue-400 text-5xl
                      "
                      src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/react.jpg"
                    />
                    <p class="text-lg text-white mt-4 font-semibold">twitter</p>
                  </div>
                </a>
                <a
                  href="https://www.creative-tim.com/learning-lab/tailwind/nextjs/alerts/notus?ref=vn-index"
                  target="_blank"
                >
                  <div
                    class="
                      bg-blueGray-700
                      shadow-lg
                      rounded-lg
                      text-center
                      p-8
                      mt-8
                    "
                  >
                    <span
                      alt="..."
                      class="
                        shadow-md
                        rounded-full
                        max-w-full
                        w-16
                        mx-auto
                        p-2
                        bg-white
                        fab
                        fa-telegram-plane
                        h-16
                        text-lightBlue-400 text-5xl
                      "
                      src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/nextjs.jpg"
                    />
                    <p class="text-lg text-white mt-4 font-semibold">
                      telegram
                    </p>
                  </div>
                </a>
              </div>
              <div class="my-4 w-full lg:w-6/12 px-4 lg:mt-16">
                <a
                  href="https://www.creative-tim.com/learning-lab/tailwind/js/alerts/notus?ref=vn-index"
                  target="_blank"
                >
                  <div
                    class="bg-yellow-500 shadow-lg rounded-lg text-center p-8"
                  >
                    <span
                      alt="..."
                      class="
                        shadow-md
                        rounded-full
                        max-w-full
                        w-16
                        mx-auto
                        p-2
                        bg-white
                        fab
                        fa-facebook-f
                        h-16
                        text-facebook text-5xl
                      "
                      src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/js.png"
                    />
                    <p class="text-lg text-white mt-4 font-semibold">
                      facebook
                    </p>
                  </div>
                </a>
                <a
                  href="https://www.creative-tim.com/learning-lab/tailwind/angular/alerts/notus?ref=vn-index"
                  target="_blank"
                >
                  <div
                    class="
                      bg-instagram-r
                      shadow-lg
                      rounded-lg
                      text-center
                      p-8
                      mt-8
                    "
                  >
                    <span
                      alt="..."
                      class="
                        shadow-md
                        rounded-full
                        max-w-full
                        w-16
                        mx-auto
                        p-2
                        bg-white
                        fab
                        fa-instagram
                        h-16
                        text-instagram text-5xl
                      "
                      src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/angular.jpg"
                    />
                    <p class="text-lg text-white mt-4 font-semibold">
                      Instagram
                    </p>
                  </div>
                </a>
                <a
                  href="https://www.creative-tim.com/learning-lab/tailwind/vue/alerts/notus?ref=vn-index"
                  target="_blank"
                >
                  <div
                    class="
                      bg-emerald-500
                      shadow-lg
                      rounded-lg
                      text-center
                      p-8
                      mt-8
                    "
                  >
                    <span
                      alt="..."
                      class="
                        shadow-md
                        rounded-full
                        max-w-full
                        w-16
                        h-16
                        mx-auto
                        p-2
                        bg-white
                        fab
                        fa-whatsapp
                        text-emerald-500 text-5xl
                      "
                      src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/vue.jpg"
                    />
                    <p class="text-lg text-white mt-4 font-semibold">
                      WhatsApp
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div class="w-full md:w-4/12 px-12 md:px-4 ml-auto mr-auto mt-48">
            <div
              class="
                text-blueGray-500
                p-3
                text-center
                inline-flex
                items-center
                justify-center
                w-16
                h-16
                mb-6
                shadow-lg
                rounded-full
                bg-white
              "
            >
              <i class="fas fa-drafting-compass text-xl"></i>
            </div>
            <h3 class="text-3xl mb-2 font-semibold leading-normal">
              Multi-Channel Platform
            </h3>
            <p
              class="
                text-lg
                font-light
                leading-relaxed
                mt-4
                mb-4
                text-blueGray-600
              "
            >
              {{ $config.PROP_SERVICE_NAME }}’s integrated messaging API,
              associates you to multiple social media messaging platforms, which
              eliminates the requirement for your organization to stay up to
              date with the latest progressions happening in the social media
              platform API's.
            </p>

            <p
              class="
                text-lg
                font-light
                leading-relaxed
                mt-4
                mb-4
                text-blueGray-600
              "
            >
              We provide out of the box solution for you to connect with
              WhatsApp, Telegram, Facebook Messenger, Twitter DM and a native
              Web Chat.
            </p>
            <p
              class="
                text-lg
                font-light
                leading-relaxed
                mt-4
                mb-4
                text-blueGray-600
              "
            >
              You need to connect only once, to the
              {{ $config.PROP_SERVICE_NAME }} API and leave the rest to us.
            </p>
            <div class="block pb-6">
              <span
                class="
                  text-xs
                  font-semibold
                  inline-block
                  py-1
                  px-2
                  uppercase
                  rounded-full
                  text-blueGray-500
                  bg-white
                  uppercase
                  last:mr-0
                  mr-2
                  mt-2
                "
              >
                twitter DM
              </span>
              <span
                class="
                  text-xs
                  font-semibold
                  inline-block
                  py-1
                  px-2
                  uppercase
                  rounded-full
                  text-blueGray-500
                  bg-white
                  uppercase
                  last:mr-0
                  mr-2
                  mt-2
                "
              >
                facebook page
              </span>
              <span
                class="
                  text-xs
                  font-semibold
                  inline-block
                  py-1
                  px-2
                  uppercase
                  rounded-full
                  text-blueGray-500
                  bg-white
                  uppercase
                  last:mr-0
                  mr-2
                  mt-2
                "
              >
                telegram bot
              </span>
              <span
                class="
                  text-xs
                  font-semibold
                  inline-block
                  py-1
                  px-2
                  uppercase
                  rounded-full
                  text-blueGray-500
                  bg-white
                  uppercase
                  last:mr-0
                  mr-2
                  mt-2
                "
              >
                instagram dm
              </span>
              <span
                class="
                  text-xs
                  font-semibold
                  inline-block
                  py-1
                  px-2
                  uppercase
                  rounded-full
                  text-blueGray-500
                  bg-white
                  uppercase
                  last:mr-0
                  mr-2
                  mt-2
                "
              >
                webchat plugin
              </span>
              <span
                class="
                  text-xs
                  font-semibold
                  inline-block
                  py-1
                  px-2
                  uppercase
                  rounded-full
                  text-blueGray-500
                  bg-white
                  uppercase
                  last:mr-0
                  mr-2
                  mt-2
                "
              >
                whastapp business
              </span>
              <span
                class="
                  text-xs
                  font-semibold
                  inline-block
                  py-1
                  px-2
                  uppercase
                  rounded-full
                  text-blueGray-500
                  bg-white
                  uppercase
                  last:mr-0
                  mr-2
                  mt-2
                "
              >
                bulk push
              </span>
              <span
                class="
                  text-xs
                  font-semibold
                  inline-block
                  py-1
                  px-2
                  uppercase
                  rounded-full
                  text-blueGray-500
                  bg-white
                  uppercase
                  last:mr-0
                  mr-2
                  mt-2
                "
              >
                Tooltips
              </span>
            </div>
            <a
              hidden
              href="https://www.creative-tim.com/learning-lab/tailwind/vue/alerts/notus?ref=vn-index"
              target="_blank"
              class="
                font-bold
                text-blueGray-700
                hover:text-blueGray-500
                ease-linear
                transition-all
                duration-150
              "
            >
              View all
              <i class="fa fa-angle-double-right ml-1 leading-relaxed"></i>
            </a>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 pb-32 pt-48">
        <div class="items-center flex flex-wrap">
          <div class="w-full md:w-5/12 ml-auto px-12 md:px-4">
            <div class="md:pr-12">
              <div
                class="
                  text-blueGray-500
                  p-3
                  text-center
                  inline-flex
                  items-center
                  justify-center
                  w-16
                  h-16
                  mb-6
                  shadow-lg
                  rounded-full
                  bg-white
                "
              >
                <i class="fas fa-file-alt text-xl"></i>
              </div>
              <h3 class="text-3xl font-semibold">Plug-n-play API's</h3>
              <p class="mt-4 text-lg leading-relaxed text-blueGray-500">
                This is valuable for CRM solution providers, Enterprises with
                existing CRM solutions who need a plug-n-play API for
                integrating social media messengers and Enterprises with a
                strong in-house technology & innovation team, which is managing
                internal omni-channel communication platforms.
              </p>
              <ul class="list-none mt-6">
                <li class="py-2">
                  <div class="flex items-center">
                    <div>
                      <span
                        class="
                          text-xs
                          font-semibold
                          inline-block
                          py-1
                          px-2
                          uppercase
                          rounded-full
                          text-blueGray-500
                          bg-blueGray-50
                          mr-3
                        "
                      >
                        <i class="fas fa-fingerprint"></i>
                      </span>
                    </div>
                    <div>
                      <h4 class="text-blueGray-500">
                        Common end-points for all channels
                      </h4>
                    </div>
                  </div>
                </li>
                <li class="py-2">
                  <div class="flex items-center">
                    <div>
                      <span
                        class="
                          text-xs
                          font-semibold
                          inline-block
                          py-1
                          px-2
                          uppercase
                          rounded-full
                          text-blueGray-500
                          bg-blueGray-50
                          mr-3
                        "
                      >
                        <i class="fab fa-html5"></i>
                      </span>
                    </div>
                    <div>
                      <h4 class="text-blueGray-500">
                        Re-usable multi-channel templates
                      </h4>
                    </div>
                  </div>
                </li>
                <li class="py-2">
                  <div class="flex items-center">
                    <div>
                      <span
                        class="
                          text-xs
                          font-semibold
                          inline-block
                          py-1
                          px-2
                          uppercase
                          rounded-full
                          text-blueGray-500
                          bg-blueGray-50
                          mr-3
                        "
                      >
                        <i class="far fa-paper-plane"></i>
                      </span>
                    </div>
                    <div>
                      <h4 class="text-blueGray-500">
                        Dynamic language resolution
                      </h4>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="w-full md:w-6/12 mr-auto px-4 pt-24 md:pt-0">
            <img
              alt="..."
              class="max-w-full rounded-lg shadow-xl"
              style="
                transform: scale(1) perspective(1040px) rotateY(-11deg)
                  rotateX(2deg) rotate(2deg);
              "
              :src="documentation"
            />
          </div>
        </div>
      </div>

      <div class="justify-center text-center flex flex-wrap mt-24">
        <div class="w-full md:w-6/12 px-12 md:px-4">
          <h2 class="font-semibold text-4xl">Sample Demos</h2>
          <p class="text-lg leading-relaxed mt-4 mb-4 text-blueGray-500">
            We have created simple flow examples, just to show you how easy it
            would be for your customers.
          </p>
        </div>
      </div>
    </section>

    <section class="block relative z-1 bg-blueGray-600">
      <div class="container mx-auto">
        <div class="justify-center flex flex-wrap">
          <div class="w-full lg:w-12/12 px-4 -mt-24">
            <div class="flex flex-wrap">
              <div class="w-full lg:w-4/12 px-4">
                <h5 class="text-xl font-semibold pb-4 text-center">
                  Login Page
                </h5>
                <router-link to="/auth/login">
                  <div
                    class="
                      hover:-mt-4
                      relative
                      flex flex-col
                      min-w-0
                      break-words
                      bg-white
                      w-full
                      mb-6
                      shadow-lg
                      rounded-lg
                      ease-linear
                      transition-all
                      duration-150
                    "
                  >
                    <img
                      alt="..."
                      class="
                        align-middle
                        border-none
                        max-w-full
                        h-auto
                        rounded-lg
                      "
                      :src="login"
                    />
                  </div>
                </router-link>
              </div>

              <div class="w-full lg:w-4/12 px-4">
                <h5 class="text-xl font-semibold pb-4 text-center">
                  Profile Page
                </h5>
                <router-link to="/profile">
                  <div
                    class="
                      hover:-mt-4
                      relative
                      flex flex-col
                      min-w-0
                      break-words
                      bg-white
                      w-full
                      mb-6
                      shadow-lg
                      rounded-lg
                      ease-linear
                      transition-all
                      duration-150
                    "
                  >
                    <img
                      alt="..."
                      class="
                        align-middle
                        border-none
                        max-w-full
                        h-auto
                        rounded-lg
                      "
                      :src="profile"
                    />
                  </div>
                </router-link>
              </div>

              <div class="w-full lg:w-4/12 px-4">
                <h5 class="text-xl font-semibold pb-4 text-center">
                  Landing Page
                </h5>
                <router-link to="/landing">
                  <div
                    class="
                      hover:-mt-4
                      relative
                      flex flex-col
                      min-w-0
                      break-words
                      bg-white
                      w-full
                      mb-6
                      shadow-lg
                      rounded-lg
                      ease-linear
                      transition-all
                      duration-150
                    "
                  >
                    <img
                      alt="..."
                      class="
                        align-middle
                        border-none
                        max-w-full
                        h-auto
                        rounded-lg
                      "
                      :src="landing"
                    />
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-blueGray-600 overflow-hidden">
      <div class="container mx-auto pb-64">
        <div class="flex flex-wrap justify-center">
          <div class="w-full md:w-5/12 px-12 md:px-4 ml-auto mr-auto md:mt-64">
            <div
              class="
                text-blueGray-500
                p-3
                text-center
                inline-flex
                items-center
                justify-center
                w-16
                h-16
                mb-6
                shadow-lg
                rounded-full
                bg-white
              "
            >
              <i class="fas fa-code-branch text-xl"></i>
            </div>
            <h3 class="text-3xl mb-2 font-semibold leading-normal text-white">
              About Us
            </h3>
            <p
              class="
                text-lg
                font-light
                leading-relaxed
                mt-4
                mb-4
                text-blueGray-400
              "
            >
              We are focused on building enterprise solutions for customers who
              want to achieve enhanced communication capabilities. We’ve built
              and deployed several solutions for the enterprises across the
              financial, retail, travel and hospitality industries.
            </p>
            <p
              class="
                text-lg
                font-light
                leading-relaxed
                mt-0
                mb-4
                text-blueGray-400
              "
            >
              The solutions involve the deployment of messaging platform
              integrations, BOT integration with customer core application
              system and BOT workflow messaging structuring.
            </p>
            <a v-if="$config.PROP_SERVICE_ABOUTUS_LINK"
              :href="$config.PROP_SERVICE_ABOUTUS_LINK"
              target="_blank"
              class="
                github-star
                mt-4
                inline-block
                text-white
                font-bold
                px-6
                py-4
                rounded
                outline-none
                focus:outline-none
                mr-1
                mb-1
                bg-blueGray-700
                active:bg-blueGray-600
                uppercase
                text-sm
                shadow
                hover:shadow-lg
                ease-linear
                transition-all
                duration-150
              "
            >
              Read More
            </a>
          </div>

          <div class="w-full md:w-4/12 px-4 mr-auto ml-auto mt-32 relative">
            <i
              class="
                fab
                fa-android
                text-blueGray-700 text-55
                absolute
                -top-150-px
                -right-100
                left-auto
                opacity-80
              "
            ></i>
          </div>
        </div>
      </div>
    </section>

    <section class="pb-16 bg-blueGray-200 relative pt-32">
      <div
        class="-mt-20 top-0 bottom-auto left-0 right-0 w-full absolute h-20"
        style="transform: translateZ(0)"
      >
        <svg
          class="absolute bottom-0 overflow-hidden"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          version="1.1"
          viewBox="0 0 2560 100"
          x="0"
          y="0"
        >
          <polygon
            class="text-blueGray-200 fill-current"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>

      <div class="container mx-auto">
        <div
          class="
            flex flex-wrap
            justify-center
            bg-white
            shadow-xl
            rounded-lg
            -mt-64
            py-16
            px-12
            relative
            z-10
          "
        >
          <div class="w-full text-center lg:w-8/12">
            <p class="text-4xl text-center">
              <span role="img" aria-label="love">
                <i class="fa fa-help"></i>
              </span>
            </p>
            <h3 class="font-semibold text-3xl">Want to know more?</h3>
            <p class="text-blueGray-500 text-lg leading-relaxed mt-4 mb-4">
              We will be more than happy to get you on board with our smart
              tool. You will will be amazed how easy easy it is integrate with
              your business.
            </p>
            <div class="sm:block flex flex-col mt-10">
              <a
                v-if="$config.PROP_SOCIAL_WHATSAPP"
                :href="
                  'https://api.whatsapp.com/send/?phone=' +
                  $config.PROP_SOCIAL_WHATSAPP +
                  '&text=/newaccountopen'
                "
                target="_blank"
                class="
                  get-started
                  text-white
                  font-bold
                  px-6
                  py-4
                  rounded
                  outline-none
                  focus:outline-none
                  mr-1
                  mb-2
                  bg-emerald-500
                  active:bg-emerald-600
                  uppercase
                  text-sm
                  shadow
                  hover:shadow-lg
                  ease-linear
                  transition-all
                  duration-150
                "
              >
                <i class="fab fa-whatsapp"></i>
                {{ $config.PROP_SOCIAL_WHATSAPP }}
              </a>
              <a
                v-if="$config.PROP_SOCIAL_TELEGRAM"
                :href="
                  'https://t.me/' +
                  $config.PROP_SOCIAL_TELEGRAM +
                  '?start=/start'
                "
                target="_blank"
                class="
                  github-star
                  sm:ml-1
                  text-white
                  font-bold
                  px-6
                  py-4
                  rounded
                  outline-none
                  focus:outline-none
                  mr-1
                  mb-1
                  bg-blueGray-700
                  active:bg-blueGray-600
                  uppercase
                  text-sm
                  shadow
                  hover:shadow-lg
                  ease-linear
                  transition-all
                  duration-150
                  bg-telegram
                "
              >
                <i class="fab fa-telegram text-lg mr-1"></i>
                <span>{{ $config.PROP_SOCIAL_TELEGRAM }}</span>
              </a>
            </div>
            <div class="text-center mt-16"></div>
          </div>
        </div>
      </div>
    </section>
    <footer-component />
  </div>
</template>
<script>
import IndexNavbar from "./IndexNavbar.vue";
import FooterComponent from "./Footer.vue";
import "@/assets/utils/_social.scss";

import patternVue from "@/assets/vendor/notus/img/pattern_vue.png";
import componentBtn from "@/assets/vendor/notus/img/component-btn.png";
import componentProfileCard from "@/assets/vendor/notus/img/component-profile-card.png";
import componentInfoCard from "@/assets/vendor/notus/img/component-info-card.png";
import componentInfo2 from "@/assets/vendor/notus/img/component-info-2.png";
import componentMenu from "@/assets/vendor/notus/img/component-menu.png";
import componentBtnPink from "@/assets/vendor/notus/img/component-btn-pink.png";
import documentation from "@/assets/vendor/notus/img/documentation.png";
import login from "@/assets/vendor/notus/img/login.jpg";
import profile from "@/assets/vendor/notus/img/profile.jpg";
import landing from "@/assets/vendor/notus/img/landing.jpg";

export default {
  data() {
    return {
      patternVue,
      componentBtn,
      componentProfileCard,
      componentInfoCard,
      componentInfo2,
      componentMenu,
      componentBtnPink,
      documentation,
      login,
      profile,
      landing,
    };
  },
  components: {
    IndexNavbar,
    FooterComponent,
  },
};
</script>
