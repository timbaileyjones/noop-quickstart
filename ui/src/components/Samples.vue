<template>
  <div>
    <table>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Aisle</th>
        <th></th>
      </tr>
      <tr v-for="sample in samples">
        <td>{{ sample.id }}</td>
        <td>{{ sample.name }}</td>
        <td>{{ sample.aisle }}</td>
        <td><button @click.stop="stopServing(sample.id)">Stop Serving</button></td>
      </tr>
    </table>
  </div>
</template>

<script>
  import { listSamples } from '@/api'
  export default {
    computed: {
      samples: () => {
        listSamples().then(response => {
          return response.data
        }).catch(err => {
          alert(err)
        })
      }
    }
    methods: {
      stopServing: (event) => {
        alert('hey, stop serving.')
      }
    }
  }
</script>
