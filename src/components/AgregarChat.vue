<template>
  <v-container>
  <v-card
    class="mx-auto"
    max-width="1200"
    outlined>
  <v-toolbar
      color="blue"
      dark
    >
      <v-toolbar-title>Agregar chat</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        depressed
        small
        color="primary"
        @click="ocultaAgr"
      >
      Lista chat
      </v-btn>
    </v-toolbar>
  <v-card-text>
  <v-form
    ref="form"
    lazy-validation
  >
    <v-tooltip right
    color="red">
    <template v-slot:activator="{ on, attrs }">
    <v-text-field 
      v-bind="attrs"
      v-on="on"
      v-model="datosForm.nombre"
      :rules="nameRules"
      label="Nombre"
      required
    ></v-text-field>
    </template>
    <span>Campo obligatorio</span>
    </v-tooltip>

    <v-select
      @change="deshabilitar($event)"
      v-model="datosForm.editor"
      :items="items"
      item-text="nombre"
      item-value="id"
      :rules="[v => !!v || 'Campo obligatorio']"
      label="Editor"
      required
    ></v-select>

    <v-select
      @change="deshabilitar2($event)"
      v-model="datosForm.moderador"
      :items="items"
      item-text="nombre"
      item-value="id"
      :rules="[v => !!v || 'Campo obligatorio']"
      label="Moderador"
      required
    ></v-select>

    <v-select
      @change="deshabilitarM($event)"
      v-model="datosForm.observadores"
      :items="items2"
      item-text="nombre"
      item-value="id"
      :rules="[v => v.length>1 || 'Campo obligatorio, mínimo 2']"
      label="Observadores"
      multiple
      required
    ></v-select>
    <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn
      color="blue"
      class="mr-4"
      @click="validate"
    >
      Guardar
    </v-btn>
    <v-btn
        color="grey"
        class="mr-4"
        @click="cancelar"
      >
        Cancelar
      </v-btn>
    </v-card-actions>
  </v-form>
  </v-card-text>
  </v-card>

  <v-dialog
      v-model="dialogDelete"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          Nota curso
        </v-card-title>
        <v-card-text>El curso no se registrará, porque no hay alumnos suficientes en el semestre y carrera seleccionada, registrar más usuarios o seleccione otra carrera y/o semestre</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="gray"
            text
            @click="close"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!----->
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
   name: 'AgregarChat',
   data: () => ({
     dialogDelete: false,
      datosForm: {nombre:'',editor:0 ,moderador:0,observadores:0},
      datosCurso: {curso_nombre:'',profesor:0},
      datosAC:{curso:0,alumno:0},
      alumnos:[],
      itemdis:-1,
      name: '',
      nameRules: [
        v => !!v || 'Campo obligatorio',
      ],
      items: [],
      items2: [],
      items3: [],
    }),

    methods: {
        ocultaAgr(){
          this.$emit("ocultaAgr")
        },
        deshabilitar(event){
            
            let posA = []
            let pos = this.items.findIndex( item => item.id ===event )
            let posM = this.items.findIndex( item => item.id ===this.datosForm.moderador )
            if(posM!=-1){
                posA.push(posM)
            } 
            for(let i=0;i<this.datosForm.observadores.length;i++){
                posM = this.items.findIndex( item => item.id ===this.datosForm.observadores[i] )
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
            let posM = this.items.findIndex( item => item.id ===this.datosForm.editor )
            if(posM!=-1){
                posA.push(posM)
            } 
            for(let i=0;i<this.datosForm.observadores.length;i++){
                posM = this.items.findIndex( item => item.id ===this.datosForm.observadores[i] )
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
            let posM = this.items.findIndex( item => item.id ===this.datosForm.moderador )
            if(posM!=-1){
                posA.push(posM)
            } 
            posM = this.items.findIndex( item => item.id ===this.datosForm.editor )  
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
        close () {
          this.dialogDelete = false
        },
        validate (evt) {
        evt.preventDefault()
        let vari = this.$refs.form.validate()
        if(vari==true){
            this.guardarChat()
        }
      },
      cancelar(){
        this.$refs.form.reset()
        this.$root.$emit("inicio") //devuelva a la pagina de inicio
      },
      guardarChat(){//chat
         const path = `${this.$hostname}/backtablas/guardac`
          let chat = new FormData()
          chat.append("idcurso",this.$session.get("idcurso"))
          chat.append("nombre",this.datosForm.nombre)
          chat.append("editor",this.datosForm.editor)
          chat.append("moderador",this.datosForm.moderador)
          chat.append("observadores",this.datosForm.observadores)
          axios.post(path,chat).then((response) => {
                console.log("ok",response.data)
                this.$refs.form.reset()
                this.$emit("agregarTabla",3)
          })
          .catch((error)=>{
            console.log(error)
            this.$emit("agregarTabla",-1)
          })

      }
    },
    mounted(){
          let curso = new FormData()
          curso.append("id",this.$session.get("idcurso"))
          const path = `${this.$hostname}/backtablas/lista`
          axios.post(path,curso).then((response) => {
             this.datosResponse = response.data
             console.log(response.data)
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
            //this.$emit("agregarTabla",-1)
          })
    },

}
</script>

<style>
</style>
