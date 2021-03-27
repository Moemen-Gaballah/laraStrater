<template>
    <div class="container">
        <div class="row mt-5" v-if="$gate.isAdminOrAuthor()">
          <div class="col-md-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Users Table</h3>

                <div class="card-tools">
                    <button class="btn btn-success" @click="newModel">
                    <!-- <button class="btn btn-success" data-toggle="modal" data-target="#addNew"> -->
                        Add New
                        <i class="fas fa-user-plus fa-fw"></i>
                    </button>
                </div>
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Registered At</th>
                      <th>Modify</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users.data" :key="user.id">
                      <td>{{ user.id }}</td>
                      <td>{{ user.name }}</td>
                      <td>{{ user.email }}</td>
                      <td>{{ user.type | upperCase }}</td>
                      <td>{{ user.created_at | humanDateFilter }}</td>
                      <td>
                        <a href="#">
                            <i class="fa fa-edit blue" @click="editModel(user)"></i>
                        </a> /
                        <a href="#" @click="deleteUser(user.id)">
                            <i class="fa fa-trash red"></i>
                        </a>
                      </td>
                    </tr>


                  </tbody>
                </table>
              </div>
              <!-- /.card-body -->
              <div class="card-footer">
                  <pagination :data="users" @pagination-change-page="getResults"></pagination>
              </div>
            </div>
            <!-- /.card -->
          </div>
        </div>
        <div  v-if="!$gate.isAdminOrAuthor()">
            <not-found></not-found>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="addNew" tabindex="-1" aria-labelledby="addNewLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">

                <h5 class="modal-title" v-if="!editmode" id="addNewLabel">Add New</h5>
                <h5 class="modal-title" v-else="editmode" id="addNewLabel">Update User</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
               <!-- start modal body-->
               <form @submit.prevent="editmode ? updateUser() : createUser()">
                  <div class="modal-body">

                      <div class="form-group">
                        <input v-model="form.name" type="text" name="name" placeholder="Name:"
                          class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                        <has-error :form="form" field="name"></has-error>
                      </div>

                      <div class="form-group">
                        <input v-model="form.email" type="text" name="email" placeholder="Email:"
                          class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                        <has-error :form="form" field="email"></has-error>
                      </div>

                      <div class="form-group">
                        <textarea v-model="form.bio" type="text" name="bio" placeholder="Short bio for user (Optional)"
                          class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
                        <has-error :form="form" field="bio"></has-error>
                      </div>

                      <div class="form-group">
                        <select name="type" v-model="form.type" id="type" class="form-control" :class="{'is-invalid' : form.errors.has('type')}">
                            <option value="">Select User Role</option>
                            <option value="admin">Admin</option>
                            <option value="user">Standard User</option>
                            <option value="author">Author</option>
                        </select>
                        <has-error :form="form" field="type"></has-error>
                      </div>

                      <div class="form-group">
                        <input v-model="form.password" type="password" name="password" id="password" placeholder="Password min 8 charaters"
                          class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                        <has-error :form="form" field="password"></has-error>
                      </div>

                  </div> <!-- End of model-body -->

                  <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    <button v-if="editmode" type="submit" class="btn btn-success">Update</button>
                    <button v-else="!editmode" type="submit" class="btn btn-primary">create</button>
                  </div>
              </form>
            </div>
          </div>
        </div>

    </div>

</template>

<script>
    export default {
        data () {
            return {
                editmode: true,
                users: {},
                form: new Form({
                    id: '',
                    name: '',
                    email: '',
                    password: '',
                    type: '',
                    bio: '',
                    photo: ''
                })
            }
        },
        methods: {
            // Our method to GET results from a Laravel endpoint
    		getResults(page = 1) {
    			axios.get('api/user?page=' + page)
    				.then(response => {
    					this.users = response.data;
    				});
    		},
            updateUser() {
                this.$Progress.start()
                this.form.put('api/user/'+this.form.id)
                .then(() =>{
                    $('#addNew').modal('hide')
                    Swal.fire(
                      'Updated!',
                      'User has been Updated.',
                      'success'
                    )
                    Fire.$emit('updateUsersList')
                    this.$Progress.finish();
                })
                .catch(() => {
                    this.$Progress.fail();
                });
            },
            newModel() {
                this.editmode = false;
                this.form.reset();
                $('#addNew').modal('show');
            },
            editModel(user) {
                this.editmode = true;
                this.form.reset();
                $('#addNew').modal('show');
                this.form.fill(user)
            },
            deleteUser(id) {
                Swal.fire({
                  title: 'Are you sure?',
                  text: "You won't be able to revert this!",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    // Send request to the server
                    if (result.isConfirmed) {
                        this.form.delete('/api/user/'+id).then(() => {
                            $('#addNew').modal('hide')
                            Swal.fire(
                                'Deleted!',
                                'User has been deleted.',
                                'success'
                            )
                            Fire.$emit('updateUsersList')
                        }).catch(() => {
                            // Swal('Failed!', 'There was something wrong.', "warning");
                            Swal.fire({
                              icon: 'error',
                              title: 'Oops...',
                              text: 'Something went wrong!'
                            })
                        });

                    }
                })
            },
            loadUsers() {
                if(this.$gate.isAdminOrAuthor()){
                    axios.get("api/user").then(({data}) => (this.users = data));
                }
            },
            createUser() {
                this.$Progress.start()
                this.form.post('api/user').then(() => {
                    Fire.$emit('updateUsersList')
                    $('#addNew').modal('hide')
                    Toast.fire({
                      icon: 'success',
                      title: 'User Created successfully'
                    })
                    this.$Progress.finish();
                }).catch(() => {
                    this.$Progress.fail();
                })
            }
        },
        created() {
            Fire.$on('searching', () => {
                let query = this.$parent.search;
                axios.get('api/findUser?q='+ query)
                .then((data) => {
                    this.users = data.data ;
                })
                .catch(() => {

                })
            });

            this.loadUsers();
            Fire.$on('updateUsersList', () => {
                this.loadUsers();
            });
            // get data every 3 second
            // setInterval(() => this.loadUsers(), 3000);
        }
    }
</script>
