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
      <v-toolbar-title>Agregar curso</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
  <v-card-text>
  <v-form
    ref="form"
    lazy-validation
  >
    <v-text-field
      v-model="datosForm.nombre"
      :rules="nameRules"
      label="Nombre"
      required
    ></v-text-field>
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
    <v-btn
      color="blue"
      class="mr-4"
      @click="validate"
    >
      Guardar
    </v-btn>
        <v-btn
      color="blue"
      class="mr-4"
      @click="guardarCurso"
    >
      Probar
    </v-btn>
  </v-form>
  </v-card-text>
  </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'
//axios.defaults.xsrfHeaderName = "X-CSRFToken"
//axios.defaults.xsrfCookieName = "csrftoken"
export default {
   name: 'AgregarCurso',
   data: () => ({
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
        validate (evt) {
        evt.preventDefault()
        let vari = this.$refs.form.validate()
        if(vari==true){
            this.guardarCurso()
        }
      },
      guardarCurso(){
          let curso = new FormData()
          curso.append("nombre",this.datosForm.nombre)
          curso.append("semestre",this.datosForm.semestre)
          curso.append("carrera",this.datosForm.carrera)
          curso.append("idprofesor",this.datosForm.profesor)
          var crftoken = Cookies.get('csrftoken')
          console.log(crftoken)
          const path = `http://localhost:8000/backtablas/guarda`
          axios.post(path,curso).then((response) => {
            console.log(response.data)
            this.$emit("agregarTabla",1)
          })
          .catch((error)=>{
            console.log(error)
            this.$emit("agregarTabla",-1)
          })
      }
    },
    mounted(){
        const path = `http://localhost:8000/backtablas/profesores/`
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
