<template>
  <v-container>
 <v-card
    class="mx-auto"
    max-width="1200"
    outlined
  >
    
    <v-toolbar
      color="blue"
      dark
    >
      <v-toolbar-title>Lista de chats en historial</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="datosTabla"
      :search="search"
      no-data-text="No se encontraron resultados"
      no-results-text="No se encontraron resultados"
      :footer-props="{'items-per-page-text':'Datos por página','page-text':'{0}-{1} de {2}'}"  
    >
    <template v-slot:item.actions="{ item }">

      <v-btn
      depressed
      small
      :disabled="item.hab"
      @click="ventanaChat"
      >
      Entrar
      <v-icon
        small 
      >
        mdi-arrow-up-bold-box-outline
      </v-icon>
      </v-btn>
    </template>
    </v-data-table>
  </v-card>
  </v-container>
</template>


<script>
import axios from 'axios'
import jwt_decode from 'jwt-decode'
export default {
   name: 'ListaHistorial',
    data:()=>({
        ocultarT:false,
        search: '',
        items:[],
        items2:[],
        dialog:false,
        editedIndex:-1,
        ocultarEd:false,
        ocultarEn:false,
        ocultarEl:false,
        dialogDelete:false,
        nameRules: [
          v => !!v || 'Campo obligatorio',
        ],
        headers: [
          {
            text: 'ID',
            align: 'start',
            sortable: false,
            value: 'id',
          },
          { text: 'Nombre', value: 'nombre' },
          { text: 'Fecha y hora', value: 'fecha' },
          {text:'Acciones',value:'actions',sortable:false},
        ],
        datosResponse : null,
        datosTabla: [],
        time: null,
        date:null,
        dateFormatted:null,
        editedItem: {
          id:0,
          nombre: '',
          editor: 10,
          moderador: 0,
          observador:0,
        },
        editedItemResp: {
          id:0,
          nombre: '',
          editor: 0,
          moderador: 0,
          observador:0,
        },
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo chat' : 'Editar chat'
      },
    },
    methods:{
      parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      selectingHourIfUseHoursOnly() {
      if (this.useHoursOnly) {
        this.$nextTick(() => {
          this.$refs.picker.selectingHour = true;
        });
      }
    },
      formatTime (time){
        if (!time) return null

        const [horas, minutos] = time.split(':')
        return `${horas}:${minutos}:00`
      },
       formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
      ventanaChat(){
        let token = this.$session.get('jwt')
        let datosUsuario = jwt_decode(token)
        let tipo =datosUsuario.Tipo 
        const path = `${this.$hostname}/backtablas/rol`
        if(tipo=="Profesor"){
          //mostrar y decir que es profesor
          this.$emit("ventanachat","Profesor")
        }else{
          //mostrar y decir que rol (editor,mod,observador)
          let id = new FormData()
          id.append("id",datosUsuario.Id)
          axios.post(path,id).then((response)=>{
            let rol = response.data
            this.$emit("ventanachat",rol)
          })
          .catch((error)=>{
            console.log(error)
          })
          
        }
      },
     
      

    },
    mounted(){
        let token = this.$session.get('jwt')
        let datosUsuario = jwt_decode(token)
        let tipo =datosUsuario.Tipo 
        if(tipo=="Profesor"){
            this.ocultarT = true
        }else{
            this.ocultarT = false
        }
        let curso = new FormData()
        curso.append("id",this.$session.get("idcurso"))
        curso.append("tipo",datosUsuario.Tipo)
        curso.append("idU",datosUsuario.Id)
        const path = `${this.$hostname}/backtablas/listadocurso/listadochat`
        axios.post(path,curso).then((response) => {
       this.datosResponse = response.data
       for (let i = 0; i < this.datosResponse.length; i++) {   
          const [hor, minu, segu] = this.datosResponse[i].hora.split(':')   
          var hoy = new Date()
          var hoyr = new Date()
        
          var horaInicial = hoy.getHours()<10?"0"+hoy.getHours():hoy.getHours()    
          var horaFinal =  (hoyr.getHours()+1)<10?"0"+(hoyr.getHours()+1):(hoyr.getHours()+1)
          var FechaActual  = hoy.getFullYear()+"-"+((hoy.getMonth()+1)<10?"0"+(hoy.getMonth()+1):(hoy.getMonth()+1))+"-"+(hoy.getDate()<10?"0"+hoy.getDate():hoy.getDate())
          if(hor>=horaInicial && hor<horaFinal && this.datosResponse[i].fecha>=FechaActual){
          console.log("entra",horaInicial,horaFinal,hor,minu,segu)

        }else if (hor>=horaFinal && this.datosResponse[i].fecha>=FechaActual){
          console.log("entra pero inactivo")
          
        }else{
          console.log("Pertenece a historial")
          this.datosTabla.push({"id":this.datosResponse[i].id,
                               "nombre":this.datosResponse[i].nombre,
                               "fecha":this.datosResponse[i].fecha+" "+this.datosResponse[i].hora,
                               "editor":this.datosResponse[i].editor,
                               "moderador":this.datosResponse[i].moderador,
                               "observador":this.datosResponse[i].observador,
                               "hab":false})
        }
            
        
       }
       
     })
     .catch((error) => {
       console.log(error)
     })

      if(tipo=="Profesor"){
        this.ocultarEd = true
        this.ocultarEl = true
      }else{
        this.ocultarEd = false
        this.ocultarEl = false
      }
    }
}
</script>

<style>
.encab{
    border: 1px solid gray;
}
</style>
