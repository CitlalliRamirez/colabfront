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
      <v-toolbar-title>Agregar usuario</v-toolbar-title>
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

    <v-tooltip right
    color="red">
    <template v-slot:activator="{ on, attrs }">
    <v-text-field 
      v-bind="attrs"
      v-on="on"
      v-model="datosForm.correo"
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
      v-model="datosForm.contrasena"
      :rules="passRules"
      label="Contraseña"
      required
    ></v-text-field>
    </template>
    <span>La contraseña es obligatoria y debe tener al menos 8 caracteres</span>
    </v-tooltip>

    <v-select
      @change="ocultarSelect()"
      v-model="select"
      :items="items"
      :rules="[v => !!v || 'Campo obligatorio']"
      label="Tipo de usuario"
      required
    ></v-select>

    <v-select
      v-model="datosForm.semestre"
      :items="items2"
      :rules="[v => !!v || 'Campo obligatorio']"
      label="Semestre"
      v-if = "ocultar"
      required
    ></v-select>

    
    <v-select
      v-model="datosForm.carrera"
      :items="items3"
      :rules="[v => !!v || 'Campo obligatorio']"
      label="Carrera"
      v-if = "ocultar"
      required
    ></v-select>


    <v-btn
      color="blue"
      class="mr-4"
      @click="validate"
    >
      Guardar
    </v-btn>
  </v-form>
  </v-card-text>
  </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
   name: 'AgregarUsuario',
   data: () => ({
      ocultar: false,
      idU: 0,
      datosUsuario: {usuario_correo:'',usuario_contrasena:''},
      datosAdmin: {
          administrador_nombre:'',
          usuario:0
          },
      datosProf: {
          profesor_nombre:'',
          usuario:0
          },
      datosAlum: {
          alumno_nombre: '',
          alumno_semestre: '',
          alumno_carrera: '',
          usuario:0
      },
      datosForm: {nombre:'',correo:'',contrasena:'',semestre:'',carrera:''},
      name: '',
      nameRules: [
        v => !!v || 'Campo obligatorio',
      ],
      passRules: [
        v => (v && v.length > 7) || 'La contraseña es obligatoria y debe tener al menos 8 caracteres',
      ],
      email: '',
      emailRules: [
    v => /.+@.+\..+/.test(v) || 'Debe tener el formato ejem@ejem.com',
      ],
      select: null,
      items: [
        'Alumno',
        'Profesor',
        'Administrador',
      ],
      items2: [
        'Primero',
        'Segundo',
        'Tercero',
        'Cuarto',
        'Quinto',
        'Sexto',
        'Séptimo',
      ],
      items3: [
        'Ing. Computación',
        'Ing. Industrial',
        'Ing. Civil',
      ],
      checkbox: false,
    }),

    methods: {
      ocultarSelect (){
        if(this.select=='Alumno'){
            this.ocultar = true
        }else{
            this.ocultar = false
        }
      },
      validate (evt) {
        evt.preventDefault()
        let vari = this.$refs.form.validate()
        if(vari==true){
            this.guardarUsuario()
        }
      },
    guardarUsuario (){
        const pathU = `${this.$hostname}/backtablas/usuarios/`
        const pathAd = `${this.$hostname}/backtablas/administradores/`
        const pathPr = `${this.$hostname}/backtablas/profesores/`
        const pathAl = `${this.$hostname}/backtablas/alumnos/`

        this.datosUsuario.usuario_correo = this.datosForm.correo
        this.datosUsuario.usuario_contrasena = this.datosForm.contrasena
        axios.post(pathU,this.datosUsuario).then((response) => {
            this.idU = response.data.id
            if(this.select=='Administrador'){
            this.datosAdmin.administrador_nombre = this.datosForm.nombre
            this.datosAdmin.usuario = this.idU
            axios.post(pathAd,this.datosAdmin).then((response) => {
                console.log("Administrador Registrado",response.data.id)
                this.$refs.form.reset()
                this.$emit("agregarTabla",1)
            })
                .catch((error) => {
                console.log(error)
                this.$emit("agregarTabla",-1)
            })
        }else if(this.select=='Profesor'){
            this.datosProf.profesor_nombre = this.datosForm.nombre
            this.datosProf.usuario = this.idU
            axios.post(pathPr,this.datosProf).then((response) => {
                console.log("Profesor Registrado",response.data.id)
                this.$refs.form.reset()
                this.$emit("agregarTabla",1)
            })
                .catch((error) => {
                console.log(error)
                this.$emit("agregarTabla",-1)
            })
        }else{
            this.datosAlum.alumno_nombre = this.datosForm.nombre
            this.datosAlum.alumno_semestre = this.datosForm.semestre
            this.datosAlum.alumno_carrera = this.datosForm.carrera
            this.datosAlum.usuario = this.idU
            axios.post(pathAl,this.datosAlum).then((response) => {
                console.log("Alumno Registrado",response.data.id)
                this.$refs.form.reset()
                this.$emit("agregarTabla",1)
            })
                .catch((error) => {
                console.log(error)
                this.$emit("agregarTabla",-1)
            })
        }

        })
        .catch((error) => {
            console.log(error)
            this.$emit("agregarTabla",-1)
        })
        
    }
    },

}
</script>

<style>
</style>
