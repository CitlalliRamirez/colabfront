<template>
  <div>
    <barra />
    <perfil :userInfo="userInfo" v-on:mostrarForm="vistaForm" v-on:inicio="inicio"/>
    <lista-usuario v-if="cardLista" v-on:actualizarTabla="actTabla" :key="tablak"/>
    <agregar-usuario v-if="cardAgregar" v-on:agregarTabla="agrTabla"/>
    <agregar-curso v-if="cardAgregarC" v-on:agregarTabla="agrTabla"/>
    <lista-curso v-if="cardListaC" v-on:actualizarTabla="actTabla" v-on:ocultarListaC="ocultarLista" :key="tablac"/>
    <lista-chat v-if="cardListaCh" v-on:actualizarTabla="actTabla" v-on:ocultarListaCh="ocultarListach" :key="tablal"/>
    <agregar-chat v-if="cardAgregarCh" v-on:ocultaAgr="ocultaAgr"/>
    <div>
        <template>
          <div class="text-center">
            <v-snackbar
                v-model="snackbarA"
                :timeout="timeout"
                :color="color"
                absolute
                right
                rounded="pill"
                top
                >
              {{ text }}
          </v-snackbar>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import Barra from '@/components/Barra.vue'
  import Perfil from '@/components/Perfil.vue'
  import ListaUsuario from '@/components/ListaUsuario.vue'
  import AgregarUsuario from '@/components/AgregarUsuario.vue'
  import AgregarCurso from '@/components/AgregarCurso.vue'
  import ListaCurso from '@/components/ListaCurso.vue'
  import ListaChat from '@/components/ListaChat.vue'
  import AgregarChat from '@/components/AgregarChat.vue'
  import jwt_decode from 'jwt-decode'
  export default {
    name: 'VistaPerfil',
    data: () => ({
        snackbarA: false,
        text: '',
        timeout: 4000,
        color:"green",
        tablak: 1,
        tablac:1,
        tablal:1,
        userInfo: '',
        cardLista: false,
        cardAgregar: false,
        cardAgregarC: false,
        cardListaC:false,
        cardListaCh:false,
        cardAgregarCh:false,
    }),
    components: {
        Perfil,
        Barra,
        ListaUsuario,
        AgregarUsuario,
        AgregarCurso,
        ListaCurso,
        ListaChat,
        AgregarChat,
    },
    methods:{
        vistaForm(evt){
          if(evt==1){
            this.cardLista=true
            this.cardAgregar=false
            this.cardAgregarC=false
            this.cardListaC=false
            this.cardListaCh=false
          }else if(evt==2){
            this.cardLista=false
            this.cardAgregar=true
            this.cardAgregarC=false
            this.cardListaC=false
            this.cardListaCh=false
          }else if(evt==3){
            this.cardLista=false
            this.cardAgregar=false
            this.cardAgregarC=false
            this.cardListaC=true
            this.cardAgregarCh=false
            this.cardListaCh=false
          }else{
            this.cardLista=false
            this.cardAgregar=false
            this.cardAgregarC=true
            this.cardListaC=false
            this.cardListaCh=false
          }
        },
        inicio(){
            this.cardLista=false
            this.cardAgregar=false
            this.cardAgregarC=false
            this.cardListaC=false
            this.cardListaCh=false
            this.cardAgregarCh=false
        },
        actTabla(v){
          if(v==-1){
            this.text = 'Ha ocurrido un error, intente de nuevo'
            this.color = "red"
          }else{
            this.tablak++
            this.tablac++
            this.tablal++
            if(v==0){
              this.text = 'El registro ha sido eliminado exitosamente'
            }else{
              this.text = 'El registro ha sido actualizado exitosamente'
            }
            this.color = "green"
          }
          this.snackbarA = true
        },
        agrTabla(v){
          if(v==1){
            this.text = 'El registro ha sido agregado exitosamente'
            this.snackbarA = true
            this.color = "green"
          }else{
            this.text = 'Ha ocurrido un error, intente de nuevo'
            this.snackbarA = true
            this.color = "red"
          }
          
        },
        ocultarLista(){
          this.cardListaC=false
          this.cardListaCh=true
        },
        ocultarListach(){
          this.cardListaCh=false
          this.cardAgregarCh=true
        },
        ocultaAgr(){
          this.cardAgregarCh=false
          this.cardListaCh=true
        }
    },
    beforeCreate: function () {
      if (!this.$session.exists()) {
        this.$router.push('/')
      }
    },
    mounted () {
        let token = this.$session.get('jwt')
        let datosUsuario = jwt_decode(token)
        this.userInfo = datosUsuario.Tipo+': '+datosUsuario.Nombre
    }
  }
</script>
