/*
	idn-xxx-20200512.js
	Raw CSV data with backtick in JS
	
	Sparisoma Viridi | https://github.com/dudung
	Aristyo Wijaya | https://github.com/aristyogresearch
	
	20200512
	2202 Get info active, recovered, death, and confirmed cases.
	20200513
	1101 Convert from XLSX format.
	1123 Check that the total is the same as in [1] and [2].
	2138 Add artificial data at the end.
	
	References
	1. url https://www.worldometers.info/coronavirus/country
	   /indonesia [20200513].
	2. url https://covid19.go.id/peta-sebaran [20200513].
*/


// Active case
var csv_a = `
ID,Provinsi,2020-02-28,2020-02-29,2020-03-01,2020-03-02,2020-03-03,2020-03-04,2020-03-05,2020-03-06,2020-03-07,2020-03-08,2020-03-09,2020-03-10,2020-03-11,2020-03-12,2020-03-13,2020-03-14,2020-03-15,2020-03-16,2020-03-17,2020-03-18,2020-03-19,2020-03-20,2020-03-21,2020-03-22,2020-03-23,2020-03-24,2020-03-25,2020-03-26,2020-03-27,2020-03-28,2020-03-29,2020-03-30,2020-03-31,2020-04-01,2020-04-02,2020-04-03,2020-04-04,2020-04-05,2020-04-06,2020-04-07,2020-04-08,2020-04-09,2020-04-10,2020-04-11,2020-04-12,2020-04-13,2020-04-14,2020-04-15,2020-04-16,2020-04-17,2020-04-18,2020-04-19,2020-04-20,2020-04-21,2020-04-22,2020-04-23,2020-04-24,2020-04-25,2020-04-26,2020-04-27,2020-04-28,2020-04-29,2020-04-30,2020-05-01,2020-05-02,2020-05-03,2020-05-04,2020-05-05,2020-05-06,2020-05-07,2020-05-08,2020-05-09,2020-05-10,2020-05-11,2020-05-12
0,Nanggroe Aceh Darussalam,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,4,4,5,5,5,5,5,5,4,4,4,4,5,4,3,3,3,0,0,0,0,0,1,2,2,2,2,2,3,4,4,4,4,4,5,6,4,5,4,4,9,9,5,5,5,5,4
1,Kalimantan Selatan,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,5,8,8,8,8,8,16,18,18,22,20,27,27,32,32,29,40,47,62,80,84,81,83,92,99,116,130,130,134,128,128,141,147,146,162,165,179,192,205,213,220,230,230,244
2,Daerah Istimewa Yogyakarta,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2,4,3,4,4,4,4,13,13,19,19,19,19,20,24,23,23,29,30,36,37,28,28,28,28,28,44,37,37,37,32,34,33,34,35,38,37,34,36,39,39,47,47,45,53,59,59,58,62,62,73,77,80,86,91,99
3,Jawa Tengah,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,5,6,9,9,11,12,12,16,34,34,37,48,56,74,86,97,97,85,91,88,96,97,104,104,104,104,156,159,233,246,254,227,244,254,256,354,372,431,463,509,519,520,535,551,563,574,593,602,624,655,682,695,707,720,739,685,694
4,Kalimantan Tengah,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,3,3,6,6,7,7,7,9,9,9,9,9,7,16,14,14,12,16,16,16,16,16,23,24,25,31,36,48,54,69,70,81,87,91,97,104,110,128,139,140,135,158,159,164,166,152,152,156,163,167
5,Jambi,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,5,6,7,8,8,8,7,11,12,13,17,20,31,31,31,31,31,31,31,37,37,42,46,46,46,61,61,62,62
6,Sumatra Utara,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,6,6,7,7,7,7,12,18,19,19,19,22,21,22,22,55,55,47,43,55,49,53,59,58,58,58,60,61,62,63,63,64,72,78,78,64,62,63,63,63,69,75,76,82,78,93,110,110,124,126
7,Bengkulu,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,6,6,6,6,6,6,6,6,10,10,10,10,10,10,10,12,12,12,35,35,35,38
8,Jawa Timur,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,5,8,14,25,40,40,50,49,53,54,65,72,67,69,78,78,119,109,144,137,137,134,157,172,178,291,337,358,373,382,382,410,438,436,447,479,492,495,562,560,568,623,625,705,773,766,832,829,874,899,928,931,1051,1129,1143,1256
9,Gorontalo,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,4,4,4,4,4,6,6,6,11,13,14,14,14,12,12,12,12,12,12,12,12,14,10,7,7,6,6
10,Papua,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,3,3,7,7,7,9,9,10,8,8,13,14,22,21,21,33,33,33,57,49,60,60,67,59,68,71,83,73,84,89,92,98,98,103,113,124,136,152,156,186,186,186,193,194,198,211,223,254,254,268
11,Sumatra Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,5,5,5,8,8,8,8,8,8,8,18,18,18,18,22,21,25,35,36,43,43,45,51,52,54,56,60,61,69,66,71,84,106,106,108,127,137,145,151,167,184,195,207,215,226,215,231
12,Sumatra Selatan,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,3,3,3,10,9,13,13,13,13,14,18,18,15,12,12,16,30,47,77,81,81,81,81,85,98,111,108,108,118,119,124,124,124,145,137,147,158,174,172,223,214,205,206
13,Sulawesi Selatan,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,1,3,12,26,28,32,46,49,49,61,61,73,68,69,88,100,100,107,132,138,182,177,183,185,206,266,275,302,282,271,282,283,304,314,305,305,308,310,332,375,392,410,368,370,385,401,411,404,410,397,415
14,Bali,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,0,0,0,3,3,2,4,4,7,7,7,7,8,17,17,13,13,15,20,15,23,23,29,45,54,58,60,64,69,73,79,86,92,94,95,105,107,108,118,109,107,109,123,115,105,110,104,107,108,113,107,100,101,105,103,100,109
15,Jawa Barat,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,3,6,7,9,21,24,33,47,45,45,45,58,62,79,96,124,152,166,188,191,188,207,212,221,297,313,317,329,362,388,466,455,484,489,535,544,588,629,613,612,623,695,737,742,777,787,823,786,784,812,817,1007,1046,1053,1109,1128,1140,1140,1185,1234
16,Sulawesi Tenggara,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,5,4,5,6,6,10,14,14,14,14,14,14,22,21,21,22,31,31,31,31,31,34,34,37,37,37,44,50,49,51,51,51,52,52,52,53,54,58,58,58
17,Maluku,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,2,2,2,2,10,10,10,13,13,13,11,11,7,7,7,7,7,12,11,11,10,11,11,11,11,11,11,11,11,11,18,18,18,18,29
18,Nusa Tenggara Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,4,6,6,5,7,7,10,10,10,14,23,23,33,33,33,33,41,47,51,47,57,78,93,98,134,156,171,180,193,202,195,198,214,229,229,229,231,238,227,237,232,220,228
19,Riau,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,2,2,2,2,2,2,3,3,2,6,9,9,10,11,11,11,11,12,15,13,18,19,19,16,13,17,17,21,22,22,23,20,21,21,21,21,22,21,22,17,22,26,28,27,32,35,27,28,22,26
20,DKI Jakarta,0,0,0,0,0,0,0,2,2,4,17,25,25,28,58,74,90,104,130,150,183,183,227,256,301,370,409,444,516,522,562,576,616,673,755,829,883,973,1068,1198,1286,1482,1517,1707,1707,1840,1931,2068,2224,2365,2466,2515,2580,2676,2760,2890,2946,3004,3110,3165,3269,3282,3318,3454,3492,3433,3499,3574,3615,3687,3786,3877,3953,4023,4008
21,Sulawesi Utara,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,1,1,2,2,2,2,2,4,7,6,6,10,10,14,13,13,14,11,11,13,13,13,12,12,23,28,28,26,26,29,27,27,27,24,69,24,24,24,24,26,32,50,50,43
22,Nusa Tenggara Timur,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,2,9,9,11,11,11,11,11,11,11,15
23,Lampung,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,2,4,4,4,8,8,8,8,10,10,10,11,11,14,13,18,19,18,16,15,14,12,10,11,11,11,12,12,23,23,23,27,27,29,30,28,32,32,28,32,33,40,40,43,40,40,39,39
24,Sulawesi Tengah,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,3,3,2,2,4,4,4,4,3,3,3,12,17,15,15,14,17,17,19,19,22,22,21,23,23,26,30,30,30,31,36,36,34,45,45,45,55,55,60,60,60,68,67,79
25,Kalimantan Timur,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,3,9,9,9,11,11,11,11,11,17,17,17,20,20,20,21,22,28,29,29,27,25,28,28,28,28,28,28,33,33,42,47,51,56,57,62,73,85,93,94,102,106,121,122,140,148,153,153,167,167,194,181,182,186,184
26,Banten,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,5,4,7,25,35,40,43,52,60,62,62,79,98,101,123,136,131,143,149,149,153,163,169,187,191,215,251,253,256,251,249,258,268,278,281,289,289,273,273,287,298,298,309,314,314,329,343,352,357,371,300,324,317,327,345,355,339,350
27,Kalimantan Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,8,9,5,6,6,6,6,6,8,5,5,5,5,5,7,7,5,5,13,13,13,12,12,17,21,40,40,41,41,41,41,48,48,50,57,59,62,62,79,81,80,103,105,105,100
28,Sulawesi Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,2,2,2,2,2,3,4,2,2,3,5,5,5,5,5,5,5,6,6,31,33,33,33,34,34,38,39,39,39,39,52,52,51,53,55,55,55,59
29,Bangka Belitung,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,1,1,1,1,1,1,1,1,1,2,3,3,3,3,4,5,5,5,6,5,5,5,5,6,6,7,7,7,7,7,14,14,15,15,23,23,23,21,21,22,21,21
30,Kepulauan Riau,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,3,4,4,4,5,4,4,4,4,4,4,5,6,6,6,7,5,6,6,6,6,19,18,18,18,18,19,25,26,46,66,66,66,65,65,67,66,66,68,69,70,69,69,65,58,41,41,41,31,25,23,24,22,21,23
31,Maluku Utara,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,2,2,2,2,2,2,2,10,12,12,12,24,24,23,23,37,38,38,45,45,45,45,45,45,46,46,46,46
32,Papua Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,2,2,1,1,4,4,4,6,6,6,7,12,14,15,15,15,36,36,36,41,42,42,42,48,52,52,52,52,67,67,67
33,Kalimantan Utara,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,8,8,8,15,15,16,16,16,15,15,15,15,18,25,44,47,66,71,74,74,74,74,80,86,87,89,89,95,109,116,116,124,124,124,124,124,124,123,124,124
NaN,Total,0,0,0,2,2,2,2,4,4,6,19,27,26,30,60,84,104,121,158,197,269,320,392,437,500,601,701,780,913,994,1107,1217,1311,1417,1508,1671,1751,1911,2090,2313,2494,2761,2924,3229,3509,3778,3954,4221,4472,4796,5082,5307,5423,5677,5870,6168,6520,6845,7032,7180,7484,7596,7804,8160,8347,8471,8788,9002,9226,9500,9675,10079,10361,10393,10679
35,Artificial Data,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,2,2,2,3,3,4,5,6,7,8,9,10,12,14,17,19,23,26,31,36,41,48,56,65,75,87,100,116,134,154,178,204,235,269,308,351,400,454,514,579,651,728,810,897,989,1083,1179,1276,1372,1466,1555,1639,1717,1787,1848,1900,1942,1975,1998,2011
`;


