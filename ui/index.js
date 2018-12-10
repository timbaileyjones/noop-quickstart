const Express = require('express')
const app = new Express()

app.use(Express.json())

app.get('*', (req, res) => {
  res.send(`
    <head>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

      <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.min.js"></script>

      <title>noop Sample App</title>

      <script>
        $('#add-button').click(() => {
          $.post('http://localapp/api/samples', {id: $('#add-id').val(), name: $('#add-name').val(), aisle: $('#add-aisle').val()}, (xhr) => {
            populateList()
          }).fail((xhr) => {
            alert('Failed to add sample: ' + xhr.status.toString() + ' ' + xhr.responseText)
          })
        })

        function wireUpDeletes() {
          $('.delete-button').click(() => {
            $.ajax({
              url: 'http://localapp/api/samples/' + $(this).attr('id'),
              type: 'DELETE',
              dataType: 'json',
              success: (body) => {
                populateList()
              },
              error: (xhr) => {
                alert('Failed to delete sample: ' + xhr.status.toString() + ' ' + xhr.responseText)
              }
            })
          })
        }

        function populateList() {
          $.get('http://localapp/api/samples', (xhr) => {
            if (xhr.status === 200) {
              var list = JSON.parse(xhr.responseText)
              $('#list').empty()
              $('#list').append('<tr><th>id</th><th>name</th><th>aisle</th><th></th></tr>')
              for (var i = 0; i < list.length ; ++i) {
                line = '<tr><td>' + list[i].id + '</td><td>' + list[i].name + '</td><td>' + list[i].aisle + '</td><td><input id="' + list[i].id + '" class="delete-button" type="button" value="Delete Sample" />'
                $('#list').append(line)
              }
              wireUpDeletes()
            } else {
              alert('Failed to populate list: ' + xhr.status.toString() + ' ' + xhr.responseText)
            }
          })
        }

        $(document).ready(populateList)
      </script>
    </head>
    <body>
      <div>
        Sample id: <input id="add-id" type="text" />
        Sample name: <input id="add-name" type="text" />
        Distributed in aisle: <input id="add-aisle" type="text" />
        <input id="add-button" type="button" value="Add Sample" />
      </div>
      <table id="list">
      </table>
    </body>
  `)
})

exports.handler = app.handle.bind(app)
