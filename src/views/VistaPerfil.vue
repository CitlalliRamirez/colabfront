<template>
  <div>
    <barra />
    <perfil :userInfo="userInfo" v-on:mostrarForm="vistaForm" v-on:inicio="inicio"/>
    <lista-usuario v-if="cardLista" v-on:actualizarTabla="actTabla" :key="tablak"/>
    <agregar-usuario v-if="cardAgregar" v-on:agregarTabla="agrTabla"/>
    <agregar-curso v-if="cardAgregarC" v-on:agregarTabla="agrTabla"/>
    <lista-curso v-if="cardListaC" v-on:actualizarTabla="actTabla" v-on:ocultarListaC="ocultarLista" :key="tablac"/>
    <lista-chat v-if="cardListaCh" v-on:ventanachat="ventanachat" v-on:actualizarTabla="actTabla" v-on:ocultarListaCh="ocultarListach" v-on:oculta="oculta" :key="tablal"/>
    <lista-historial v-if="cardListaChHis" v-on:ventanachat="ventanachat"/>
    <agregar-chat v-if="cardAgregarCh" v-on:agregarTabla="agrTabla" v-on:ocultaAgr="ocultaAgr"/>
    <ver-chat :userInfo="rol"  v-if="cardChat"  />
    <div>
        <template>
          <div class="text-center">
            <v-snackbar
                v-model="snackbarA"
                :timeout="timeout"
                :color="color"
                absolute
                right
                height="70"
                rounded="0"
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
  import VerChat from '@/components/VerChat.vue'
  import jwt_decode from 'jwt-decode'
  import ListaHistorial from '@/components/ListaHistorial.vue'
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
        rol:'',
        cardLista: false,
        cardListaChHis:false,
        cardAgregar: false,
        cardAgregarC: false,
        cardListaC:false,
        cardListaCh:false,
        cardAgregarCh:false,
        cardChat:false
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
        VerChat,
        ListaHistorial
    },
    methods:{
        ventanachat(dato){
          console.log(dato)
          this.rol = "Esta ventana es del: "+dato
          this.cardChat=true
          this.cardListaCh=false
          this.cardListaChHis=false
        },
        vistaForm(evt){
          if(evt==1){
            this.cardLista=true
            this.cardAgregar=false
            this.cardAgregarC=false
            this.cardListaC=false
            this.cardListaCh=false
            this.cardChat= false
            this.cardListaChHis=false
          }else if(evt==2){
            this.cardLista=false
            this.cardAgregar=true
            this.cardAgregarC=false
            this.cardListaC=false
            this.cardListaCh=false
            this.cardChat= false
            this.cardListaChHis=false
          }else if(evt==3){
            this.cardLista=false
            this.cardAgregar=false
            this.cardAgregarC=false
            this.cardListaC=true
            this.cardAgregarCh=false
            this.cardListaCh=false
            this.cardChat= false
            this.cardListaChHis=false
          }else{
            this.cardLista=false
            this.cardAgregar=false
            this.cardAgregarC=true
            this.cardListaC=false
            this.cardListaCh=false
            this.cardChat= false
            this.cardListaChHis=false
          }
        },
        inicio(){
            this.cardLista=false
            this.cardAgregar=false
            this.cardAgregarC=false
            this.cardListaC=false
            this.cardListaCh=false
            this.cardAgregarCh=false
            this.cardChat= false
            this.cardListaChHis=false
        },
        actTabla(v){
          console.log("ENTRA",v)
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
            this.cardAgregar=false //modal de usuario
            this.cardLista =true //lista de usuarios
          }else if(v==2){
            this.text = 'El registro ha sido agregado exitosamente'
            this.snackbarA = true
            this.color = "green"
            this.cardAgregarC = false //modal de curso
            this.cardListaC =true //lista de cursos
          }else if(v==3){
            this.text = 'El registro ha sido agregado exitosamente'
            this.snackbarA = true
            this.color = "green"
            this.cardAgregarCh=false //modal de chat
            this.cardListaCh = true // lista de chats
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
        oculta(){
          this.cardListaCh=false
          this.cardListaChHis=true
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
