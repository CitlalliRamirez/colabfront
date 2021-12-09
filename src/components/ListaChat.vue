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
      <v-toolbar-title>Lista de chats</v-toolbar-title>
      <v-spacer></v-spacer>
      <div style="width:130px">
      <v-btn
        depressed
        small
        color="primary"
        @click="oculta"
      >
      Ver historial
      </v-btn>
      </div>
      <div>
      <v-btn
        depressed
        small
        color="primary"
        v-if="ocultarT"
        @click="ocultarListaCh"
      >
      Agregar
      </v-btn>
      </div>
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
        v-if="ocultarEd"
        depressed
        small
        @click="editItem(item)"
      >
      Editar
      <v-icon
        small
        class="mr-2"
      >
        mdi-pencil
      </v-icon>
      </v-btn>

      <v-btn
        v-if="ocultarEl"
        depressed
        small
        @click="deleteItem(item)"
      >
      Eliminar
      <v-icon
        small 
      >
        mdi-delete
      </v-icon>
      </v-btn>

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
    <!--dialog de editar-->
   <v-dialog
          v-model="dialog"
          max-width="500px"
        >
        <v-card>
          <v-toolbar
              color="blue"
              dark
          >
      <v-toolbar-title>{{formTitle}}</v-toolbar-title>
      </v-toolbar>
            <v-card-text>
              <br/>
              <v-form
              ref="form">
                    <v-tooltip right
                    color="red">
                    <template v-slot:activator="{ on, attrs }">
                    <v-text-field 
                      v-bind="attrs"
                      v-on="on"
                      v-model="editedItem.nombre"
                      :rules="nameRules"
                      label="Nombre"
                      required
                    ></v-text-field>
                    </template>
                    <span>Campo obligatorio</span>
                    </v-tooltip>

                  <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateFormatted"
              label="Fecha"
              persistent-hint
              v-bind="attrs"
              @blur="date = parseDate(dateFormatted)"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            no-title
            locale="es"
            @input="menu1 = false"
          ></v-date-picker>
        </v-menu>

        <v-menu
        ref="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="time"
            label="Hora"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
          v-model="time"
          full-width
          ref="picker"
          @click:hour="selectingHourIfUseHoursOnly"
        ></v-time-picker>
      </v-menu>

  
                    <v-select
                        @change="deshabilitar($event)"
                        v-model="editedItem.editor"
                        :items="items"
                        item-text="nombre"
                        item-value="id"
                        :rules="[v => !!v || 'Campo obligatorio']"
                        label="Editor"
                        required
                    ></v-select>

                    <v-select
                        @change="deshabilitar2($event)"
                        v-model="editedItem.moderador"
                        :items="items"
                        item-text="nombre"
                        item-value="id"
                        :rules="[v => !!v || 'Campo obligatorio']"
                        label="Moderador"
                        required
                    ></v-select>
                   <v-select
                        @change="deshabilitarM($event)"
                        v-model="editedItem.observador"
                        :items="items2"
                        item-text="nombre"
                        item-value="id"
                        :rules="[v => v.length>1 || 'Campo obligatorio, mínimo 2']"
                        label="Observadores"
                        multiple
                        required
                    ></v-select>
                  </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue"
                text
                @click="limpiar"
              >
                Limpiar roles
              </v-btn>
              <v-btn
                color="blue"
                text
                @click="validate"
              >
                Guardar
              </v-btn>
              <v-btn
                color="gray"
                text
                @click="cancel"
              >
                Cancelar
              </v-btn>
            </v-card-actions>
          </v-card>
    </v-dialog>
    <!--dialog de eliminar-->
    <v-dialog
      v-model="dialogDelete"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          Eliminar chat
        </v-card-title>
        <v-card-text>¿Seguro de eliminar el registro?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue"
            text
            @click="confirmDelete"
          >
            Aceptar
          </v-btn>
          <v-btn
            color="gray"
            text
            @click="closeDelete"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
  </v-container>
</template>


