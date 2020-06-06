// worker.js
export function workercod() {
  self.onmessage = function (e) {
    // TODO: implement an IF statement to allow the main thread to specify which function they wanna execute by means of providing a string value to e.data.method = "delimitedColumnCSV" for current algorithm...
    if (e.data.method === 'delimitedColumn') {
      // COLUMN should be the index of the target column in this.state.columns
      let column = e.data.column
      let data = e.data.data
      let columns = e.data.columns

      let output = ''
      for (let i = 0; i < data.length; i++) {
        let valueToCopy = data[i][columns[column]]
        if (valueToCopy.match(/[\W|\s]/g)) {
          output += '"' + valueToCopy + '",'
        } else {
          output += valueToCopy + ','
        }
      }

      output = output.replace(/,$/g, '')
      self.postMessage(output)
    } else if (e.data.method === 'json') {
      // Convert the posted data to JSON string...
      let data = e.data.data

      let output = JSON.stringify(data)
      self.postMessage(output)
    } else if (e.data.method === 'xml') {
      var js2xmlparser = self.importScripts('js2xmlparser')

      let table = e.data.table
      let data = e.data.data

      let result = js2xmlparser.parse(table, data)
      self.postMessage(result)
    }
  }
}

let code = workercode.toString()
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'))

const blob = new Blob([code], {type: 'application/javascript'})
const worker_script = URL.createObjectURL(blob)

module.exports = worker_script
