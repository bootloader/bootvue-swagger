<template>
    <span><i class="fa fa-circle"
        :class="{
            'text-success' : value == 'approved',
            'text-danger' : value == 'rejected',
            'text-warning' : value == 'submitted',
        }"
    /> <slot>
        </slot>
    </span>
</template>
<script>
export default {
    props : {
        value : {
        }
    }
}
</script>