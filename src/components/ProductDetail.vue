<template>
    <div>
        id: {{route.query.id}},<br>
        title: {{route.query.title}},<br>
        price: {{route.query.price}},<br>
        unit: {{route.query.unit}},<br>
        description: {{route.query.description}},<br>
        image:{{ route.query.image}},<br>
        Ptype:{{route.query.Ptype}},<br>
    </div>
</template>

<script lang="ts" setup name="ProductDetail">
    import{useRoute} from 'vue-router'
    import { onMounted } from 'vue';
    
    const route = useRoute()
    console.log(route.query.Ptype);
    
    //修改新标签页的标题为商品title
    onMounted(() => {
    document.title = `商品详情 - ${route.query.title || '未命名'}`;
    });
</script>

<style scoped>

</style>