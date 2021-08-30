<template>
  <v-container>
    <div class="alto"></div>
    <v-row >
     <v-col
        cols="12"
        sm="2"
      >
        <div class="text-center">
          <v-btn text>
            Inicio
          </v-btn>
        </div>
      </v-col>
      <v-col
        class="d-flex"
        cols="12"
        sm="2"
      >
        <v-select
          @change="ocultarSelect()"
          v-model="selectU"
          :key="key1"
          :items="items"
          label="Usuarios"
          dense
        ></v-select>
      </v-col>
      <v-col
        class="d-flex"
        cols="12"
        sm="2"
      >
        <v-select
          @change="ocultarSelect2()"
          v-model="selectC"
          :key="key2"
          :items="items2"
          label="Cursos"
          dense
        ></v-select>
      </v-col>
      <v-col
        class="d-flex"
        cols="12"
        sm="6"
      >
        <v-select
          :items="items3"
          :label="userInfo"
          dense
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
//import axios from 'axios'
export default {
   name: 'Perfil',
   data: () => ({
      key1:1,
      key2:1,
      items: ['Ver usuarios', 'Agregar usuarios'],
      items2: ['Ver cursos', 'Agregar cursos'],
      items3: ['Cerrar sesión'],
      selectU:null,
      selectC:null,
    }),
    props:{
        userInfo: String
    },
    methods: {
      ocultarSelect (){ 
        let idSelect
        this.key2++
        this.selectC=null
        console.log(this.selectU,this.selectC)
        if(this.selectU=='Ver usuarios'){
          idSelect=1
        }else {
          idSelect=2
        }
        this.$emit("mostrarForm",idSelect)
      },
      ocultarSelect2 (){
        let idSelect
        this.key1++
        this.selectU=null
        console.log(this.selectU,this.selectC)
        if(this.selectC=='Ver cursos'){
          idSelect=3
        }else{
          idSelect=4
        }
        this.$emit("mostrarForm",idSelect)
      },
    }
};
</script>

<style>
.alto{
    margin-top: 4em;
}
</style>
