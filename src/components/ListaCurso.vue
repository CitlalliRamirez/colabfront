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
      <v-toolbar-title>Lista de cursos</v-toolbar-title>
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
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
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
                      v-model="editedItem.nombre"
                      :rules="nameRules"
                      label="Nombre"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.semestre"
                      label="Semestre"
                      disabled
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.carrera"
                      label="Carrera"
                      disabled
                    ></v-text-field>
                   <v-select
                        v-model="editedItem.profesor"
                        :items="items3"
                        item-text="nombre"
                        item-value="id"
                        :rules="[v => !!v || 'Campo obligatorio']"
                        label="Profesor"
                        required
                    ></v-select>
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
          Eliminar curso
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
   name: 'ListaCurso',
   data: () => ({
        dialog: false,
        editedIndex: -1,
        items3:[],
        datosCurso: {curso_nombre:'',profesor:0},
        nameRules: [
          v => !!v || 'Campo obligatorio',
        ],
        editedItem: {
          nombre: '',
          semestre: '',
          carrera: '',
          profesor: 0,
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
          {text:'Acciones',value:'actions',sortable:false},
        ],
        datosResponse : null,
        datosTabla: [],
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo curso' : 'Editar curso'
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
      confirmDelete(){ //eliminar de cursos
        const path = `${this.$hostname}/backtablas/cursos/${this.itemId}/`
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
          this.datosCurso.curso_nombre = this.editedItem.nombre
          this.datosCurso.profesor = this.editedItem.profesor
          const path = `${this.$hostname}/backtablas/cursos/${this.editedItem.id}/`
          
          axios.put(path,this.datosCurso).then((response) =>{
            console.log(response.data)
            this.$emit("actualizarTabla",1)
        })
        .catch((error) =>{
          console.log(error)
          this.$emit("actualizarTabla",-1)
        })
        this.dialog = false
      },

    },
    mounted () {
     const path = `${this.$hostname}/backtablas/listadocurso`
     axios.get(path).then((response) => {
       this.datosResponse = response.data
       for (let i = 0; i < this.datosResponse.length; i++) {
         this.datosTabla.push({"id":this.datosResponse[i].id,
                               "nombre":this.datosResponse[i].nombre,
                               "semestre":this.datosResponse[i].semestre,
                               "carrera":this.datosResponse[i].carrera,
                               "profesor":this.datosResponse[i].idprofesor})
         
       }
       
     })
     .catch((error) => {
       console.log(error)
     })
     const pathP = `${this.$hostname}/backtablas/profesores/`
        axios.get(pathP).then((response) => {
            this.datosResponse = response.data
            console.log(this.datosResponse)
            for (let i = 0; i < this.datosResponse.length; i++) {
            this.items3.push({"id":this.datosResponse[i].id,
                            "nombre":this.datosResponse[i].profesor_nombre})
         
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
</style>
