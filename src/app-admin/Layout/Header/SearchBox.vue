<template>
    <div class="m-search-box">
        <div class="search-wrapper" v-bind:class="{ active: searchOpen }">
            <div class="input-holder">
                <input type="text" class="search-input" placeholder="Type to search"/>
                <button class="search-icon" v-on:click="searchOpen = !searchOpen"><span/></button>
            </div>
            <button class="close" v-on:click="searchOpen = !searchOpen"  data-toggle="dropdown" />
        </div>

    <div class="dropdown dropdown-large">
        <ul class="dropdown-menu dropdown-menu-large row show" aria-labelledby="dropdownMenuButton">
            <li class="col-sm-3">
                <ul>
                    <li class="dropdown-header">Glyphicons</li>
                    <li><a href="#">Available glyphs</a></li>
                    <li class="disabled"><a href="#">How to use</a></li>
                    <li><a href="#">Examples</a></li>
                    <li class="divider"></li>
                    <li class="dropdown-header">Dropdowns</li>
                    <li><a href="#">Example</a></li>
                    <li><a href="#">Aligninment options</a></li>
                    <li><a href="#">Headers</a></li>
                    <li><a href="#">Disabled menu items</a></li>
                </ul>
            </li>
            <li class="col-sm-3">
                <ul>
                    <li class="dropdown-header">Button groups</li>
                    <li><a href="#">Basic example</a></li>
                    <li><a href="#">Button toolbar</a></li>
                    <li><a href="#">Sizing</a></li>
                    <li><a href="#">Nesting</a></li>
                    <li><a href="#">Vertical variation</a></li>
                    <li class="divider"></li>
                    <li class="dropdown-header">Button dropdowns</li>
                    <li><a href="#">Single button dropdowns</a></li>
                </ul>
            </li>
            <li class="col-sm-3">
                <ul>
                    <li class="dropdown-header">Input groups</li>
                    <li><a href="#">Basic example</a></li>
                    <li><a href="#">Sizing</a></li>
                    <li><a href="#">Checkboxes and radio addons</a></li>
                    <li class="divider"></li>
                    <li class="dropdown-header">Navs</li>
                    <li><a href="#">Tabs</a></li>
                    <li><a href="#">Pills</a></li>
                    <li><a href="#">Justified</a></li>
                </ul>
            </li>
            <li class="col-sm-3">
                <ul>
                    <li class="dropdown-header">Navbar</li>
                    <li><a href="#">Default navbar</a></li>
                    <li><a href="#">Buttons</a></li>
                    <li><a href="#">Text</a></li>
                    <li><a href="#">Non-nav links</a></li>
                    <li><a href="#">Component alignment</a></li>
                    <li><a href="#">Fixed to top</a></li>
                    <li><a href="#">Fixed to bottom</a></li>
                    <li><a href="#">Static top</a></li>
                    <li><a href="#">Inverted navbar</a></li>
                </ul>
            </li>
        </ul>
                
     </div>


    </div>
</template>

<script>
    export default {
        data() {
            return {
                searchOpen: false,
            }
        },
    }
</script>
<style type="text/css" >
.m-search-box .dropdown-large {
  position: static !important;
     /*margin-top: -65px;*/
}
.m-search-box .btn.dropdown-toggle{
/*    display: none;*/
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
    margin-left: 1px;
    height: 40px;
    width: 40px;
}
.m-search-box .dropdown-menu.dropdown-menu-large.row.show {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    left: auto;
/*    margin-right: -10px;
    margin-left: -10px;*/
}
.m-search-box .dropdown-menu-large {
  margin-left: 16px;
  margin-right: 16px;
  padding: 20px 0px;
}
.m-search-box .dropdown-menu-large > li > ul {
  padding: 0;
  margin: 0;
}
.m-search-box .dropdown-menu-large > li > ul > li {
  list-style: none;
}
.m-search-box .dropdown-menu-large > li > ul > li > a {
  display: block;
  padding: 3px 20px;
  clear: both;
  font-weight: normal;
  line-height: 1.428571429;
  color: #333333;
  white-space: normal;
}
.m-search-box .dropdown-menu-large > li ul > li > a:hover,
.m-search-box .dropdown-menu-large > li ul > li > a:focus {
  text-decoration: none;
  color: #262626;
  background-color: #f5f5f5;
}
.m-search-box .dropdown-menu-large .disabled > a,
.m-search-box .dropdown-menu-large .disabled > a:hover,
.m-search-box .dropdown-menu-large .disabled > a:focus {
  color: #999999;
}
.m-search-box .dropdown-menu-large .disabled > a:hover,
.m-search-box .dropdown-menu-large .disabled > a:focus {
  text-decoration: none;
  background-color: transparent;
  background-image: none;
  filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);
  cursor: not-allowed;
}
.m-search-box .dropdown-menu-large .dropdown-header {
  color: #428bca;
  font-size: 18px;
}
@media (max-width: 768px) {
  .m-search-box .dropdown-menu-large {
    margin-left: 0 ;
    margin-right: 0 ;
  }
  .m-search-box .dropdown-menu-large > li {
    margin-bottom: 30px;
  }
  .m-search-box .dropdown-menu-large > li:last-child {
    margin-bottom: 0;
  }
  .m-search-box .dropdown-menu-large .dropdown-header {
    padding: 3px 15px !important;
  }
}

</style>