// Recovered case
var csv_r = `
ID,Provinsi,2020-02-28,2020-02-29,2020-03-01,2020-03-02,2020-03-03,2020-03-04,2020-03-05,2020-03-06,2020-03-07,2020-03-08,2020-03-09,2020-03-10,2020-03-11,2020-03-12,2020-03-13,2020-03-14,2020-03-15,2020-03-16,2020-03-17,2020-03-18,2020-03-19,2020-03-20,2020-03-21,2020-03-22,2020-03-23,2020-03-24,2020-03-25,2020-03-26,2020-03-27,2020-03-28,2020-03-29,2020-03-30,2020-03-31,2020-04-01,2020-04-02,2020-04-03,2020-04-04,2020-04-05,2020-04-06,2020-04-07,2020-04-08,2020-04-09,2020-04-10,2020-04-11,2020-04-12,2020-04-13,2020-04-14,2020-04-15,2020-04-16,2020-04-17,2020-04-18,2020-04-19,2020-04-20,2020-04-21,2020-04-22,2020-04-23,2020-04-24,2020-04-25,2020-04-26,2020-04-27,2020-04-28,2020-04-29,2020-04-30,2020-05-01,2020-05-02,2020-05-03,2020-05-04,2020-05-05,2020-05-06,2020-05-07,2020-05-08,2020-05-09,2020-05-10,2020-05-11,2020-05-12
0,Nanggroe Aceh Darussalam,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,6,6,7,7,7,7,11,11,11,11,12
1,Kalimantan Selatan,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,6,6,6,6,9,9,9,9,10,10,10,10,16,20,20,23,24,24,24,24,24,24,24,24,24,24,24
2,Daerah Istimewa Yogyakarta,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,6,6,6,6,6,18,18,18,25,26,27,28,30,30,32,36,36,36,37,39,40,43,44,48,49,50,52,53,57,59,59,60,61,63
3,Jawa Tengah,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,11,14,14,14,14,18,18,18,19,19,19,19,19,36,44,51,51,51,54,54,58,58,72,88,89,101,102,112,112,112,112,132,145,145,161,173,173,229,229
4,Kalimantan Tengah,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,4,4,6,6,6,7,7,7,8,8,8,8,8,8,8,9,9,9,9,9,9,9,10,11,11,11,11,11,15,15,15,15,15,29,30,30,30,30
5,Jambi,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3
6,Sumatra Utara,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,5,9,10,10,12,12,12,12,13,13,21,21,21,21,21,21,35,40,41,41,41,41,41,41,43,48,48,48,48,48,48
7,Bengkulu,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
8,Jawa Timur,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,3,8,8,11,16,16,17,17,25,29,30,38,41,46,49,62,64,68,73,76,81,86,94,96,98,98,100,101,112,128,133,138,140,144,152,157,162,165,174,178,180,199,206,215,227,230,244,258
9,Gorontalo,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,4,8,11,11,12,12
10,Papua,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,3,3,3,3,3,3,3,3,3,8,5,5,5,15,15,18,18,28,28,28,32,32,32,32,32,47,47,47,48,48,48,48,48,48,48,48,48,48,48,48
11,Sumatra Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,7,7,7,7,8,8,11,13,13,13,13,13,16,17,20,20,23,24,24,25,30,30,35,37,38,38,41,46,54,56,67,70
12,Sumatra Selatan,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,4,4,4,4,5,5,5,5,5,5,5,5,5,5,18,18,22,22,23,29,29,36,43,47,47,47,49,49,55,64,64
13,Sulawesi Selatan,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,9,9,19,21,21,23,24,25,25,31,33,42,42,43,43,43,63,73,75,80,81,82,99,99,108,118,122,135,145,151,199,228,235,238,251,260,265,276,283
14,Bali,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,10,10,10,18,18,18,18,18,19,19,19,20,21,23,32,36,36,38,42,42,42,55,55,70,75,81,88,96,113,121,129,151,159,160,166,183,195,197,204,210,215
15,Jawa Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,5,5,5,5,5,5,6,6,8,11,11,11,12,12,12,13,17,17,19,19,19,19,22,23,23,28,41,41,49,56,75,79,87,90,93,93,96,103,107,143,145,147,152,159,167,177,182,184,202,202,213,213
16,Sulawesi Tenggara,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,5,5,6,6,6,7,10,11,11,11,11,15,15,15,15,15,16,16,16
17,Maluku,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,6,10,10,10,10,10,10,11,11,12,12,12,12,12,12,12,12,12,12,12,12,12,12,17
18,Nusa Tenggara Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,11,11,11,11,13,15,20,20,22,24,24,31,31,32,36,36,46,53,57,80,87,92,105,105
19,Riau,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,2,2,1,1,5,9,9,9,9,9,9,9,12,13,14,14,15,15,16,16,23,26,26,27,28,28,28,38,39,46,49
20,DKI Jakarta,0,0,0,0,0,0,0,0,0,0,0,0,0,3,5,8,8,8,8,9,13,14,17,22,23,23,23,25,31,43,45,48,48,50,52,52,56,56,65,65,70,82,82,82,142,142,163,164,202,204,205,230,230,286,322,326,327,334,335,337,363,440,486,488,513,632,632,704,741,745,745,752,803,812,924
21,Sulawesi Utara,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,5,5,5,5,5,5,5,5,5,5,11,11,11,14,14,14,17,41,17,17,17,17,17,17,17,17,26
22,Nusa Tenggara Timur,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
23,Lampung,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,8,10,10,10,10,10,10,10,10,10,10,10,10,11,13,13,13,17,17,17,18,18,18,21,21,22,22
24,Sulawesi Tengah,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,8,8,8,11,11,11,11,12,12,12,12,12,12,13,13
25,Kalimantan Timur,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,4,6,6,6,6,6,6,6,10,10,11,11,11,11,11,11,11,11,11,12,12,12,12,13,13,13,13,13,13,13,13,31,34,37,41
26,Banten,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,2,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,9,9,9,17,17,29,29,33,33,33,33,33,33,34,34,34,34,34,117,122,122,122,122,122,146,153
27,Kalimantan Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,3,3,3,3,3,3,3,5,5,5,5,5,6,6,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,11,12,12,12,12,20
28,Sulawesi Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,3,3,3,4,4,4,4,4,5,5,5,5,5,7
29,Bangka Belitung,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,6,6,6,7,7
30,Kepulauan Riau,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,5,5,6,6,6,8,8,8,9,9,9,9,11,11,11,15,22,42,42,46,57,63,67,67,68,72,72
31,Maluku Utara,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,5,5,5,5,5,5,8,8,8,8
32,Papua Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2
33,Kalimantan Utara,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4,5,5,5,5,6,6,6,6,6,7,7,7
NaN,Total,0,0,0,0,0,0,0,0,0,0,0,0,0,3,5,8,8,8,9,11,15,17,20,29,30,30,31,35,46,59,64,75,81,103,112,134,150,164,192,204,222,252,282,286,359,380,426,446,548,607,631,686,747,842,913,960,1002,1042,1107,1151,1254,1391,1522,1591,1665,1876,1954,2197,2317,2381,2494,2607,2698,2881,3063,
35,Artificial Data,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,2,2,2,3,3,4,5,6,7,8,10,11,13,15,18,21,25,29,33,39,45,52,61,70,81,94,108,125,143,165,189,216,247,282,320,363,410,462,518,580,646,717,793,873,957,1044,1135,1229,1325,1423,1523,1623
`;


