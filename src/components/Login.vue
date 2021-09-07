<template>
        <v-container fluid fill-height>
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md4>
                  <div>
                    <template>
                        <div class="text-center">
                            <v-snackbar
                            v-model="snackbar"
                            :timeout="timeout"
                            :value="true"
                            color="green"
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
                  <v-card class="elevation-12">
                     <v-toolbar dark color="primary">
                        <v-toolbar-title>Inicio de sesión</v-toolbar-title>
                     </v-toolbar>
                     <v-card-text>
                        <v-form
                          ref="form"
                        >
                           <v-tooltip right
                           color="red">
                           <template v-slot:activator="{ on, attrs }">
                           <v-text-field
                              v-bind="attrs"
                              v-on="on"
                              v-model="login"
                              prepend-icon="mdi-account"
                              name="login"
                              label="ID"
                              type="text"
                              :rules="ruleLogin"
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
                              v-model="password"
                              id="password"
                              prepend-icon="mdi-lock"
                              name="password"
                              label="Contraseña"
                              type="password"
                              :rules="rulePass"
                              required
                           ></v-text-field>
                           </template>
                           <span>La contraseña es obligatoria y debe tener al menos 8 caracteres</span>
                           </v-tooltip>
                        </v-form>
                     </v-card-text>
                     <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" to="/" @click="validate">Iniciar Sesión</v-btn>
                     </v-card-actions>
                  </v-card>
               </v-flex>
            </v-layout>
         </v-container>
</template>

<script>
import axios from 'axios'
//import jwt_decode from 'jwt-decode'
export default {
   name: 'Login',
   props: {
      source: String,
   },
   data: () => ({
      login : '',
      password:'',
      snackbar: false,
      text: 'ID del usuario o contraseña incorrecta',
      timeout: 3000,
      formulario:{correo:'',contrasena:''},
      ruleLogin: [
        v => !!v || 'El ID es obligatorio',
        
      ],
      rulePass: [
        v => (v && v.length > 7) || 'La contraseña es obligatoria y debe tener al menos 8 caracteres',
      ],
    }),
    methods: {
      validate (evt) {
        evt.preventDefault()
        let vari = this.$refs.form.validate()
        if(vari==true){
            this.buscarCmps()
        }
      },
      buscarCmps(){
          const path=`${this.$hostname}/backtablas/autentificar`
          let datosLogin =new FormData()
          datosLogin.append("id",this.login)
          datosLogin.append("contrasena",this.password)
          axios.post(path,datosLogin).then((response)=> {
             if(response.data==0){
                console.log("incorrecto")
                this.snackbar = true
             }else if(response.data==-1){
                this.text="El usuario no existe"
                console.log("no existe")
                this.snackbar = true
             }else{
                let token = response.data
                this.$session.start()
                this.$session.set('jwt',token)
                //Vue.http.headers.common['Authorization'] = 'Bearer ' + token          
                this.$router.push({name:'VistaPerfil'})
             }
             
          })
          .catch((error)=>{
             this.snackbar = true
             console.log(error)
          })
          /**const path=`${this.$hostname}/backtablas/usuarios/${this.login}/`
          axios.get(path).then((response) => {
              this.formulario.contrasena = response.data.usuario_contrasena
              console.log(this.formulario.contrasena,this.password)
              console.log(response.status)
              if(this.formulario.contrasena==this.password){
                  let userInfo = response.data.usuario_correo
                  this.$router.push({name:'VistaPerfil', params:{userInfo}})
              }else{
                  this.snackbar = true
              }
          })
          .catch((error) => {
              this.snackbar = true
              console.log(error.response)
          })**/
      },
    }
};
</script>

<style>
</style>
