/*
	idn-who-20200512.js
	Raw data with backtick in JS
	
	Sparisoma Viridi | https://github.com/dudung
	Aristyo Wijaya | https://www.researchgate.net/profile/Aristyo_Wijaya
	
	20200512
	1712 Get data from [1] and select IDN part only.

	References
	1. WHO-COVID-19-global-data.csvCSV (357.1K)
	   url https://data.humdata.org/dataset/coronavirus-covid-19-cases-and-deaths
     [20200512].
*/

var csvData = `
OBJECTID,ISO_2_CODE,ISO_3_CODE,ADM0_NAME,date_epicrv,NewCase,CumCase,NewDeath,CumDeath,Short_Name_ZH,Short_Name_FR,Short_Name_ES,Short_Name_RU,Short_Name_AR
6272,ID,IDN,Indonesia,2020-03-02T00:00:00.000Z,2,2,0,0,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6273,ID,IDN,Indonesia,2020-03-03T00:00:00.000Z,0,2,0,0,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6274,ID,IDN,Indonesia,2020-03-04T00:00:00.000Z,0,2,0,0,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6275,ID,IDN,Indonesia,2020-03-05T00:00:00.000Z,0,2,0,0,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6276,ID,IDN,Indonesia,2020-03-06T00:00:00.000Z,2,4,0,0,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6277,ID,IDN,Indonesia,2020-03-07T00:00:00.000Z,0,4,0,0,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6278,ID,IDN,Indonesia,2020-03-08T00:00:00.000Z,2,6,0,0,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6279,ID,IDN,Indonesia,2020-03-09T00:00:00.000Z,0,6,0,0,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6280,ID,IDN,Indonesia,2020-03-10T00:00:00.000Z,13,19,0,0,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6281,ID,IDN,Indonesia,2020-03-11T00:00:00.000Z,8,27,1,1,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6282,ID,IDN,Indonesia,2020-03-12T00:00:00.000Z,7,34,0,1,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6283,ID,IDN,Indonesia,2020-03-13T00:00:00.000Z,35,69,3,4,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6284,ID,IDN,Indonesia,2020-03-14T00:00:00.000Z,0,69,0,4,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6285,ID,IDN,Indonesia,2020-03-15T00:00:00.000Z,48,117,0,4,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6286,ID,IDN,Indonesia,2020-03-16T00:00:00.000Z,55,172,1,5,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6287,ID,IDN,Indonesia,2020-03-17T00:00:00.000Z,0,172,0,5,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6288,ID,IDN,Indonesia,2020-03-18T00:00:00.000Z,55,227,14,19,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6289,ID,IDN,Indonesia,2020-03-19T00:00:00.000Z,82,309,6,25,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6290,ID,IDN,Indonesia,2020-03-20T00:00:00.000Z,60,369,7,32,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6291,ID,IDN,Indonesia,2020-03-21T00:00:00.000Z,81,450,6,38,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6292,ID,IDN,Indonesia,2020-03-22T00:00:00.000Z,64,514,10,48,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6293,ID,IDN,Indonesia,2020-03-23T00:00:00.000Z,65,579,1,49,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6294,ID,IDN,Indonesia,2020-03-24T00:00:00.000Z,0,579,0,49,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6295,ID,IDN,Indonesia,2020-03-25T00:00:00.000Z,211,790,9,58,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6296,ID,IDN,Indonesia,2020-03-26T00:00:00.000Z,103,893,20,78,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6297,ID,IDN,Indonesia,2020-03-27T00:00:00.000Z,153,1046,9,87,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6298,ID,IDN,Indonesia,2020-03-28T00:00:00.000Z,0,1046,0,87,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6299,ID,IDN,Indonesia,2020-03-29T00:00:00.000Z,239,1285,27,114,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6300,ID,IDN,Indonesia,2020-03-30T00:00:00.000Z,129,1414,8,122,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6301,ID,IDN,Indonesia,2020-03-31T00:00:00.000Z,114,1528,14,136,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6302,ID,IDN,Indonesia,2020-04-01T00:00:00.000Z,149,1677,21,157,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6303,ID,IDN,Indonesia,2020-04-02T00:00:00.000Z,113,1790,13,170,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6304,ID,IDN,Indonesia,2020-04-03T00:00:00.000Z,196,1986,11,181,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6305,ID,IDN,Indonesia,2020-04-04T00:00:00.000Z,106,2092,10,191,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6306,ID,IDN,Indonesia,2020-04-05T00:00:00.000Z,181,2273,7,198,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6307,ID,IDN,Indonesia,2020-04-06T00:00:00.000Z,218,2491,11,209,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6308,ID,IDN,Indonesia,2020-04-07T00:00:00.000Z,247,2738,12,221,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6309,ID,IDN,Indonesia,2020-04-08T00:00:00.000Z,218,2956,19,240,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6310,ID,IDN,Indonesia,2020-04-09T00:00:00.000Z,337,3293,40,280,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6311,ID,IDN,Indonesia,2020-04-10T00:00:00.000Z,219,3512,26,306,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6312,ID,IDN,Indonesia,2020-04-11T00:00:00.000Z,330,3842,21,327,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6313,ID,IDN,Indonesia,2020-04-12T00:00:00.000Z,399,4241,46,373,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6314,ID,IDN,Indonesia,2020-04-13T00:00:00.000Z,316,4557,26,399,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6315,ID,IDN,Indonesia,2020-04-14T00:00:00.000Z,282,4839,60,459,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6316,ID,IDN,Indonesia,2020-04-15T00:00:00.000Z,297,5136,10,469,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6317,ID,IDN,Indonesia,2020-04-16T00:00:00.000Z,380,5516,27,496,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6318,ID,IDN,Indonesia,2020-04-17T00:00:00.000Z,407,5923,24,520,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6319,ID,IDN,Indonesia,2020-04-18T00:00:00.000Z,325,6248,15,535,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6320,ID,IDN,Indonesia,2020-04-19T00:00:00.000Z,327,6575,47,582,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6321,ID,IDN,Indonesia,2020-04-20T00:00:00.000Z,185,6760,8,590,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6322,ID,IDN,Indonesia,2020-04-21T00:00:00.000Z,375,7135,26,616,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6323,ID,IDN,Indonesia,2020-04-22T00:00:00.000Z,283,7418,19,635,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6324,ID,IDN,Indonesia,2020-04-23T00:00:00.000Z,357,7775,12,647,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6325,ID,IDN,Indonesia,2020-04-24T00:00:00.000Z,436,8211,42,689,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6326,ID,IDN,Indonesia,2020-04-25T00:00:00.000Z,396,8607,31,720,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6327,ID,IDN,Indonesia,2020-04-26T00:00:00.000Z,275,8882,23,743,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6328,ID,IDN,Indonesia,2020-04-27T00:00:00.000Z,214,9096,22,765,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6329,ID,IDN,Indonesia,2020-04-28T00:00:00.000Z,415,9511,8,773,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6330,ID,IDN,Indonesia,2020-04-29T00:00:00.000Z,260,9771,11,784,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6331,ID,IDN,Indonesia,2020-04-30T00:00:00.000Z,347,10118,8,792,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6332,ID,IDN,Indonesia,2020-05-01T00:00:00.000Z,433,10551,8,800,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6333,ID,IDN,Indonesia,2020-05-02T00:00:00.000Z,292,10843,31,831,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6334,ID,IDN,Indonesia,2020-05-03T00:00:00.000Z,349,11192,14,845,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6335,ID,IDN,Indonesia,2020-05-04T00:00:00.000Z,395,11587,19,864,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6336,ID,IDN,Indonesia,2020-05-05T00:00:00.000Z,484,12071,8,872,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6337,ID,IDN,Indonesia,2020-05-06T00:00:00.000Z,367,12438,23,895,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6338,ID,IDN,Indonesia,2020-05-07T00:00:00.000Z,338,12776,35,930,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6339,ID,IDN,Indonesia,2020-05-08T00:00:00.000Z,336,13112,13,943,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6340,ID,IDN,Indonesia,2020-05-09T00:00:00.000Z,533,13645,16,959,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6341,ID,IDN,Indonesia,2020-05-10T00:00:00.000Z,387,14032,14,973,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6342,ID,IDN,Indonesia,2020-05-11T00:00:00.000Z,233,14265,18,991,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
6343,ID,IDN,Indonesia,2020-05-12T00:00:00.000Z,0,14265,0,991,印度尼西亚,Indonésie,Indonesia,Индонезия,إندونيسيا
`;