// Death case
var csv_d = `
ID,Provinsi,2020-02-28,2020-02-29,2020-03-01,2020-03-02,2020-03-03,2020-03-04,2020-03-05,2020-03-06,2020-03-07,2020-03-08,2020-03-09,2020-03-10,2020-03-11,2020-03-12,2020-03-13,2020-03-14,2020-03-15,2020-03-16,2020-03-17,2020-03-18,2020-03-19,2020-03-20,2020-03-21,2020-03-22,2020-03-23,2020-03-24,2020-03-25,2020-03-26,2020-03-27,2020-03-28,2020-03-29,2020-03-30,2020-03-31,2020-04-01,2020-04-02,2020-04-03,2020-04-04,2020-04-05,2020-04-06,2020-04-07,2020-04-08,2020-04-09,2020-04-10,2020-04-11,2020-04-12,2020-04-13,2020-04-14,2020-04-15,2020-04-16,2020-04-17,2020-04-18,2020-04-19,2020-04-20,2020-04-21,2020-04-22,2020-04-23,2020-04-24,2020-04-25,2020-04-26,2020-04-27,2020-04-28,2020-04-29,2020-04-30,2020-05-01,2020-05-02,2020-05-03,2020-05-04,2020-05-05,2020-05-06,2020-05-07,2020-05-08,2020-05-09,2020-05-10,2020-05-11,2020-05-12
0,Nanggroe Aceh Darussalam,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
1,Kalimantan Selatan,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,9,9,9,9,9,9,9,9,9,9,9,9,9,9
2,Daerah Istimewa Yogyakarta,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,3,3,3,3,3,3,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7
3,Jawa Tengah,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,2,3,3,3,3,3,3,4,6,6,7,7,7,7,7,7,18,18,18,22,22,22,22,22,22,25,25,26,27,27,41,41,44,44,44,53,53,54,54,58,58,58,59,59,60,62,62,62,62,64,64,65,66,66,66,66
4,Kalimantan Tengah,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,2,2,2,2,2,3,4,4,4,4,4,4,5,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7
5,Jambi,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
6,Sumatra Utara,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,4,4,4,4,4,4,8,3,9,9,9,9,9,9,9,9,9,9,11,11,12,12,12,12,12,13,13,13,13,13,13,16,16,16,21,21,24,24
7,Bengkulu,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
8,Jawa Timur,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,3,4,4,7,8,8,9,9,11,14,14,14,16,16,17,22,25,27,30,41,45,46,46,49,54,56,56,58,60,67,75,87,88,90,95,96,99,106,111,117,117,123,133,138,141,143,149,155
9,Gorontalo,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
10,Papua,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,2,2,2,8,3,3,3,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6
11,Sumatra Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,2,3,5,4,4,6,7,7,7,7,8,9,10,11,11,14,14,15,15,15,15,15,15,16,16,16,17,17,17,17,18
12,Sumatra Selatan,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,5,5,5,6,6,6,9,9,9
13,Sulawesi Selatan,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,5,5,5,5,5,6,6,6,8,11,15,15,15,15,15,23,23,25,25,25,30,30,34,35,36,36,36,37,37,37,37,40,40,40,42,45,45,46,46,47,49,49
14,Bali,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4
15,Jawa Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,7,7,9,9,10,10,11,14,17,19,20,21,21,21,25,28,28,29,29,35,40,40,40,43,52,52,52,53,56,56,59,62,68,71,74,77,77,77,78,79,79,83,83,84,85,86,87,90,90,92,95,95,95,98
16,Sulawesi Tenggara,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2
17,Maluku,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,4
18,Nusa Tenggara Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,10,5,5,5,6,6,6,6
19,Riau,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,6,6,6,6,6,6,6,6,6
20,DKI Jakarta,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,12,17,18,23,29,29,31,31,46,51,62,68,74,83,85,90,90,89,95,99,106,114,142,154,159,195,204,241,242,244,246,253,287,287,298,301,301,326,346,353,367,370,370,371,375,392,398,408,409,414,423,424,427,434,441,443
21,Sulawesi Utara,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,4,4,4,13,4,4,4,4,4,4,4,4,5
22,Nusa Tenggara Timur,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
23,Lampung,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5
24,Sulawesi Tengah,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3
25,Kalimantan Timur,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,3
26,Banten,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2,3,3,4,4,4,4,4,4,4,4,14,14,14,17,17,17,18,18,20,21,21,21,22,22,25,32,34,34,34,35,35,35,35,39,39,39,40,41,41,41,41,41,41,41,41,41,56,56,56,56,56,56
27,Kalimantan Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3
28,Sulawesi Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2
29,Bangka Belitung,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
30,Kepulauan Riau,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,7,7,7,7,7,8,8,8,8,8,8,8,8,9,9,9,9,9,9,10,10,10,10,10,11,11,11
31,Maluku Utara,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
32,Papua Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
33,Kalimantan Utara,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
NaN,Total,0,0,0,0,0,0,0,0,0,0,0,0,1,1,3,4,5,5,5,19,25,32,38,48,49,55,58,78,87,102,114,122,136,157,170,181,191,198,209,221,240,280,306,327,373,399,459,469,496,520,535,582,590,616,635,647,689,720,743,765,773,784,792,800,831,845,845,872,895,895,943,959,973,991,1007
35,Artificial Data,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
`;


