<template>
  <v-container>
    <div class="text-right">
          <v-btn 
          dark
          @click="logout"
          color="blue-grey lighten-2">
            Cerrar sesión
          </v-btn>
        </div>
    <div class="alto"></div>
    <v-card
      class="mx-auto"
      flat
      color="grey lighten-4"
    >
    <v-row>
     <v-col
        cols="12"
        :sm="sm"
      >
        <div class="text-right">
          <v-btn 
          text
          @click="inicio"
          color="grey darken-1">
            Inicio
          </v-btn>
        </div>
      </v-col>
      <v-col
        class="d-flex"
        cols="12"
        sm="3"
        v-if="v2"
      >
        <v-select
          @change="ocultarSelect()"
          v-model="selectU"
          :key="key1"
          :items="items"
          label="Usuarios"
          v-if ="muestra"
          dense
        ></v-select>
      </v-col>
      <v-col
        class="d-flex"
        cols="12"
        :sm="3"
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
        cols="12"
        sm="3"
      >
      <div class="text-right">
        <p 
          style="color:grey;"
          :label="userInfo" 
        >{{userInfo}}</p>
        </div>
      </v-col>
    </v-row>
    
    </v-card>
    
  </v-container>
</template>

<script>
//import axios from 'axios'
import jwt_decode from 'jwt-decode'
export default {
   name: 'Perfil',
   data: () => ({
      key1:1,
      key2:1,
      v2: true,
      sm:2,
      muestra:true,
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
      inicio(){
        this.selectC=null
        this.selectU=null
        this.$emit("inicio")
      },
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
      logout: function () {
        this.$session.destroy()
        this.$router.push('/')
      }
    },
    mounted(){
      let token = this.$session.get('jwt')
      let datosUsuario = jwt_decode(token)
      let tipo =datosUsuario.Tipo
      if(tipo=="Administrador"){
        this.muestra=true
        this.v2=true
      }else{
        this.muestra=false
        this.v2=false
        this.sm=3
        this.items2.splice(1,1)
      }
      this.$root.$on("actualizaSelect",()=>{
        this.selectU=null
        this.selectC=null
      })
      this.$root.$on("inicio",()=>{
        this.selectU=null
        this.selectC=null
        this.$emit("inicio")
      })
      this.$root.$on("ocultarselect",()=>{
        this.selectC=null
      })
    }
};
</script>

<style>
.alto{
    margin-top: 4em;
}
</style>
