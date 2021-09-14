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
      <v-toolbar-title>Lista de usuarios</v-toolbar-title>
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
      :footer-props="{'items-per-page-text':'Datos por página','page-text':'{0}-{1} de {2}','items-per-page-all-text':'Todo'}"  
    >
    <template v-slot:item.actions="{ item }">
      <v-btn
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
    </template>
    </v-data-table>
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
                    <v-text-field
                      v-model="editedItem.id"
                      label="ID"
                      disabled
                    ></v-text-field>


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


                    <v-tooltip right
                    color="red">
                    <template v-slot:activator="{ on, attrs }">
                    <v-text-field 
                      v-bind="attrs"
                      v-on="on"
                      v-model="editedItem.correo"
                      :rules="emailRules"
                      label="Correo"
                      required
                    ></v-text-field>
                    </template>
                    <span>Debe tener el formato ejem@ejem.com</span>
                    </v-tooltip>

                    <v-tooltip right
                    color="red">
                    <template v-slot:activator="{ on, attrs }">
                    <v-text-field 
                      v-bind="attrs"
                      v-on="on"
                      v-model="editedItem.contrasena"
                      :rules="passRules"
                      label="Contraseña"
                      required
                    ></v-text-field>
                    </template>
                    <span>La contraseña es obligatoria y debe tener al menos 8 caracteres</span>
                    </v-tooltip>

                   <v-text-field
                      v-model="editedItem.tipo"
                      label="Tipo de usuario"
                      disabled
                    ></v-text-field>
                  </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
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
    <v-dialog
      v-model="dialogDelete"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          Eliminar usuario
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
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
  </v-container>
</template>


<script>
import axios from 'axios'

export default {
   name: 'ListaUsuario',
   data: () => ({
        dialog: false,
        editedIndex: -1,
        datosUsuario: {usuario_correo:'',usuario_contrasena:''},
        datosAdmin: {
            administrador_nombre:'',
            },
        datosProf: {
            profesor_nombre:'',
            },
        datosAlum: {
            alumno_nombre: '',
        },
        nameRules: [
          v => !!v || 'Campo obligatorio',
        ],
        passRules: [
          v => (v && v.length > 7) || 'La contraseña es obligatoria y debe tener al menos 8 caracteres',
        ],
      emailRules: [
          v => /.+@.+\..+/.test(v) || 'Debe tener el formato ejem@ejem.com',
      ],
        editedItem: {
          id: 0,
          nombre: '',
          correo: '',
          contrasena: '',
          tipo: 0,
          idtipo:0,
        },
        dialogDelete: false,
        search: '',
        itemId: 0, 
        headers: [
          {
            text: 'ID',
            align: 'start',
            sortable: false,
            value: 'id',
          },
          { text: 'Nombre', value: 'nombre' },
          { text: 'Correo', value: 'correo' },
          {text:'Acciones',value:'actions',sortable:false},
        ],
        datosResponse : null,
        datosTabla: [],
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo usuario' : 'Editar usuario'
      },
    },
    methods:{
      editItem (item) {
        this.editedIndex = this.datosTabla.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true

      },
      closeDelete () {
        this.dialogDelete = false
      },
      cancel () {
        this.dialog = false
      },
      deleteItem (item){
        this.itemId = item.id
        this.dialogDelete= true
      },
      confirmDelete(){
        const path = `${this.$hostname}/backtablas/usuarios/${this.itemId}/`
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
      actualizar(){
        this.datosUsuario.usuario_correo = this.editedItem.correo
        this.datosUsuario.usuario_contrasena = this.editedItem.contrasena
        const pathEnvia = `${this.$hostname}/backtablas/envia`
        let datoscorreo = new FormData()
        datoscorreo.append("correo",this.editedItem.correo)
        datoscorreo.append("contrasena",this.editedItem.contrasena)
        datoscorreo.append("mensaje","actualizados")
        datoscorreo.append("idU",this.editedItem.id)
        const path = `${this.$hostname}/backtablas/usuarios/${this.editedItem.id}/`
        const pathAd = `${this.$hostname}/backtablas/administradores/${this.editedItem.idtipo}/`
        const pathPr = `${this.$hostname}/backtablas/profesores/${this.editedItem.idtipo}/`
        const pathAl = `${this.$hostname}/backtablas/alumnos/${this.editedItem.idtipo}/`
        axios.put(path,this.datosUsuario).then((response) =>{
          console.log(response.data)
          if(this.editedItem.tipo=='Administrador'){
            this.datosAdmin.administrador_nombre = this.editedItem.nombre
            axios.patch(pathAd,this.datosAdmin).then((response) => {
                console.log("Administrador Actualizado",response.data)
                axios.post(pathEnvia,datoscorreo).then((response) => {
                  console.log(response.data)
                  this.$emit("actualizarTabla",1)
                })
                .catch((error) => {
                  console.log(error)
                this.$emit("actualizarTabla",-1)
                })
            })
            .catch((error) => {
                console.log(error)
                this.$emit("actualizarTabla",-1)
            })
        }else if(this.editedItem.tipo=='Profesor'){
            this.datosProf.profesor_nombre = this.editedItem.nombre
            axios.patch(pathPr,this.datosProf).then((response) => {
                console.log("Profesor Actualizado",response.data)
                axios.post(pathEnvia,datoscorreo).then((response) => {
                  console.log(response.data)
                  this.$emit("actualizarTabla",1)
                })
                .catch((error) => {
                  console.log(error)
                this.$emit("actualizarTabla",-1)
                })
            })
            .catch((error) => {
                console.log(error)
                this.$emit("actualizarTabla",-1)
            })
        }else{
            
            this.datosAlum.alumno_nombre = this.editedItem.nombre
            axios.patch(pathAl,this.datosAlum).then((response) => {
                console.log("Alumno Actualizado",response.data)
                axios.post(pathEnvia,datoscorreo).then((response) => {
                  console.log(response.data)
                  this.$emit("actualizarTabla",1)
                })
                .catch((error) => {
                  console.log(error)
                this.$emit("actualizarTabla",-1)
                })               
            })
            .catch((error) => {
                console.log(error)
                this.$emit("actualizarTabla",-1)
            })
        }


        })
        .catch((error) =>{
          console.log(error)
          this.$emit("actualizarTabla",-1)
        })
        this.dialog = false
      },

    },
    mounted () {
     const path = `${this.$hostname}/backtablas/listado`
     axios.get(path).then((response) => {
       this.datosResponse = response.data
       for (let i = 0; i < this.datosResponse.length; i++) {
         this.datosTabla.push({"id":this.datosResponse[i].id,
                               "nombre":this.datosResponse[i].nombre,
                               "correo":this.datosResponse[i].correo,
                               "contrasena":this.datosResponse[i].contrasena,
                               "tipo":this.datosResponse[i].tipo,
                               "idtipo":this.datosResponse[i].idtipo})
         
       }
       
     })
     .catch((error) => {
       console.log(error)
     }) 
    },
    
}
</script>

<style>
.encab{
    border: 1px solid gray;
}
.my-data-table {
  display: flex;
  flex-direction: column;
}

.my-data-table .v-datatable.v-table {
  order: -1;
}
</style>