// Confirmed case
var csv_c = `
ID,Provinsi,2020-02-28,2020-02-29,2020-03-01,2020-03-02,2020-03-03,2020-03-04,2020-03-05,2020-03-06,2020-03-07,2020-03-08,2020-03-09,2020-03-10,2020-03-11,2020-03-12,2020-03-13,2020-03-14,2020-03-15,2020-03-16,2020-03-17,2020-03-18,2020-03-19,2020-03-20,2020-03-21,2020-03-22,2020-03-23,2020-03-24,2020-03-25,2020-03-26,2020-03-27,2020-03-28,2020-03-29,2020-03-30,2020-03-31,2020-04-01,2020-04-02,2020-04-03,2020-04-04,2020-04-05,2020-04-06,2020-04-07,2020-04-08,2020-04-09,2020-04-10,2020-04-11,2020-04-12,2020-04-13,2020-04-14,2020-04-15,2020-04-16,2020-04-17,2020-04-18,2020-04-19,2020-04-20,2020-04-21,2020-04-22,2020-04-23,2020-04-24,2020-04-25,2020-04-26,2020-04-27,2020-04-28,2020-04-29,2020-04-30,2020-05-01,2020-05-02,2020-05-03,2020-05-04,2020-05-05,2020-05-06,2020-05-07,2020-05-08,2020-05-09,2020-05-10,2020-05-11,2020-05-12
0,Nanggroe Aceh Darussalam,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,4,4,5,5,5,5,5,5,5,5,5,5,6,6,5,5,5,5,5,5,5,5,6,7,7,7,7,7,8,9,9,9,9,9,10,11,11,12,12,12,17,17,17,17,17,17,17
1,Kalimantan Selatan,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,5,8,8,8,8,8,16,18,18,22,22,29,29,34,34,37,49,59,74,92,96,96,98,107,114,132,146,146,150,150,157,170,179,179,195,198,212,225,238,246,253,263,263,277
2,Daerah Istimewa Yogyakarta,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2,4,4,5,5,5,6,16,16,22,22,22,22,23,27,27,27,33,34,40,41,41,41,41,41,41,57,62,62,62,64,67,67,69,72,75,76,77,79,82,83,93,94,95,104,114,115,115,121,122,137,143,146,153,159,169
3,Jawa Tengah,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,3,4,6,8,12,12,14,15,15,19,38,40,43,55,63,81,93,104,104,114,120,120,132,133,140,144,144,144,200,203,278,292,300,304,329,349,351,449,479,538,575,621,649,666,682,711,724,746,767,776,798,849,891,904,933,959,978,980,989
4,Kalimantan Tengah,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,3,3,6,6,7,7,7,9,9,9,11,11,11,20,20,20,20,24,24,24,25,25,33,34,35,41,46,60,67,82,83,94,100,104,112,121,127,145,156,157,157,180,181,186,188,188,189,193,200,204
5,Jambi,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,5,6,7,8,8,8,8,13,13,14,18,21,32,32,32,32,32,32,32,38,38,43,47,47,47,62,64,65,65
6,Sumatra Utara,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,2,7,7,8,8,8,8,13,19,22,22,22,25,25,26,26,59,59,59,59,63,67,72,78,79,79,79,81,83,84,93,95,96,105,111,111,111,114,117,117,117,123,129,130,141,142,157,179,179,196,198
7,Bengkulu,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,8,8,8,8,8,8,8,8,12,12,12,12,12,12,12,14,14,14,37,37,37,40
8,Jawa Timur,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,9,15,26,41,41,51,51,59,66,77,90,91,93,104,104,155,152,188,189,194,196,223,256,267,386,440,475,499,514,522,555,590,590,603,638,664,690,770,785,796,857,872,958,1034,1037,1117,1124,1171,1221,1267,1284,1419,1502,1536,1669
9,Gorontalo,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,4,4,4,4,4,7,7,7,12,14,15,15,15,15,15,15,15,15,15,15,15,19,19,19,19,19,19
10,Papua,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,3,3,7,7,7,9,9,10,10,10,16,18,26,26,26,38,38,38,62,65,68,68,75,80,89,95,107,107,118,123,130,136,136,141,151,177,189,205,210,240,240,240,247,248,252,265,277,308,308,322
11,Sumatra Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,5,5,5,8,8,8,8,8,8,8,18,18,18,18,31,31,34,45,48,55,55,62,71,72,74,76,81,86,96,97,102,121,144,145,148,172,182,195,203,221,238,252,270,286,299,299,319
12,Sumatra Selatan,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,5,5,5,12,12,16,16,16,16,17,21,21,21,18,18,22,37,54,84,89,89,89,89,93,106,119,129,129,143,144,150,156,156,185,185,199,210,227,227,278,278,278,279
13,Sulawesi Selatan,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,4,13,27,29,33,47,50,50,66,66,82,82,83,113,127,127,138,167,178,222,223,231,242,271,332,343,370,370,374,387,397,420,432,440,440,453,465,491,547,577,601,607,640,665,684,708,710,722,722,747
14,Bali,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,4,4,4,6,6,9,9,9,9,10,19,19,25,25,27,32,35,43,43,49,63,75,79,81,86,92,98,113,124,131,135,140,150,152,167,177,183,186,194,215,215,222,235,237,262,271,277,277,287,300,306,311,314,328
15,Jawa Barat,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,4,7,8,11,23,26,41,55,59,59,60,73,78,98,119,149,180,198,220,223,225,247,252,263,343,365,376,388,421,450,540,530,559,570,632,641,696,747,756,762,784,862,907,912,951,969,1009,1012,1012,1043,1054,1252,1300,1320,1381,1404,1437,1437,1493,1545
16,Sulawesi Tenggara,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,5,5,6,7,7,11,15,15,16,16,16,16,24,26,26,28,37,37,37,37,37,41,41,45,45,45,53,62,62,64,64,64,69,69,69,70,71,76,76,76
17,Maluku,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,11,11,11,14,14,14,17,17,17,17,17,17,17,22,22,22,22,23,23,23,23,23,23,23,23,23,32,32,32,32,50
18,Nusa Tenggara Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,4,6,6,7,7,7,10,10,10,16,25,27,37,37,37,37,45,51,55,61,72,93,108,115,153,180,195,206,221,230,230,233,250,269,269,285,289,300,312,330,330,331,339
19,Riau,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,7,10,10,11,12,12,12,12,13,16,16,20,20,20,24,26,30,30,34,35,35,36,36,38,39,39,40,41,41,42,45,53,58,61,61,66,69,71,73,74,81
20,DKI Jakarta,0,0,0,0,0,0,0,2,2,4,17,25,25,31,64,83,99,113,139,171,213,215,267,307,353,424,463,515,598,627,675,698,747,808,897,971,1028,1124,1232,1369,1470,1706,1753,1948,2044,2186,2335,2474,2670,2815,2924,3032,3097,3260,3383,3517,3599,3684,3798,3869,4002,4092,4175,4317,4397,4463,4539,4687,4770,4855,4955,5056,5190,5276,5375
21,Sulawesi Utara,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,5,8,8,8,13,13,17,17,17,18,18,18,20,20,20,20,20,31,36,36,40,40,43,44,45,45,45,123,45,45,45,45,47,53,71,71,74
22,Nusa Tenggara Timur,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,10,10,12,12,12,12,12,12,12,16
23,Lampung,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,2,4,4,4,8,8,8,8,11,11,11,12,12,15,15,20,21,20,21,21,20,25,25,26,26,26,27,27,38,38,38,42,42,44,46,46,50,50,50,54,55,63,63,66,66,66,66,66
24,Sulawesi Tengah,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,3,3,2,2,4,4,4,4,5,5,5,14,19,19,19,19,22,22,24,24,27,27,27,29,29,32,36,36,36,42,47,47,48,59,59,59,70,70,75,75,75,83,83,95
25,Kalimantan Timur,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,3,9,9,9,11,11,11,11,11,17,17,17,20,21,21,22,24,30,31,31,32,32,35,35,35,35,35,35,44,44,54,59,63,68,69,74,85,97,105,107,115,119,134,136,154,162,167,168,182,182,209,214,218,225,228
26,Banten,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,5,5,9,27,37,43,47,56,65,67,67,84,103,106,128,142,152,164,170,173,177,187,194,212,218,243,279,281,285,280,281,297,311,321,324,341,341,337,337,359,370,370,382,388,388,404,418,427,432,446,458,487,495,505,523,533,541,559
27,Kalimantan Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,8,9,9,10,10,10,10,10,12,10,10,10,10,10,13,13,13,13,21,21,21,21,21,27,31,50,50,51,51,51,51,58,58,61,68,70,73,73,90,95,95,118,120,120,123
28,Sulawesi Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,2,2,2,2,2,3,5,5,5,5,7,7,7,7,7,7,7,8,8,33,35,35,35,37,38,42,43,44,44,44,58,58,58,60,62,62,62,68
29,Bangka Belitung,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,3,4,4,4,4,5,6,6,6,7,7,8,8,8,9,9,10,10,10,10,10,19,19,20,20,28,28,28,28,28,29,29,29
30,Kepulauan Riau,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,3,4,4,4,5,5,5,5,5,5,5,6,7,7,7,8,8,9,9,9,9,22,21,21,21,21,26,32,38,58,79,79,79,81,81,83,83,83,85,86,89,89,89,89,89,92,92,97,98,98,100,101,101,104,106
31,Maluku Utara,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,4,4,4,4,4,4,4,12,14,14,14,26,26,26,26,40,41,41,50,50,50,50,50,50,54,54,54,54
32,Papua Barat,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,2,2,5,5,5,7,7,7,8,13,15,16,16,16,37,37,37,42,43,43,43,49,53,53,53,53,70,70,70
33,Kalimantan Utara,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,8,8,8,15,15,16,16,16,16,16,16,16,20,28,47,50,69,74,77,77,77,77,83,89,90,92,92,100,115,122,122,130,131,131,131,131,131,131,132,132
NaN,Total,0,0,0,2,2,2,2,4,4,6,19,27,27,34,68,96,117,134,172,227,309,369,450,514,579,686,790,893,1046,1155,1285,1414,1528,1677,1790,1986,2092,2273,2491,2738,2956,3293,3512,3842,4241,4557,4839,5136,5516,5923,6248,6575,6760,7135,7418,7775,8211,8607,8882,9096,9511,9771,10118,10551,10843,11192,11587,12071,12438,12776,13112,13645,14032,14265,14749
35,Artificial Data,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,2,2,2,3,3,5,6,7,9,10,11,13,15,18,22,25,30,34,41,47,54,63,74,86,100,116,133,155,179,206,239,274,316,363,416,476,543,619,703,795,898,1010,1130,1260,1399,1545,1697,1856,2018,2183,2348,2512,2674,2831,2983,3129,3267,3398,3521,3634
`;
