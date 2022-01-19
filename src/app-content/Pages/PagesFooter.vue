<template>
    <footer>
        <!-- Footer main -->
        <section class="ft-main">
            <div class="ft-main-item">
                <h2 class="ft-title">About</h2>
                <ul>
                    <li><a href="https://www.mehery.com/about">About Mehery</a></li>
                    <li><a href="https://www.mehery.com/#Pricing">Services</a></li>
                    <li><a href="https://www.mehery.com/about">Pricing</a></li>
                    <li><a href="https://www.mehery.com/careers">Careers</a></li>
                </ul>
            </div>
            <div class="ft-main-item">
                <h2 class="ft-title">Resources</h2>
                <ul>
                    <li><a href="https://docs.mehery.com/">Docs</a></li>
                    <li><a href="https://www.mehery.com/blog">Blog</a></li>
                </ul>
            </div>
            <div class="ft-main-item">
                <h2 class="ft-title">Contact</h2>
                <ul>
                    <li><a href="mailto:sales@mehery.com">sales@mehery.com</a></li>
                </ul>
            </div>
            <div class="ft-main-item">
                <h2 class="ft-title">Address</h2>
                <p>1-34, A H Wadia Baug,<br/>
                    Parel Tank Road,<br/>
                    Mumbai 400033.</p>
            </div>
        </section>

        <!-- Footer social -->
        <section class="ft-social">
            <ul class="ft-social-list">
                <li>
                    <a href="https://www.facebook.com/MeherY.SocCom/"
                        ><i class="fab fa-facebook"></i
                    ></a>
                </li>
                <li>
                    <a href="https://twitter.com/mehery_soccom"><i class="fab fa-twitter"></i></a>
                </li>
                <li>
                    <a href="https://www.instagram.com/mehery_soccom/"
                        ><i class="fab fa-instagram"></i
                    ></a>
                </li>
            </ul>
        </section>

        <!-- Footer legal -->
        <section class="ft-legal">
            <ul class="ft-legal-list">
                <li>
                    <a href="https://www.mehery.com/terms-of-service"
                        >Terms of Service</a
                    >
                </li>
                <li>
                    <a href="https://www.mehery.com/privacy-policy-2"
                        >Privacy Policy</a
                    >
                </li>
                <li>Copyright &copy; 2022 Mehery. All Rights Reserved.</li>
            </ul>
        </section>
    </footer>
</template>
<script>
    export default {
        data() {
            return {
                year: new Date().getFullYear(),
            }
        },
    }
</script>
<style scoped>
    /* Generic styling */
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    ul {
        list-style: none;
        padding-left: 0;
    }
    footer {
        background-color: #555;
        color: #bbb;
        line-height: 1.5;
    }
    footer a {
        text-decoration: none;
        color: #eee;
    }
    a:hover {
        text-decoration: underline;
    }
    .ft-title {
        color: #fff;
        font-size: 1.375rem;
        padding-bottom: 0.625rem;
    }
    /* Sticks footer to bottom */
    body {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
    }
    .container {
        flex: 1;
    }
    /* Footer main */
    .ft-main {
        padding: 1.25rem 1.875rem;
        display: flex;
        flex-wrap: wrap;
    }
    @media only screen and (min-width: 29.8125rem /* 477px */) {
        .ft-main {
            justify-content: space-evenly;
        }
    }
    @media only screen and (min-width: 77.5rem /* 1240px */) {
        .ft-main {
            justify-content: space-evenly;
        }
    }
    .ft-main-item {
        padding: 1.25rem;
        min-width: 12.5rem;
    }

    /* Footer main | Newsletter form */
    form {
        display: flex;
        flex-wrap: wrap;
    }
    input[type='email'] {
        border: 0;
        padding: 0.625rem;
        margin-top: 0.3125rem;
    }
    input[type='submit'] {
        background-color: #00d188;
        color: #fff;
        cursor: pointer;
        border: 0;
        padding: 0.625rem 0.9375rem;
        margin-top: 0.3125rem;
    }
    /* Footer social */
    .ft-social {
        padding: 0 1.875rem 1.25rem;
    }
    .ft-social-list {
        display: flex;
        justify-content: center;
        border-top: 1px #777 solid;
        padding-top: 1.25rem;
    }
    .ft-social-list li {
        margin: 0.5rem;
        font-size: 1.25rem;
    }
    /* Footer legal */
    .ft-legal {
        padding: 0.9375rem 1.875rem;
        background-color: #333;
    }
    .ft-legal-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }
    .ft-legal-list li {
        margin: 0.125rem 0.625rem;
        white-space: nowrap;
    }
    /* one before the last child */
    .ft-legal-list li:nth-last-child(2) {
        flex: 1;
    }
</style>
