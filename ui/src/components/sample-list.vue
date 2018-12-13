<template>
  <div>
    <div>
      <input v-model="id" placeholder="abc123">
      <input v-model="name" placeholder="Fancy cheese on a toothpick">
      <input v-model="aisle" placeholder="5">
      <button @click.stop="startServing">Start Serving</button>
    </div>
    <table>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Aisle</th>
        <th></th>
      </tr>
      <tr v-for="sample in samples" :key="sample.id">
        <td>{{ sample.id }}</td>
        <td>{{ sample.name }}</td>
        <td>{{ sample.aisle }}</td>
        <td><button @click.stop="stopServing(sample.id)">Stop Serving</button></td>
      </tr>
    </table>
  </div>
</template>

<script>
import { addSample, listSamples, removeSample } from '@/api'
export default {
  computed: {
    samples: () => {
      listSamples().then(response => {
        return response.data
      }).catch(err => {
        alert(`Failed to get list of samples: ${err}`)
      })
    }
  },
  methods: {
    startServing: () => {
      addSample(this.props.id, this.props.name, this.props.aisle).then(response => {
        this.$forceUpdate()
      }).catch(err => {
        alert(`Failed to start serving sample ${this.props.id}: ${err}`)
      })
    },
    stopServing: (id) => {
      removeSample(id).then(response => {
        this.$forceUpdate()
      }).catch(err => {
        alert(`Failed to stop serving sample ${id}: ${err}`)
      })
    }
  },
  props: ['id', 'name', 'aisle']
}
</script>
