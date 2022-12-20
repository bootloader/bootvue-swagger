<template>
    <div>
      <master-view id="quick-labels-list"  ref="masterView"
        :header="header"
        :table="table"
        :filters="[
            { label : 'Add '+header.name, icon : 'plus', name : 'ADD_ITEM'}
        ]"
        :newItem="newItem"
        :busy="table.busy" >

        <template #filter(ADD_ITEM)="{filter,createItem}">
            <b-button size="sm" @click="createItem" variant="primary">
             <i class="fa fa-plus" title="Add"/>  {{filter.label}} 
            </b-button>
        </template>

        <template #cell(actions)="row">
            <b-button size="sm" @click="row.removeItem" variant="outline-primary">
              <i class="fa fa-trash" title="Delete"/>
            </b-button>
            &nbsp;
            <b-button size="sm" @click="row.editItem"   v-tooltip="row.item.message" variant="outline-primary">
                <i class="fa fa-eye" title="View"/>
            </b-button>                                
        </template>


        <template #modal(edit)="{itemCopy}">
            <ValidationObserver ref="form"  v-if="itemCopy">
                <base-input class="mx-0 px-0"
                      v-model="itemCopy.category" label="Category" autocomplete="off" rules="required"
                      placeholder="eg : country, customerType">
                </base-input>

                <base-input class="mx-0 px-0"
                      v-model="itemCopy.title" label="Title" autocomplete="off" rules="required"
                      placeholder="eg: Platiinum, Verified, India">
                </base-input>

                  <div class="row">
                      <div class="position-relative form-group col-md-6">
                          <ValidationProvider v-slot="v" >
                              <label for="examplePassword" class="">Template</label>
                              <text-complete v-model="itemCopy.template" 
                                :placeholder="'eg: Hello {{contact.name}}'"
                                :rows="12"
                                areaClass="form-control" :strategies="strategies"></text-complete>
                                <span class="v-input-error">{{ v.errors[0] }}</span>
                        </ValidationProvider>
                  </div>
                      <div class="position-relative form-group col-md-6">
                          <label for="examplePassword" class="">Template Preview</label>
                          <textarea name="template" id="examplePassword" rows=10 readonly="readonly" 
                            type="text"
                            class="form-control" v-model="templatePreview">
                          </textarea>
                      </div>
                  </div> 

            </ValidationObserver>
        </template>  

    </master-view>

    </div>
</template>

<script>

    import mustache from 'mustache';
    import formatters from '../../../services/formatters';
    import TextComplete from '@/@common/cloned/v-textcomplete'

  var sampleJson = {
        contact : {
          name : "John Doe", phone : "919876543210", email : "John.Doe@company.com"
        }
    };
    var sampleJsonKeys = formatters.keys(sampleJson);

    export default {
        components: {
          TextComplete
        },
        data: () => ({
            header : {
              name : 'Quick Reply',
              heading: 'Quick Replies',
              subheading: 'are prompt suggestion shown to Agent for Quick response.',
              icon: 'pe-7s-browser icon-gradient bg-tempting-azure fa fa-comment-dots',
            },
            table :{
              fields: [ 
                { key : 'category', label : "Category" , sortable: true}, { key : 'title', label : "Title" , sortable: true}, 
                { key: 'actions', label: 'Actions' }
              ],
              busy : false,
              sortBy: 'name',
              api : "api/tmpl/quickreps"
            },
            newItem : {
                  "category":"", "title": "", "code" : "",
                  template : "",   message : ""        
            },
            sample : sampleJson,
            strategies: [{
              match: /(^|\s)\{\{([a-z0-9+\-\_\.]*)$/,
              search(term, callback) {
                callback(sampleJsonKeys.filter(function (name) {
                  return name.startsWith(term);
                }).slice(0, 10))
              },
              template(name) {
                return name;
              },
              replace(value) {
                return '$1{{' + value + '}} '
              },
            }]
        }),
        computed : {
            templatePreview : function (argument) {
              if(!this.$refs.masterView.getSelectedItem())
                  return "";
              try {
                  return mustache.render(this.$refs.masterView.getSelectedItem().itemCopy.template, this.sample);
              } catch (e){
                  return this.$refs.masterView.getSelectedItem().itemCopy?.template
              }
            },
        },
        created : function (argument) {
          //this.loadItems();
        },
        methods : {
          async loadItems (){
              await this.$refs.masterView.apply();
          }
        }

    }
</script>