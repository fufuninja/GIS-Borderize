function borderize(lat, long){ //THIS IS BORDERIZE FUNCTION FOR A PRE-DEFINED 5X5 ARRAY ONLY.

	/* First make sure data in google spreadsheet is in this format

	COLUMN A  |  COLUMN B  |  COLUMN C  |  COLUMN D  |  COLUMN E
	=============================================================
	  LAT     |    LONG    |  LAT,LONG  |   ADDRESS  |  ZIP CODE
	*/


    var x = lat + 0.010 ; // CHANGE 0.010 TO THE VALUE OF DEGREE YOU WANT.
	var y  = long - 0.010 ;

/*  
DECIMAL PLACES  DECIMAL DEGREES   QUALITATIVE SCALE THAT CAN BE IDENTIFIED              N/S OR E/W   E/W AT     E/W AT       E/W AT
																						AT EQUATOR   23 N/S 	45 N/S        67 N/S
	0	 		1.0	1° 00′ 0″		country or large region								111.32 km	102.47 km	78.71 km	43.496 km
	0.1			0° 06′ 0″			large city or district								11.132 km	10.247 km	7.871 km	4.3496 km
	0.01		0° 00′ 36″			town or village										1.1132 km	1.0247 km	787.1 m		434.96 m
	0.001		0° 00′ 3.6″			neighborhood, street								111.32 m	102.47 m	78.71 m		43.496 m
	0.0001		0° 00′ 0.36″		individual street, land parcel						11.132 m	10.247 m	7.871 m		4.3496 m
	0.00001		0° 00′ 0.036″		individual trees									1.1132 m	1.0247 m	787.1 mm	434.96 mm
	0.000001	0° 00′ 0.0036″		individual humans									111.32 mm	102.47 mm	78.71 mm	43.496 mm
	0.0000001	0° 00′ 0.000036″	practical limit of commercial surveying				11.132 mm	10.247 mm	7.871 mm	4.3496 mm
	0.00000001	0° 00′ 0.000036″	specialized surveying (e.g. tectonic plate mapping)	1.1132 mm	1.0247 mm	787.1 µm	434.96 µm
*/

	var array = [[    x.toFixed(6)+","+y.toFixed(3)       ,     x.toFixed(6)+","+(y+0.005).toFixed(3)       ,       x.toFixed(6)+","+(y+0.010).toFixed(3)     ,      x.toFixed(6)+","+(y+0.015).toFixed(3)      ,      x.toFixed(6)+","+(y+0.020).toFixed(3)      ],
					 [ (x-0.005).toFixed(6)+","+y.toFixed(3)  ,  (x-0.005).toFixed(6)+","+(y+0.005).toFixed(3)  ,  (x-0.005).toFixed(6)+","+(y+0.010).toFixed(3)  ,  (x-0.005).toFixed(6)+","+(y+0.015).toFixed(3)  ,  (x-0.005).toFixed(6)+","+(y+0.020).toFixed(3)  ],
				 [ (x-0.010).toFixed(6)+","+y.toFixed(3)  ,  (x-0.010).toFixed(6)+","+(y+0.005).toFixed(3)  ,  (x-0.010).toFixed(6)+","+(y+0.010).toFixed(3)  ,  (x-0.010).toFixed(6)+","+(y+0.015).toFixed(3)  ,  (x-0.010).toFixed(6)+","+(y+0.020).toFixed(3)  ],
				 [ (x-0.015).toFixed(6)+","+y.toFixed(3)  ,  (x-0.015).toFixed(6)+","+(y+0.005).toFixed(3)  ,  (x-0.015).toFixed(6)+","+(y+0.010).toFixed(3)  ,  (x-0.015).toFixed(6)+","+(y+0.015).toFixed(3)  ,  (x-0.015).toFixed(6)+","+(y+0.020).toFixed(3)  ],
				 [ (x-0.020).toFixed(6)+","+y.toFixed(3)  ,  (x-0.020).toFixed(6)+","+(y+0.005).toFixed(3)  ,  (x-0.020).toFixed(6)+","+(y+0.010).toFixed(3)  ,  (x-0.020).toFixed(6)+","+(y+0.015).toFixed(3)  ,  (x-0.020).toFixed(6)+","+(y+0.020).toFixed(3)  ]
				]; // THIS IS ONLY FOR 5X5 ARRAY. MODIFY TO YOUR OWN NEEDS.

	var weightage = [[0.0075, 0.0125, 0.03 , 0.0125, 0.0075],
					 [0.0125, 0.0625, 0.125, 0.0625, 0.0125],
					 [0.03  , 0.125 ,   0  , 0.125 ,   0.03],
					 [0.0125, 0.0625, 0.125, 0.0625, 0.0125],
					 [0.0075, 0.0125, 0.03 , 0.0125, 0.0075]
					]; // THIS IS A PRE-DEFINED WEIGHTAGE SYSTEM FOR 5X5 ARRAYS ONLY. DEFINE YOUR OWN.

	var zipArray = [[],[],[],[],[]]; // THIS 5X5 ARRAY STORES ZIP CODE MATCHES FROM VLOOKUP.


	var sh = SpreadsheetApp.getActiveSheet(); //VERTICAL LOOK UP FUNCTION STARTS HERE. 
	var ss = SpreadsheetApp.getActiveSpreadsheet();
	var last = ss.getLastRow();
	var data = sh.getRange(1,1,last,5).getValues();

	for ( var i = 0; i<5; i++){  // VLOOKUP LOOKS FOR MATHCES IN COORDINATES FROM array AND RETURNS ZIP CODE ASSIGNED TO THAT COORDINATE AND STORE IT IN zipArray.
		for ( var j = 0; j<5; j++){
		 	for(nn = 0;nn < data.length; ++nn){ //LOOPS THROUGH OUR DATA IN SPREADSHEET
			    if (data[nn][2] == array[i][j]){ // [2] MEANS COLUMN C.
	               zipArray[i][j] = data[nn][4]; //[4] MEANS COLUMN E.
	            };
	        };
		};
	};

   

	var arrz=[]; // arrz STORES ALL ELEMENTS IN zipArray IN ONE-DIMENSIONAL ARRAY.
	for ( var i = 0; i < zipArray.length; i++ ) {
		arrz = arrz.concat(zipArray[i]);
	};

	function distinct(array) { //DISTINCT FUNCTION TAKES arrz PUSHES ELEMENTS THAT ARE DISTINCT, THUS REMOVING REPLICATES. ALSO IT SORTS BY ASCENDING ORDER.
	    var a = [], prev;

	    array.sort(); // SORTING IN ASCENDING
	    for ( var i = 0; i < array.length; i++ ) {
	        if ( array[i] !== prev ) {
	            a.push(array[i]);
	        }
	        prev = array[i];
	    }

	    return [a]; 
	}

	var result= distinct(arrz); // RETURNS 2D ARRAY THAT LOOKS SOMETHING LIKE THIS. ex: [["", 46700, 65150, 80300, ,]]

	var k = 0;
	var multipliedArray = [[],[],[],[],[]];
	var array10 = [[],[],[],[],[]];
	var sumOfMultipliedArrayElements = 0;
	var anz = []; // anz ARRAY WILL STORE ALL OUTPUT OF sumOfMultipliedArrayElements.


	for(var k = 0 ; k < result[0].length ; k++){// NOW WE LOOP THROUGH result ARRAY
		for ( var i = 0; i<5; i++){
			for ( var j = 0; j<5; j++){
				if( zipArray[i][j] == result[0][k]){ //LETS SAY IF FIRST ELEMENT OF result MATCHES FIRST ELEMENT OF result ARRAY, MAKE THAT POINT AS 1.
						array10[i][j] = 1;
				}
				else{
						array10[i][j] = 0; // IF DOES NOT MATCH, ASSUME AS 0.
				};

				multipliedArray[i][j] = array10[i][j] * weightage[i][j];
				sumOfMultipliedArrayElements += multipliedArray[i][j];
				anz[k] = sumOfMultipliedArrayElements;
			};
		};
	};
    
	var finalArray = []; //STORES FINAL WEIGHTAGE OF EACH AND EVERY ZIPCODES.
	finalArray[0]=anz[0];
	for(var k = 1 ; k < result[0].length ; k++){
		finalArray[k] = anz[k] - anz[k-1] ;
	}

	var highest = Math.max.apply(Math, finalArray); //FINDS MAXIMUM VALUE IN finalArray array.
	var index = finalArray.indexOf(highest);		//FINDS INDEX OF THE MAXIMUM VALUE
    var finalZip = result[0][index];				
    
 	var finalArrayCopy = [];		//THIS IS JUST A COPY OF finalArray array BECAUSE WE DO NOT WANT TO MAKE CHANGES TO THE ORIGINAL DATA OF finalArray.
	finalArrayCopy[0]=anz[0];
	for(var k = 1 ; k < result[0].length ; k++){
		finalArrayCopy[k] = anz[k] - anz[k-1] ;
	}

	//THIS PART VALIDATES WHAT IS THE RIGHT OUTPUT FOR DIFFERENT CONDITIONS.

    if (finalZip == "" || finalZip == null){ //IF FOUND OUT THAT finalZip IS GOING TO RETURN A NULL OR EMPTY STRING, DO THE BELOW
      var highest_1 = Math.max.apply(Math, finalArrayCopy);//FIND MAXIMUM WEIGHTAGE
      var index_1 = finalArrayCopy.indexOf(highest_1); // FIND INDEX OF MAXIMUM WEIGHTAGE
      finalArrayCopy.splice( index_1 ,1 );				//DELETE THE ELEMENT WITH THE SAME INDEX IN finalArrayCopy.
      var highest_2 = Math.max.apply(Math, finalArrayCopy);  //FIND THE NOW HIGHEST VALUE IN finalArrayCopy
      var index_2 = finalArray.indexOf(highest_2);			// FIND INDEX OF SECOND HIGHEST VALUE IN finalArray
      
      if (result[0][index_2] == "" || result[0][index_2] == null){ //SAME CONCEPT AS ABOVE, BUT NOW DOING A SECOND FILTER BECAUSE IN MOST CASES, WE FIND BOTH "" AND NULL INSIDE finalZip.
        finalArrayCopy.splice(index_2, 1);
        var highest_3 = Math.max.apply(Math, finalArrayCopy);
        var index_3 = finalArray.indexOf(highest_3);
        result[0][index_3];        
      }
      else{
        return result[0][index_2];
      }; 

    }

    else{
      return finalZip;
    }

};

