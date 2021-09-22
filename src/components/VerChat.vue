<template>
    <v-container>
        <h1>{{userInfo}}</h1>
    </v-container>
</template>
<script>
export default {
   name: 'VerChat',
   props: {
      userInfo: String,
   },
};
</script>