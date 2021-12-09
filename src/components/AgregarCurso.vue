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
      <v-toolbar-title>Registrar curso</v-toolbar-title>
      <v-spacer></v-spacer>
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
      v-model="datosForm.semestre"
      :items="items"
      :rules="[v => !!v || 'Campo obligatorio']"
      label="Semestre"
      required
    ></v-select>

    <v-select
      v-model="datosForm.carrera"
      :items="items2"
      :rules="[v => !!v || 'Campo obligatorio']"
      label="Carrera"
      required
    ></v-select>

    <v-select
      v-model="datosForm.profesor"
      :items="items3"
      item-text="nombre"
      item-value="id"
      :rules="[v => !!v || 'Campo obligatorio']"
      label="Profesor"
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
          Precaución: Minímo 4 alumnos.
        </v-card-title>
        <v-card-text>El curso no se registrará, porque no hay alumnos suficientes que coincidan con el semestre y carrera seleccionada, registrar más usuarios o seleccione otra carrera y/o semestre</v-card-text>
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
import Cookies from 'js-cookie'
export default {
   name: 'AgregarCurso',
   data: () => ({
     dialogDelete: false,
      datosForm: {nombre:'',semestre:'',carrera:'',profesor:''},
      datosCurso: {curso_nombre:'',profesor:0},
      datosAC:{curso:0,alumno:0},
      alumnos:[],
      name: '',
      nameRules: [
        v => !!v || 'Campo obligatorio',
      ],
      items: [
        'Primero',
        'Segundo',
        'Tercero',
        'Cuarto',
        'Quinto',
        'Sexto',
        'Séptimo',
        'Octavo',
        'Noveno',
        'Décimo',
      ],
      items2: [
        'Ing. Computación',
        'Ing. Industrial',
        'Ing. Civil',
      ],
      items3: [],
    }),

    methods: {
        close () {
          this.dialogDelete = false
        },
        validate (evt) {
        evt.preventDefault()
        let vari = this.$refs.form.validate()
        if(vari==true){
            this.guardarCurso()
        }
      },
      cancelar(){
        this.$refs.form.reset()
        this.$root.$emit("inicio") //devuelva a la pagina de inicio
      },
      guardarCurso(){
          let curso = new FormData()
          curso.append("nombre",this.datosForm.nombre)
          curso.append("semestre",this.datosForm.semestre)
          curso.append("carrera",this.datosForm.carrera)
          curso.append("idprofesor",this.datosForm.profesor)
          var crftoken = Cookies.get('csrftoken')
          console.log(crftoken)
          const path = `${this.$hostname}/backtablas/guarda`
          axios.post(path,curso).then((response) => {
            console.log(response.data) 
            if(response.data=='ok'){
                this.$refs.form.reset()
                this.$emit("agregarTabla",2)
                this.$root.$emit("actualizaSelect")
            }else{
                this.dialogDelete = true
            }
          })
          .catch((error)=>{
            console.log(error)
            this.$emit("agregarTabla",-1)
          })
      }
    },
    mounted(){
        const path = `${this.$hostname}/backtablas/profesores/`
        axios.get(path).then((response) => {
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
</style>
