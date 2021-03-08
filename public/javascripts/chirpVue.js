window.onload = function () {

    const metodo = new Vue();
    if(window.localStorage.getItem('authenticated'))    {
        const varbool = window.localStorage.getItem('authenticated')
        console.log(window.localStorage.getItem('authenticated'))
        console.log(varbool)
        Vue.prototype.$authenticated = varbool
    }
    else
        Vue.prototype.$authenticated = 'false'
    
    if(window.localStorage.getItem('current_user'))
        Vue.prototype.$current_user= window.localStorage.getItem('current_user')
    else
        Vue.prototype.$current_user= ''

    const Login = Vue.component('logincomponent',{
        template : '<div class="card card-default" style="width:30rem; margin:auto;padding:1rem;">'
        +'<form class="form-auth" v-on:submit.prevent="login()">'
        +'<h2>Log In</h2>'
        +'<p class="text-warning">{{error_message}}</p>'
        +'<input type="username" v-model="user.username" placeholder="Username" class="form-control"><br>'
        +'<input type="password" v-model="user.password" placeholder="Password" class="form-control"><br>'
        +'<input type="submit" value="Log in" class="btn btn-primary btn-lg" />'
        +'</form>'
        +'</div>',
        data: function() {
           return {
                user: {username: '', password: ''},
                error_message: '',
                name : "Ria",
                template_antiguo: '<div v-on:mouseover = "changename()" v-on:mouseout = "originalname();"><h1>Custom Component created by <span id = "name">{{name}}</span></h1></div>',
           }
        },
        methods:{
            login: async function(){
                try{
                    const response = await axios.post('/auth/login', this.user);
                    if(response.status == 200){
                        this.$authenticated = 'true';
                        this.$current_user = this.user.username;
                        window.localStorage.setItem('authenticated', 'true')
                        window.localStorage.setItem('current_user', this.user.username)
                        //location.reload();
                        metodo.$emit("actualizarMatriz", {
                            authenticated: 'true',
                            current_user: this.user.username
                        });
                        metodo.$emit("actualizarMain", {
                            authenticated: 'true',
                            current_user: this.user.username
                        });
                        this.$router.push('/');
                        
                    }
                    else{
                        this.error_message = data.message;
                    }
                }catch(error){
                    console.log(error)
                }
            }
        }
     });
     const Register = Vue.component('registercomponent',{
        template : '<div class="card card-default" style="width:30rem; margin:auto;padding:1rem;">'
        +'<form class="form-auth" v-on:submit.prevent="register()">'
        +'<h2>Register</h2>'
        +'<p class="text-warning">{{error_message}}</p>'
        +'<input type="username" v-model="user.username" placeholder="Username" class="form-control"><br>'
        +'<input type="password" v-model="user.password" placeholder="Password" class="form-control"><br>'
        +'<input type="submit" value="Register" class="btn btn-primary btn-lg" />'
        +'</form>'
        +'</div>',
        data: function() {
           return {
                user: {username: '', password: ''},
                error_message: ''
           }
        },
        methods:{
            register: async function(){
                try{
                    const response = await axios.post('/auth/signup', this.user);
                    if(response.status == 200){
                        this.$authenticated = 'true';
                        this.$current_user = data.user.username;
                        window.localStorage.setItem('authenticated', 'true')
                        window.localStorage.setItem('current_user', this.user.username)
                        metodo.$emit("actualizarMatriz", {
                            authenticated: 'true',
                            current_user: this.user.username
                        });
                        metodo.$emit("actualizarMain", {
                            authenticated: 'true',
                            current_user: this.user.username
                        });
                        this.$router.push('/');
                    }else{
                        this.error_message = data.message;
                      }
                }catch(error){
                    console.log(error)
                }
                
            }
        }
     });
     const Main = Vue.component('maincomponent',{
        template : `<div class="card card-default" style="width:30rem; margin:auto;padding:1rem;">`
        +`<div class="clearfix">`
        +`<form class="form-auth" v-on:submit.prevent="post()" v-show="authenticated!='false'">`
        +`<h4>{{current_user}} says</h4>`
        +`<textarea required class="form-control" maxlength="200" rows="3" placeholder="Say something" v-model="newPost.text"></textarea>`
        +`<input class="btn submit-btn pull-right btn-lg" type="submit" value="Chirp!" />`
        +`</form>`
        +`</div>`
        +`<div id="post-stream">`
        +`<h4>Chirp Feed</h4>`
        +`<div class="post" v-for="(post, index) in posts">` 
        +`<p>{{post.text}}</p>`
        +`<small>Posted by @{{post.created_by}}</small>`
        +`<small class="pull-right">{{ post.created_at }}</small>`
        +`</div>`
        +`</div>`
        +`</div>`,
        data: function() {
           return {
                authenticated:"false",
                current_user:"",
                posts: {},
                newPost: {
                    created_by: '', 
                    text: '',
                    created_at: ''
                }
           }
        },
        computed:{
            /* authenticated(){
                //console.log('authenticated: '+String(window.localStorage.getItem('authenticated')))
                return String(window.localStorage.getItem('authenticated'));
            }, 
            current_user(){
                return String(window.localStorage.getItem('current_user'));
            } */
        },
        async mounted(){
            this.authenticated = String(window.localStorage.getItem('authenticated'));
            this.current_user = String(window.localStorage.getItem('current_user'));
            
            metodo.$on("actualizarMain", data => {
                this.actualizar(data.authenticated, data.current_user)
            });
            console.log('usuario es: ' + this.$current_user)
            await this.obtenerPosts();
        },
        methods:{
            actualizar(authenticated, current_user){
                this.authenticated = authenticated;
                this.current_user = current_user;
            },
            obtenerPosts:async function(){
                try{
                    const response = await axios.get('/api/posts');
                    if(response.status == 200){
                        this.posts = response.data;
                    } 
                }catch(error){
                    console.log(error)
                }
                
            },
            post: async function() {
                try{
                    this.newPost.created_by = this.$current_user;
                    this.newPost.created_at = Date.now();
                    const response = await axios.post('/api/posts', this.newPost);
                    if(response.status == 200){
                        this.posts = this.newPost;
                        this.newPost = {created_by: '', text: '', created_at: ''};
                        await this.obtenerPosts();
                    }
                }catch(error){
                    console.log(error)
                }
            }
        }
     });

    const Foo = { template: `<div>This is the component for the Foo route</div>` }
//mode: 'history',
    const router = new VueRouter({
        
    routes: [
        { path: '/', component: Main},
        { path: '/foo', component: Foo},
        { path: '/login', component: Login},
        { path: '/register', component: Register}
    ]
})

/* const routerExample = new Vue({
    router
}).$mount('#main') */



new Vue({
    router,
    el:"#main",
    data:{
        authenticated:"false",
        current_user:""
    },
    computed:{
        /* authenticated(){
            return String(window.localStorage.getItem('authenticated'));
        }, 
        current_user(){
            return String(window.localStorage.getItem('current_user'));
        }  */
    },
    mounted(){
        console.log(this.$authenticated)
        this.authenticated = window.localStorage.getItem('authenticated')
        this.current_user = window.localStorage.getItem('current_user')
        metodo.$on("actualizarMatriz", data => {
            this.actualizar(data.authenticated, data.current_user)
        });
    },
    updated(){
        //this.authenticated = window.localStorage.getItem('authenticated')
        //this.current_user = window.localStorage.getItem('current_user')
    },
    methods:{
        actualizar(authenticated, current_user){
            this.$authenticated = authenticated;
            this.$current_user = current_user;
            window.localStorage.setItem('authenticated', authenticated)
            window.localStorage.setItem('current_user', current_user)
            this.authenticated = authenticated;
            this.current_user = current_user;
        },
        signout:async function(){
            try{
                const response = await axios.get('/auth/signout');
                //console.log(JSON.stringify(response))
                
                if(response.status == 200){
                    //console.log(response.status)
                    this.$authenticated = 'false';
    	            this.$current_user = '';
                    window.localStorage.setItem('authenticated', 'false')
                    window.localStorage.setItem('current_user', '')
                    this.authenticated = 'false'
                    this.current_user = ''
                    metodo.$emit("actualizarMain", {
                        authenticated: 'false',
                        current_user: ''
                    });
                    //location.reload();
                    //this.$router.push('/');
                    //console.log(String(window.localStorage.getItem('authenticated')));
                    //console.log(String(window.localStorage.getItem('current_user')));
                } 
            }catch(error){
                console.log(error)
            }
    	    
        }
    }
}).$mount('#main')

}


