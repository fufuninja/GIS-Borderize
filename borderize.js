function borderize(lat, long){ //5x5 arrays only
    var last = 801;
    
    var lat = 3.241916;
    var long = 101.704;
    
    var x = lat + 0.010 ;
	var y  = long - 0.010 ;

	var array = [[    x.toFixed(6)+","+y.toFixed(3)       ,     x.toFixed(6)+","+(y+0.005).toFixed(3)       ,       x.toFixed(6)+","+(y+0.010).toFixed(3)     ,      x.toFixed(6)+","+(y+0.015).toFixed(3)      ,      x.toFixed(6)+","+(y+0.020).toFixed(3)      ],
				 [ (x-0.005).toFixed(6)+","+y.toFixed(3)  ,  (x-0.005).toFixed(6)+","+(y+0.005).toFixed(3)  ,  (x-0.005).toFixed(6)+","+(y+0.010).toFixed(3)  ,  (x-0.005).toFixed(6)+","+(y+0.015).toFixed(3)  ,  (x-0.005).toFixed(6)+","+(y+0.020).toFixed(3)  ],
				 [ (x-0.010).toFixed(6)+","+y.toFixed(3)  ,  (x-0.010).toFixed(6)+","+(y+0.005).toFixed(3)  ,  (x-0.010).toFixed(6)+","+(y+0.010).toFixed(3)  ,  (x-0.010).toFixed(6)+","+(y+0.015).toFixed(3)  ,  (x-0.010).toFixed(6)+","+(y+0.020).toFixed(3)  ],
				 [ (x-0.015).toFixed(6)+","+y.toFixed(3)  ,  (x-0.015).toFixed(6)+","+(y+0.005).toFixed(3)  ,  (x-0.015).toFixed(6)+","+(y+0.010).toFixed(3)  ,  (x-0.015).toFixed(6)+","+(y+0.015).toFixed(3)  ,  (x-0.015).toFixed(6)+","+(y+0.020).toFixed(3)  ],
				 [ (x-0.020).toFixed(6)+","+y.toFixed(3)  ,  (x-0.020).toFixed(6)+","+(y+0.005).toFixed(3)  ,  (x-0.020).toFixed(6)+","+(y+0.010).toFixed(3)  ,  (x-0.020).toFixed(6)+","+(y+0.015).toFixed(3)  ,  (x-0.020).toFixed(6)+","+(y+0.020).toFixed(3)  ]
				];
	var weightage = [[0.0075, 0.0125, 0.03 , 0.0125, 0.0075],
					 [0.0125, 0.0625, 0.125, 0.0625, 0.0125],
					 [0.03  , 0.125 ,   0  , 0.125 ,   0.03],
					 [0.0125, 0.0625, 0.125, 0.0625, 0.0125],
					 [0.0075, 0.0125, 0.03 , 0.0125, 0.0075]
					];
	//Array transform from coordinates to Zip Code by Vlookup HERE
	var zipArray = [[],[],[],[],[]];

	  var sh = SpreadsheetApp.getActiveSheet();
	  var ss = SpreadsheetApp.getActiveSpreadsheet();
	  //var last = ss.getLastRow();
	  var data = sh.getRange(1,1,last,5).getValues();
      
		for ( var i = 0; i<5; i++){
			for ( var j = 0; j<5; j++){
	  		 	 for(nn = 0;nn < data.length; ++nn){
				    if (data[nn][2] == array[i][j]){
                       zipArray[i][j] = data[nn][4];
                    } // if a match in column C is found, break the loop
                }

	  		}
	  	}

   

	var arrz=[]; // 1 D
	for ( var i = 0; i < zipArray.length; i++ ) {
		arrz = arrz.concat(zipArray[i]);
	};

	function distinct(array) {
	    var a = [], prev;

	    array.sort();
	    for ( var i = 0; i < array.length; i++ ) {
	        if ( array[i] !== prev ) {
	            a.push(array[i]);
	        }
	        prev = array[i];
	    }

	    return [a];
	}

	var result= distinct(arrz);

	var k = 0;
	var multipliedArray = [[],[],[],[],[]];
	var array10 = [[],[],[],[],[]];
	var sumOfMultipliedArrayElements = 0;
	var anz = [];


	for(var k = 0 ; k < result[0].length ; k++){
		for ( var i = 0; i<5; i++){
			for ( var j = 0; j<5; j++){
				if( zipArray[i][j] == result[0][k]){
						array10[i][j] = 1;
				}
				else{
						array10[i][j] = 0;
				};

				multipliedArray[i][j] = array10[i][j] * weightage[i][j];
				sumOfMultipliedArrayElements += multipliedArray[i][j];
				anz[k] = sumOfMultipliedArrayElements ;
			};
		};
	};
    


	var finalArray = [];
	finalArray[0]=anz[0];
	for(var k = 1 ; k < result[0].length ; k++){
		finalArray[k] = anz[k] - anz[k-1] ;
	}

	var highest = Math.max.apply(Math, finalArray);
	var index = finalArray.indexOf(highest);
    var finalZip = result[0][index];
    
 	var finalArrayCopy = [];
	finalArrayCopy[0]=anz[0];
	for(var k = 1 ; k < result[0].length ; k++){
		finalArrayCopy[k] = anz[k] - anz[k-1] ;
	}

    if (finalZip == "" || finalZip == null){
      finalArrayCopy.splice( highest ,1 );
      var highest_2 = Math.max.apply(Math, finalArrayCopy);
      var index_2 = finalArray.indexOf(highest_2);
      var shoot1 = result[0][index_2];
      if (shoot1 == "" || shoot1 == null){
        finalArrayCopy.splice(highest_2, 1);
        var highest_3 = Math.max.apply(Math, finalArrayCopy);
        var index_3 = finalArray.indexOf(highest_3);
        return result[0][index_3];
      }
      else{
        return result[0][index_2];
      }
    }
};

