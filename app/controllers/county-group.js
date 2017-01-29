import Ember from 'ember';

export default Ember.Controller.extend({
  chartsData: [],

  actions: {
    getSubgroupInfo: function (subgroup) {
      this.set('chartsData', []);
      var dimensionsHttp = new XMLHttpRequest();
      dimensionsHttp.open( "GET", 'http://gi-kp.azurewebsites.net/groups/' + this.get('groupId') + '/subgroups/' + subgroup.id + '/dimensions?levelOfData=' + this.get('levelOfData') + "&counties=" + this.get('county'), false ); // false for synchronous request
      dimensionsHttp.send(null);
      var dimensions = JSON.parse(dimensionsHttp.responseText)['dimensions'];


      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", 'http://gi-kp.azurewebsites.net/groups/' + this.get('groupId') + '/subgroups/' + subgroup.id + '?levelOfData=' + this.get('levelOfData')+ "&counties=" + this.get('county'), false ); // false for synchronous request
      xmlHttp.send( null );
      var jsonResponse = JSON.parse(xmlHttp.responseText);
      var data = jsonResponse['data'];


      var matrixForDimensions = null;
      if(dimensions.length>0) {
        matrixForDimensions = new Array(dimensions[0]['options'].length);
        for (var i = 0; i < dimensions[0]['options'].length; i++) {
          if(dimensions.length>1) {
            matrixForDimensions[i] = new Array(dimensions[1]['options'].length);
            for (var j = 0; j < dimensions[1]['options'].length; j++) {
              if (dimensions.length > 2) {
                matrixForDimensions[i][j] = new Array(dimensions[2]['options'].length);
                for (var k = 0; k < dimensions[2]['options'].length; k++) {
                  matrixForDimensions[i][j][k] = [];
                  matrixForDimensions[i][j][k].push(["Rok", data[0]['unitOfMeasure']]);
                }
              } else {
                matrixForDimensions[i][j] = [];
                matrixForDimensions[i][j].push(["Rok", data[0]['unitOfMeasure']]);
              }
            }
          } else {
            matrixForDimensions[i] = [];
            matrixForDimensions[i].push(["Rok", data[0]['unitOfMeasure']]);
          }
        }
      } else {
        matrixForDimensions = [];
        matrixForDimensions.push(["Rok", data[0]['unitOfMeasure']]);
      }

      data.forEach(function(entry) {
        if (dimensions.length == 3) {
          matrixForDimensions[entry[dimensions[0]['parameterName']]][entry[dimensions[1]['parameterName']]][entry[dimensions[2]['parameterName']]].push([entry['year'].toString(), entry['value']]);
        } else if (dimensions.length == 2) {
          matrixForDimensions[entry[dimensions[0]['parameterName']]][entry[dimensions[1]['parameterName']]].push([entry['year'].toString(), entry['value']]);
        } else if (dimensions.length == 1) {
          matrixForDimensions[entry[dimensions[0]['parameterName']]].push([entry['year'].toString(), entry['value']]);
        } else {
          matrixForDimensions.push([entry['year'].toString(), entry['value']]);
        }
      });

      if(dimensions.length>0) {
        for (var i = 0; i < dimensions[0]['options'].length; i++) {
          if(dimensions.length>1) {
            for (var j = 0; j < dimensions[1]['options'].length; j++) {
              if (dimensions.length > 2) {
                for (var k = 0; k < dimensions[2]['options'].length; k++) {
                  var param1 = dimensions[0]['options'].filter(function( obj ) {
                    return obj.key == i;
                  });
                  var param2 = dimensions[1]['options'].filter(function( obj ) {
                    return obj.key == j;
                  });
                  var param3 = dimensions[2]['options'].filter(function( obj ) {
                    return obj.key == k;
                  });

                  var chartData = this.store.createRecord('chart-data', {
                    grid_header: [param1[0]['value'], param2[0]['value'], param3[0]['value']],
                    chart_data: matrixForDimensions[i][j][k]
                  });

                  this.get('chartsData').pushObject(chartData);
                }
              } else {
                var param1 = dimensions[0]['options'].filter(function( obj ) {
                  return obj.key == i;
                });
                var param2 = dimensions[1]['options'].filter(function( obj ) {
                  return obj.key == j;
                });

                var chartData = this.store.createRecord('chart-data', {
                  grid_header: [param1[0]['value'], param2[0]['value']],
                  chart_data: matrixForDimensions[i][j]
                });

                this.get('chartsData').pushObject(chartData);
              }
            }
          } else {
            var param1 = dimensions[0]['options'].filter(function( obj ) {
              return obj.key == i;
            });

            var chartData = this.store.createRecord('chart-data', {
              grid_header: [param1[0]['value']],
              chart_data: matrixForDimensions[i]
            });

            this.get('chartsData').pushObject(chartData);
          }
        }
      } else {
        var chartData = this.store.createRecord('chart-data', {
          grid_header: [],
          chart_data: matrixForDimensions
        });

        this.get('chartsData').pushObject(chartData);
      }
      console.log(this.get('chartsData'));
      this.set('chartsData', this.get('chartsData'));
    }
  }
});