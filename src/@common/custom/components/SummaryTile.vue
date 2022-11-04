<template>
    <ul class="list-group">
        <li class="list-group-item border-0 d-flex p-4 mb-2 bg-gray-100 border-radius-lg">
          <div class="d-flex flex-column">
            <h6 class="mb-3 text-sm">{{header}}</h6>
            <span v-for="(detail,index) in details" :key="index" class="mb-2 text-xs">
              {{detail.label}}:
              <span class="text-dark font-weight-bold ms-sm-2">{{detail.value}}</span>
            </span>
            <slot>
            </slot>  
          </div>
          <div class="ms-auto text-end" v-if="!!this.$slots.panel">
            <slot name="panel">
              <a class="btn btn-link text-danger text-gradient px-3 mb-0" href="javascript:;">
                <i class="far fa-trash-alt me-2" aria-hidden="true"></i>Delete
              </a>
              <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;">
                <i class="fas fa-pencil-alt text-dark me-2" aria-hidden="true"></i>Edit
              </a>
            </slot>  
          </div>
        </li>
      </ul>
</template>
<script>
export default {
  name: "summary-tile",
  props : [
    "header","details"
  ]
};
</script>