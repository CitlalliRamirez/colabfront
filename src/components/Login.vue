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
                           <v-text-field
                              v-model="login"
                              prepend-icon="mdi-account"
                              name="login"
                              label="ID"
                              type="text"
                              :rules="ruleLogin"
                              required
                           ></v-text-field>
                           <v-text-field
                              v-model="password"
                              id="password"
                              prepend-icon="mdi-lock"
                              name="password"
                              label="Contraseña"
                              type="password"
                              :rules="rulePass"
                              required
                           ></v-text-field>
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
          const path=`http://localhost:8000/backtablas/usuarios/${this.login}/`
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
          })
      },
    }
};
</script>

<style>
</style>