<script>
import axios from 'axios'
import jwt_decode from 'jwt-decode'
export default {
   name: 'ListaChat',
    data:()=>({
        ocultarT:false,
        dis: true,
        search: '',
        menu1: false,
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
    watch: {
       date(val){
        this.items = []
        this.items2 = []
        this.dateFormatted = this.formatDate(this.date)
        let curso = new FormData()
        curso.append("id",this.editedItem.id)
        console.log("ed",this.editedItem.id)
        curso.append("fecha", val)
        let h = this.formatTime(this.time)
        curso.append("hora",h)
        const path = `${this.$hostname}/backtablas/listae`
        axios.post(path,curso).then((response) => {
             this.datosResponse = response.data
             console.log("lista",response.data)
            for (let i = 0; i < this.datosResponse.length; i++) {
            this.items.push({"id":this.datosResponse[i].id,
                            "nombre":this.datosResponse[i].nombre,
                            "disabled": false})
            this.items2.push({"id":this.datosResponse[i].id,
                            "nombre":this.datosResponse[i].nombre,
                            "disabled": false})                
         
            }
          })
          .catch((error)=>{
            console.log(error)
          })

      },
      time(val){
        this.items = []
        this.items2 = []
        this.dateFormatted = this.formatDate(this.date)
        let curso = new FormData()
        curso.append("id",this.editedItem.id)
        curso.append("fecha", this.date)
        let h = this.formatTime(val)
        curso.append("hora",h)
        const path = `${this.$hostname}/backtablas/listae`
        axios.post(path,curso).then((response) => {
             this.datosResponse = response.data
             console.log("lista",response.data)
            for (let i = 0; i < this.datosResponse.length; i++) {
            this.items.push({"id":this.datosResponse[i].id,
                            "nombre":this.datosResponse[i].nombre,
                            "disabled": false})
            this.items2.push({"id":this.datosResponse[i].id,
                            "nombre":this.datosResponse[i].nombre,
                            "disabled": false})                
         
            }
          })
          .catch((error)=>{
            console.log(error)
          })

      }
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
      ocultarListaCh(){
          this.$emit("ocultarListaCh")
      },
      oculta(){
          this.$emit("oculta")
      },
      deshabilitar(event){
            
            let posA = []
            let pos = this.items.findIndex( item => item.id ===event )
            let posM = this.items.findIndex( item => item.id ===this.editedItem.moderador )
            if(posM!=-1){
                posA.push(posM)
            } 
            for(let i=0;i<this.editedItem.observador.length;i++){
                posM = this.items.findIndex( item => item.id ===this.editedItem.observador[i] )
                posA.push(posM)
            }  
            for(let i=0;i<this.items.length;i++){
                this.items[i].disabled=false
            }
            for(let j=0;j<posA.length;j++){
                this.items[posA[j]].disabled=true
            }
            this.items[pos].disabled=true
             this.items2=JSON.parse(JSON.stringify(this.items))
        },
        deshabilitar2(event){
            let posA = []
            let pos = this.items.findIndex( item => item.id ===event )
            let posM = this.items.findIndex( item => item.id ===this.editedItem.editor )
            if(posM!=-1){
                posA.push(posM)
            } 
            for(let i=0;i<this.editedItem.observador.length;i++){
                posM = this.items.findIndex( item => item.id ===this.editedItem.observador[i] )
                posA.push(posM)
            }  
            for(let i=0;i<this.items.length;i++){
                this.items[i].disabled=false
            }
            for(let j=0;j<posA.length;j++){
                this.items[posA[j]].disabled=true
            }
            this.items[pos].disabled=true
            this.items2=JSON.parse(JSON.stringify(this.items))
        },
        deshabilitarM(event){
            let posA = []
            let posM = this.items.findIndex( item => item.id ===this.editedItem.moderador )
            if(posM!=-1){
                posA.push(posM)
            } 
            posM = this.items.findIndex( item => item.id ===this.editedItem.editor )  
            if(posM!=-1){
                posA.push(posM)
            }
            for(let i=0;i<this.items.length;i++){
                this.items[i].disabled=false
                this.items2[i].disabled=false
            }
            
            for(let j=0;j<posA.length;j++){
                this.items[posA[j]].disabled=true
                this.items2[posA[j]].disabled=true
                
            }
            
            for(let i=0;i<event.length;i++){
                let pos = this.items.findIndex( item => item.id ===event[i] )
                this.items[pos].disabled=true
                
            }
            
        },
        //////editar
      editItem (item) {
        console.log("ITEM:",item)
        this.editedIndex = this.datosTabla.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.editedItemResp = Object.assign({}, item)
        const [fechita, horita] = item.fecha.split(' ')
        this.time = horita
        this.date = fechita
        this.dateFormatted = this.formatDate(this.date)
        let datitos = []
        console.log(this.dateFormatted)
        datitos.push(this.editedItem.editor)
        datitos.push(this.editedItem.moderador)
        for(let k=0;k<this.editedItem.observador.length;k++){
             datitos.push(this.editedItem.observador[k])
        }
        
        const pathPP = `${this.$hostname}/backtablas/listae`
        let idd = new FormData()
        idd.append("id",item.id)
        idd.append("fecha", fechita)
        idd.append("hora",horita)
        axios.post(pathPP,idd).then((response) => {
            this.datosResponse = response.data
            console.log(this.datosResponse)
            for (let i = 0; i < this.datosResponse.length; i++) {
                let vt =datitos.includes(this.datosResponse[i].id) 
                this.items.push({"id":this.datosResponse[i].id,
                                "nombre":this.datosResponse[i].nombre,
                                "disabled": vt})
                this.items2.push({"id":this.datosResponse[i].id,
                                "nombre":this.datosResponse[i].nombre,
                                "disabled": vt})
            }
        })
        .catch((error) => {
            console.log(error)
        })  
        this.dialog = true


      },
      closeDelete () {
        this.dialogDelete = false
      },
      cancel () {
        this.dialog = false
        this.editedItem=Object.assign({}, this.editedItemResp)

      },
      deleteItem (item){
        this.itemId = item.id
        this.dialogDelete= true
      },
      confirmDelete(){ //eliminar chat
        const path = `${this.$hostname}/backtablas/chats/${this.itemId}/`
        axios.delete(path).then((response) => {
          console.log("ok",response.data)
          this.$emit("actualizarTabla",0)
        })
        .catch((error) =>{
          console.log(error)
          this.$emit("actualizarTabla",-1)
        })
        this.dialogDelete= false
      },
      validate (evt) {
        evt.preventDefault()
        let vari = this.$refs.form.validate()
        if(vari==true){
            this.actualizar()
        }
      },
      limpiar(){
        for(let i=0;i<this.items.length;i++){
                this.items[i].disabled=false
                this.items2[i].disabled=false
        }
        this.editedItem.moderador=0
        this.editedItem.editor=0
        this.editedItem.observador=0
        console.log("ed",this.editedItem)
      },
      actualizar(){//actualizar chat
          const path = `${this.$hostname}/backtablas/actualizarc`
          let chat = new FormData()
          chat.append("id",this.editedItem.id)
          chat.append("nombre",this.editedItem.nombre)
          chat.append("editor",this.editedItem.editor)
          chat.append("moderador",this.editedItem.moderador)
          chat.append("observadores",this.editedItem.observador)
          axios.post(path,chat).then((response) => {
                console.log("ok",response.data)
                this.$emit("actualizarTabla",1)
          })
          .catch((error)=>{
            console.log(error)
            this.$emit("actualizarTabla",-1)
          })
        this.dialog = false
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
          this.datosTabla.push({"id":this.datosResponse[i].id,
                               "nombre":this.datosResponse[i].nombre,
                               "fecha":this.datosResponse[i].fecha+" "+this.datosResponse[i].hora,
                               "editor":this.datosResponse[i].editor,
                               "moderador":this.datosResponse[i].moderador,
                               "observador":this.datosResponse[i].observador,
                               "hab":false})

        }else if (hor>=horaFinal && this.datosResponse[i].fecha>=FechaActual){
          console.log("entra pero inactivo")
          this.datosTabla.push({"id":this.datosResponse[i].id,
                               "nombre":this.datosResponse[i].nombre,
                               "fecha":this.datosResponse[i].fecha+" "+this.datosResponse[i].hora,
                               "editor":this.datosResponse[i].editor,
                               "moderador":this.datosResponse[i].moderador,
                               "observador":this.datosResponse[i].observador,
                               "hab":true})
        }else{
          console.log("NO se pinta")
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
