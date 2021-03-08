<template>
    <div class="card card-default" style="width:30rem; margin:auto;padding:1rem;">
        <div class="clearfix">
            <form class="form-auth" v-on:submit.prevent="post()" v-show="authenticated!='false'">
                <h4>{{current_user}} says</h4>
                <textarea required class="form-control" maxlength="200" rows="3" placeholder="Say something" v-model="newPost.text"></textarea>
                <input class="btn submit-btn pull-right btn-lg" type="submit" value="Chirp!" />
            </form>
        </div>
        <div id="post-stream">
            <h4>Chirp Feed</h4>
            <div v-bind:key="index" class="post" v-for="(post, index) in posts"> 
                <p>{{post.text}}</p>
                <small>Posted by @{{post.created_by}}</small>
                <small class="pull-right">{{ post.created_at }}</small>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:"Main",
    data(){
        return{
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
}
</script>

<style>

</style>