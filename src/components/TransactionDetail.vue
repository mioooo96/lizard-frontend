<template>
    <div>
        type: {{route.query.type}},<br>
        status: {{route.query.status}},<br>
        image:{{ route.query.image}},<br>
        productName:{{route.query.productName}},<br>
        time:{{route.query.time}},<br>
    </div>
</template>

<script lang="ts" setup name="ProductDetail">
    import{useRoute} from 'vue-router'
    import { onMounted } from 'vue';
    
    const route = useRoute()
    
    //修改新标签页的标题为商品title
    onMounted(() => {
    document.title = `商品详情 - ${route.query.title || '未命名'}`;
    });
</script>

<style scoped>

</style>