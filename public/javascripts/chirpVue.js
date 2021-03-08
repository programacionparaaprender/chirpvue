window.onload = function () {
    const Test = Vue.component('testcomponent',{
        template : '<div v-on:mouseover = "changename()" v-on:mouseout = "originalname();"><h1>Custom Component created by <span id = "name">{{name}}</span></h1></div>',
        data: function() {
           return {
              name : "Ria"
           }
        },
        methods:{
           changename : function() {
              this.name = "Ben";
           },
           originalname: function() {
              this.name = "Ria";
           }
        }
     });



    const Foo = { template: `<div>This is the component for the Foo route</div>` }
    const Login = { template: `<div>This is the component for the Foo route</div>` }
const router = new VueRouter({
    routes: [
       { path: '/foo', component: Foo},
       { path: '/login', component: Test},
       { path: '/register', component: Foo}
    ]
})

/* const routerExample = new Vue({
    router
}).$mount('#main') */

new Vue({
    router,
    el:"#main",
    data:{
        authenticated:false,
        name:"Luis Correa",
        contactos:[],
        current_user: '',
        libros:[
            { 
                id:1,
                nombre: "Libro 1",
                descripcion: "Descripción de libro 1",
                ruta: "//path//",
                precio:200
            },
            { 
                id:2,
                nombre: "Libro 2",
                descripcion: "Descripción de libro 2",
                ruta: "//path//",
                precio:200
            }
        ]
    },
    mounted(){

    },
    methods:{
        signout:function(){
            fetch('auth/signout')
            .then(response => {
                response.json()
            })
            .then(data => console.log(data));
    	    this.authenticated = false;
    	    this.current_user = '';
        }
    }
}).$mount('#main')

}


