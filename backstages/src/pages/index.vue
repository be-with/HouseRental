<template>
    <div class="container" :class="{navCollapsed:isSidebarNavCollapse}">
        <left-menu class="wrapper"/>
        <top-content/>
    </div>
</template>

<script>
import topContent from '@/components/index/top-content.vue'
import leftMenu from '@/components/index/leftMenu.vue'
import { mapState } from 'vuex'
export default {    
    components:{
        topContent,
        leftMenu
    },
    computed:{
        ...mapState(['isSidebarNavCollapse'])
    }
}
</script>




