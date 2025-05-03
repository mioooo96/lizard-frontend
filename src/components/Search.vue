<template>
    <PagesTemplate :keysearch="Keyword"></PagesTemplate>
</template>
  
<script setup lang="ts" name="Borrow">
    import PagesTemplate from './SearchTemplate.vue';
    import {useRouter, useRoute} from 'vue-router';
    import {ref, watch} from 'vue';

    const route = useRoute();
    const router = useRouter();
    const Keyword = ref(route.query.keyword || ''); // 使用 ref 定义响应式变量

    console.log("这里是搜索页面");
    console.log(Keyword.value);

    watch(
        () => route.query.keyword,
        (newKeyword) => {
            console.log('关键词更新:', newKeyword);
            Keyword.value = newKeyword || ''; // 修改 .value 属性
        }
    );
</script>