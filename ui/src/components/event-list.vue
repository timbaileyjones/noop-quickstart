<template>
  <div class="container">
    <b-card title="Events currently being served">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Aisle</th>
            <th scope="col">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.id">
            <th scope="row">{{ event.id }}</th>
            <td>{{ event.name }}</td>
            <td>{{ event.aisle }}</td>
            <td><button class="btn-danger" @click.stop="stopServing(event.id)">Stop Serving</button></td>
          </tr>
        </tbody>
        <tr>
          <td><b-form-input v-model="id" placeholder="abc123"></td>
          <td><b-form-input v-model="name" placeholder="Fancy cheese on a toothpick"></td>
          <td><b-form-input v-model="aisle" placeholder="5"></td>
          <td><button class="btn-primary" @click.stop="startServing">Start Serving</button></td>
        </tr>
      </table>
    </b-card>
  </div>
</template>

<script>
import { addEvent, listEvents, removeEvent } from '@/api'
export default {
  created () {
    this.getEvents()
  },
  data () {
    return {
      id: '',
      name: '',
      aisle: '',
      events: []
    }
  },
  methods: {
    getEvents () {
      listEvents().then(response => {
        this.events = response.data
      }).catch(err => {
        alert(`Failed to get list of events: ${err.message}`)
      })
    },
    startServing () {
      addEvent(this.id, this.name, this.aisle).then(response => {
        this.id = ''
        this.name = ''
        this.aisle = ''
        this.getEvents()
      }).catch(err => {
        alert(`Failed to start serving event ${this.id}: ${err.message}`)
      })
    },
    stopServing (id) {
      removeEvent(id).then(response => {
        this.getEvents()
      }).catch(err => {
        alert(`Failed to stop serving event ${id}: ${err.message}`)
      })
    }
  }
}
</script>

<style>
body {
  padding-top: 20px;
}
</style>
