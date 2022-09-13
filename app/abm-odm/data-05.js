var data05 = `
10000
00 | 0,1,3,0,2,0,1,3,2,0,2,3,2,3,0,2,0,2,0,1,0,1,0,2,0,2,0,3,2,0,2,3,0,3,1,0,1,0,1,0,2,0,2,0,2,3 | 0,424,610,921,983,1057,1404,1725,1981,2266,2346,2547,2833,2926,3124,3536,3693,3771,4170,4619,4677,5122,5189,5297,5502,5593,5673,5974,6414,6693,6767,6910,7482,7708,7906,8128,8249,8395,8491,8659,9044,9130,9255,9514,9607,9883
01 | 0,2,1,0,1,3,2,3,2,0,2,0,2,0,2,0,2,3,2,0,2,0,1,3,2,0,1,3,0,2,0,2,0 | 0,79,601,901,1134,1641,1770,1828,2990,3330,3973,4039,4810,4938,5351,5488,5587,5665,6318,6687,6802,6943,7296,7551,7812,8370,8831,9014,9294,9359,9510,9747,9902
02 | 0,3,0,2,0,2,0,2,3,2,3,2,0,3,2,0,1,3,2,0,2,0,1,3,0,1,3,2 | 0,290,1231,1702,1798,2086,2157,2257,2862,3084,3349,3663,4378,5402,5828,5968,6444,6710,6860,7128,7296,7419,8071,8482,8718,8997,9347,9473
03 | 0,2,0,1,0,1,0,1,3,2,3,2,3,0,3,0,3,2,0,1,0,1,0,2,1,3,2,0,2,0,2,0,2,0,2,3 | 0,300,858,956,1033,1195,1277,1342,1946,2235,2477,3523,3842,4359,4718,5448,5670,5786,6033,6165,6304,6945,7200,7467,7687,7888,8106,8427,8882,8953,9214,9350,9419,9485,9569,9669
04 | 0,2,0,1,0,1,0,2,0,2,0,2,3,1,3,2,1,3,2,3,1,0,2,0,2,0,2,0,2,3,1,3,1,3,2,3,2 | 0,228,587,1076,1645,2011,2087,2451,2540,2607,2743,2819,3185,3424,3504,3675,3961,4182,4504,4614,4857,5078,5161,5894,5981,6255,6322,6532,6641,6919,7360,7452,8701,9149,9321,9732,9900
05 | 0,2,3,2,0,1,3,2,1,0,1,0,3,2,3,2,0,1,0,2,0,2,0,2,0,2,3,2,0,1,0,3,2 | 0,149,998,1261,1375,1763,2153,2484,3073,3628,3706,3845,4086,4235,4645,4854,5141,5390,5489,5608,5738,5811,5905,6030,6190,6371,6947,7966,8459,8926,9041,9504,9632
06 | 0,1,0,3,2,0,2,3,0,2,0,2,0,2,0,2,3,1,0,2,0,1,0,2,0,2,0 | 0,132,217,493,1524,2451,2710,3108,3506,3720,3932,4040,4297,4447,4701,5078,5623,6305,6714,7469,7552,7943,8225,8466,9520,9581,9827
07 | 0,2,1,3,2,0,3,2,0,1,3,2,0,2,3,2,3,2,0,2,3,2 | 0,661,1015,1246,2094,2970,3516,4303,4408,4901,5131,5798,6168,6312,6923,7140,7465,8092,8749,9410,9498,9784
08 | 1,0,2,3,2,3,2,0,2,3,2,0,3,2,0,1,0,2,3,0,2,0,3,1,3,1,0 | 0,69,166,705,1131,1216,1271,1569,1653,2635,2743,3350,3642,5136,5592,6250,6456,6623,7159,7670,7751,7992,8651,8850,9269,9665,9835
09 | 1,0,1,0,1,0,2,0,1,0,1,0,2,0,2,3,1,3,2,3,2,0,1,3,0,3,2,3,0,2 | 0,77,528,579,779,1141,1405,1539,2518,2772,2937,3011,3244,3522,4221,4311,4634,4864,5419,5764,5984,6204,6445,6561,7121,7734,8579,8754,8948,9259
10 | 1,3,2,0,2,0,1,0,2,0,2,3,2,3,2,0,2,0,2,0,2,0,1,0,2,0,1,3,2,3,1,3,0,1,0,1,0 | 0,138,503,659,715,1064,1912,2151,2248,2369,2437,2805,3798,4223,4334,4545,4612,4708,4822,4900,4960,5155,6773,6872,6966,7391,7810,7903,8062,8494,8818,8903,9116,9380,9485,9576,9720
11 | 1,3,2,3,1,3,2,0,1,3,0,2,0,2,0,2,0,1,3,2,0,1,3,2,0,2,0,2,3,0,1 | 0,78,1109,1813,2139,2333,2503,2742,3199,3489,4008,4081,4206,4452,4750,5075,5285,5808,5978,6248,6509,6775,6862,7757,8178,8311,8373,8471,8825,9065,9907
12 | 1,0,3,2,3,2,0,1,0,1,0,1,0,3,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,1,3,2,0 | 0,82,630,720,920,1481,1696,1851,2078,2248,2539,2594,3617,3937,4758,5049,5422,5678,6749,6815,6921,7183,7356,7434,7721,7857,7932,8273,8342,8588,9182,9398,9565
13 | 1,0,2,1,0,1,3,2,0,2,0,1,0,1,3,2,3,2,3,2,3,2,0,2,0,1 | 0,404,1088,1320,1551,1738,2008,2903,3214,3707,3834,4037,4189,4647,5010,5376,5825,6710,7127,7555,8069,8250,8487,8680,8833,9109
14 | 2,0,2,0,1,0,2,0,2,0,1,0,1,3,2,3,0,1,0,2,0,1,0,2,0,2,3,2,0,1,0,2,0,2,0,3 | 0,69,166,264,1256,2050,2627,2698,2886,2966,3818,3914,3991,4293,4573,4628,4949,5131,5340,5631,5971,6099,6237,6545,6797,7149,7306,7423,7913,8096,8335,8415,9012,9075,9679,9937
15 | 2,0,2,0,2,0,2,3,2,0,2,3,0,1,0,2,0,2,0,2,0,2,3,1,3,2,3,0,1,3 | 0,81,208,298,472,673,768,1408,1588,2148,2211,2607,2859,3023,3091,3272,3453,4071,4156,4227,4723,4910,5163,5609,5695,5950,7253,8176,8567,9294
16 | 2,0,1,0,2,3,2,3,0,2,0,1,3,0,2,0,2,0,1,3 | 0,576,927,1084,1950,2156,2250,2304,3595,3961,4448,5303,6017,6236,7371,7515,7927,8411,8552,9007
17 | 2,0,1,3,2,0,2,0,1,0,1,0,2,3,2,3,1,3,2,0,1,0,1,0,1,0,3,2,3,2,3,2,1 | 0,120,841,1033,1191,1638,2505,2658,2847,3142,3656,4136,4239,4366,4827,5037,5402,5475,6037,6325,6497,6595,6982,7177,7502,7585,7775,8222,8592,8723,8970,9324,9711
18 | 3,2,1,3,2,1,3,0,1,3,2,3,2,0,1,3,0,2,3,2,0,2,0,1,0,1,3 | 0,530,895,1053,1308,1577,1698,2226,2452,2652,2764,2984,3363,3801,4021,4165,5792,5923,6285,7019,7382,7536,8011,8149,8235,9104,9246
19 | 3,2,0,2,0,2,0,2,0,3,0,2,0,2,0,1,0,1,3,2,0,1,0,1,3,2,0,1,0,2,0,2 | 0,334,842,1043,1222,1347,1451,1546,1820,2390,2685,2960,3033,3682,3817,4273,4465,4850,5054,5553,5753,6415,6995,7066,7277,7574,7981,8653,9148,9508,9802,9943
20 | 3,2,0,1,3,2,1,0,1,0,1,0,2,0,1,3,2,0,2,0,2,3,0,1,3,2,0,2,0,2,0 | 0,146,1021,1149,1413,1914,2216,2483,2669,3071,3161,3689,4223,4401,4869,5180,6661,7025,7413,7482,7542,7957,8464,8860,9030,9350,9527,9640,9723,9781,9858
`;