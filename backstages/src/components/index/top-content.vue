<template>
    <div class="main-container">
        <top-bar/>
        <Content/>
    </div>
</template>

<script>
import topBar from './topBar'
import Content from './content'
import { mapState } from 'vuex'

export default {
    data() {
        return {}
    },
    computed: {
        ...mapState(['isSidebarNavCollapse'])
    },
    components: {
        topBar,
        Content
    }
}
</script>
