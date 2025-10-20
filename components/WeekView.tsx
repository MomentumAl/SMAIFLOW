import React, { useState } from 'react';
import { TrainingPlanData, WorkoutStatus, Workout, UserData, PlanAnalysis } from '../types';
import { SwimIcon, RunIcon, CycleIcon, DumbbellIcon, RestIcon, FocusIcon, CalendarIcon, CheckIcon, ArrowLeftIcon, ArrowRightIcon, AdjustIcon, WarningIcon, DownloadIcon } from './IconComponents';
import WorkoutDetailModal from './WorkoutDetailModal';
import { jsPDF } from 'jspdf';

// Using the new, correct SVG for the full SmaiFlow logo
const SMAIFLOW_LOGO_SVG = `<svg width="1421" height="1208" viewBox="0 0 1421 1208" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_210_325)">
<path d="M641.461 105.172L374.19 1060.77L397.102 670.007L322.303 670.007L502.568 29.1331L641.461 105.172Z" fill="url(#paint0_linear_210_325)"/>
</g>
<g filter="url(#filter1_d_210_325)">
<path d="M826.955 208.727L575.825 1058.57L623.279 667.103L547.028 667.103L688.061 132.688L826.955 208.727Z" fill="url(#paint1_linear_210_325)"/>
</g>
<g filter="url(#filter2_d_210_325)">
<path d="M1013.51 311.359L773.019 1059.49L823.177 668.018L752.908 668.018L874.617 235.32L1013.51 311.359Z" fill="url(#paint2_linear_210_325)"/>
</g>
<g filter="url(#filter3_d_210_325)">
<path d="M1204.19 416.517L982.162 1058.57L1044.9 665.73L975.211 665.73L1065.29 340.479L1204.19 416.517Z" fill="url(#paint3_linear_210_325)"/>
</g>
<g filter="url(#filter4_d_210_325)">
<path d="M959.05 1183L925 1078H955.6L984.25 1168.9H968.8L998.95 1078H1026.25L1054.75 1168.9H1039.9L1069.45 1078H1097.8L1063.75 1183H1031.95L1007.65 1105.75H1016.2L990.85 1183H959.05Z" fill="url(#paint4_linear_210_325)"/>
</g>
<g filter="url(#filter5_d_210_325)">
<path d="M524.726 1081.3L557.792 1186.61L527.193 1186.33L499.395 1095.16L514.845 1095.31L483.845 1185.92L456.546 1185.66L428.898 1094.5L443.748 1094.64L413.348 1185.26L385 1185L420.031 1080.32L451.829 1080.62L475.405 1158.09L466.856 1158.01L492.928 1081L524.726 1081.3Z" fill="url(#paint5_linear_210_325)"/>
</g>
<g filter="url(#filter6_d_210_325)">
<path d="M880.35 1187.2C871.95 1187.2 864.2 1185.85 857.1 1183.15C850 1180.45 843.8 1176.65 838.5 1171.75C833.3 1166.75 829.25 1160.95 826.35 1154.35C823.45 1147.75 822 1140.5 822 1132.6C822 1124.7 823.45 1117.45 826.35 1110.85C829.25 1104.25 833.3 1098.5 838.5 1093.6C843.8 1088.6 850 1084.75 857.1 1082.05C864.2 1079.35 871.95 1078 880.35 1078C888.85 1078 896.6 1079.35 903.6 1082.05C910.7 1084.75 916.85 1088.6 922.05 1093.6C927.25 1098.5 931.3 1104.25 934.2 1110.85C937.2 1117.45 938.7 1124.7 938.7 1132.6C938.7 1140.5 937.2 1147.8 934.2 1154.5C931.3 1161.1 927.25 1166.85 922.05 1171.75C916.85 1176.65 910.7 1180.45 903.6 1183.15C896.6 1185.85 888.85 1187.2 880.35 1187.2ZM880.35 1162.6C884.35 1162.6 888.05 1161.9 891.45 1160.5C894.95 1159.1 897.95 1157.1 900.45 1154.5C903.05 1151.8 905.05 1148.6 906.45 1144.9C907.95 1141.2 908.7 1137.1 908.7 1132.6C908.7 1128 907.95 1123.9 906.45 1120.3C905.05 1116.6 903.05 1113.45 900.45 1110.85C897.95 1108.15 894.95 1106.1 891.45 1104.7C888.05 1103.3 884.35 1102.6 880.35 1102.6C876.35 1102.6 872.6 1103.3 869.1 1104.7C865.7 1106.1 862.7 1108.15 860.1 1110.85C857.6 1113.45 855.6 1116.6 854.1 1120.3C852.7 1123.9 852 1128 852 1132.6C852 1137.1 852.7 1141.2 854.1 1144.9C855.6 1148.6 857.6 1151.8 860.1 1154.5C862.7 1157.1 865.7 1159.1 869.1 1160.5C872.6 1161.9 876.35 1162.6 880.35 1162.6Z" fill="url(#paint6_linear_210_325)"/>
</g>
<g filter="url(#filter7_d_210_325)">
<path d="M792 1187V1082H821.7V1163.45H871.8V1187H792Z" fill="url(#paint7_linear_210_325)"/>
</g>
<g filter="url(#filter8_d_210_325)">
<path d="M737.6 1128.05H786.05V1151H737.6V1128.05ZM739.7 1187H710V1082H792.35V1104.95H739.7V1187Z" fill="url(#paint8_linear_210_325)"/>
</g>
<g filter="url(#filter9_d_210_325)">
<path d="M675 1200V1061H705V1200H675Z" fill="url(#paint9_linear_210_325)"/>
</g>
<g filter="url(#filter10_d_210_325)">
<path d="M558 1187L604.35 1082H633.6L680.1 1187H649.2L612.9 1096.55H624.6L588.3 1187H558ZM583.35 1166.6L591 1144.7H642.3L649.95 1166.6H583.35Z" fill="url(#paint10_linear_210_325)"/>
</g>
<g filter="url(#filter11_d_210_325)">
<path d="M347.25 1187.2C338.65 1187.2 330.35 1186.15 322.35 1184.05C314.45 1181.85 308 1179.05 303 1175.65L312.75 1153.75C317.45 1156.75 322.85 1159.25 328.95 1161.25C335.15 1163.15 341.3 1164.1 347.4 1164.1C351.5 1164.1 354.8 1163.75 357.3 1163.05C359.8 1162.25 361.6 1161.25 362.7 1160.05C363.9 1158.75 364.5 1157.25 364.5 1155.55C364.5 1153.15 363.4 1151.25 361.2 1149.85C359 1148.45 356.15 1147.3 352.65 1146.4C349.15 1145.5 345.25 1144.6 340.95 1143.7C336.75 1142.8 332.5 1141.65 328.2 1140.25C324 1138.85 320.15 1137.05 316.65 1134.85C313.15 1132.55 310.3 1129.6 308.1 1126C305.9 1122.3 304.8 1117.65 304.8 1112.05C304.8 1105.75 306.5 1100.05 309.9 1094.95C313.4 1089.85 318.6 1085.75 325.5 1082.65C332.4 1079.55 341 1078 351.3 1078C358.2 1078 364.95 1078.8 371.55 1080.4C378.25 1081.9 384.2 1084.15 389.4 1087.15L380.25 1109.2C375.25 1106.5 370.3 1104.5 365.4 1103.2C360.5 1101.8 355.75 1101.1 351.15 1101.1C347.05 1101.1 343.75 1101.55 341.25 1102.45C338.75 1103.25 336.95 1104.35 335.85 1105.75C334.75 1107.15 334.2 1108.75 334.2 1110.55C334.2 1112.85 335.25 1114.7 337.35 1116.1C339.55 1117.4 342.4 1118.5 345.9 1119.4C349.5 1120.2 353.4 1121.05 357.6 1121.95C361.9 1122.85 366.15 1124 370.35 1125.4C374.65 1126.7 378.55 1128.5 382.05 1130.8C385.55 1133 388.35 1135.95 390.45 1139.65C392.65 1143.25 393.75 1147.8 393.75 1153.3C393.75 1159.4 392 1165.05 388.5 1170.25C385.1 1175.35 379.95 1179.45 373.05 1182.55C366.25 1185.65 357.65 1187.2 347.25 1187.2Z" fill="url(#paint11_linear_210_325)"/>
</g>
<defs>
<filter id="filter0_d_210_325" x="318.303" y="29.1333" width="327.158" height="1039.64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_210_325"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_210_325" result="shape"/>
</filter>
<filter id="filter1_d_210_325" x="543.028" y="132.688" width="287.926" height="933.886" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_210_325"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_210_325" result="shape"/>
</filter>
<filter id="filter2_d_210_325" x="748.908" y="235.32" width="268.603" height="832.169" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_210_325"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_210_325" result="shape"/>
</filter>
<filter id="filter3_d_210_325" x="971.211" y="340.479" width="236.975" height="726.095" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_210_325"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_210_325" result="shape"/>
</filter>
<filter id="filter4_d_210_325" x="921" y="1078" width="180.8" height="113" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_210_325"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_210_325" result="shape"/>
</filter>
<filter id="filter5_d_210_325" x="381" y="1080.32" width="180.792" height="114.294" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_210_325"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_210_325" result="shape"/>
</filter>
<filter id="filter6_d_210_325" x="818" y="1078" width="124.7" height="117.2" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_210_325"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_210_325" result="shape"/>
</filter>
<filter id="filter7_d_210_325" x="788" y="1082" width="87.7998" height="113" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_210_325"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_210_325" result="shape"/>
</filter>
<filter id="filter8_d_210_325" x="706" y="1082" width="90.3496" height="113" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_210_325"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_210_325" result="shape"/>
</filter>
<filter id="filter9_d_210_325" x="671" y="1061" width="38" height="147" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_210_325"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_210_325" result="shape"/>
</filter>
<filter id="filter10_d_210_325" x="554" y="1082" width="130.1" height="113" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_210_325"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_210_325" result="shape"/>
</filter>
<filter id="filter11_d_210_325" x="299" y="1078" width="98.75" height="117.2" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_210_325"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_210_325" result="shape"/>
</filter>
<linearGradient id="paint0_linear_210_325" x1="759.279" y1="506.784" x2="220.381" y2="733.684" gradientUnits="userSpaceOnUse">
<stop stop-color="#8C6014"/>
<stop offset="0.240385" stop-color="#D4AF37"/>
<stop offset="0.322115" stop-color="#FFFAD5"/>
<stop offset="0.538462" stop-color="#D4AF37"/>
</linearGradient>
<linearGradient id="paint1_linear_210_325" x1="927.729" y1="559.021" x2="437.733" y2="765.294" gradientUnits="userSpaceOnUse">
<stop stop-color="#8C6014"/>
<stop offset="0.240385" stop-color="#D4AF37"/>
<stop offset="0.322115" stop-color="#FFFAD5"/>
<stop offset="0.538462" stop-color="#D4AF37"/>
</linearGradient>
<linearGradient id="paint2_linear_210_325" x1="1097.23" y1="611.647" x2="650.354" y2="799.696" gradientUnits="userSpaceOnUse">
<stop stop-color="#8C6014"/>
<stop offset="0.240385" stop-color="#D4AF37"/>
<stop offset="0.322115" stop-color="#FFFAD5"/>
<stop offset="0.538462" stop-color="#D4AF37"/>
</linearGradient>
<linearGradient id="paint3_linear_210_325" x1="1271.11" y1="665.632" x2="875.116" y2="832.236" gradientUnits="userSpaceOnUse">
<stop stop-color="#8C6014"/>
<stop offset="0.240385" stop-color="#D4AF37"/>
<stop offset="0.322115" stop-color="#FFFAD5"/>
<stop offset="0.538462" stop-color="#D4AF37"/>
</linearGradient>
<linearGradient id="paint4_linear_210_325" x1="927.935" y1="1062.89" x2="1096.37" y2="1065.53" gradientUnits="userSpaceOnUse">
<stop stop-color="#8C6014"/>
<stop offset="0.235577" stop-color="#D4AF37"/>
<stop offset="0.668269" stop-color="#FFFAD5"/>
<stop offset="1" stop-color="#D4AF37"/>
</linearGradient>
<linearGradient id="paint5_linear_210_325" x1="554.716" y1="1201.69" x2="386.308" y2="1197.48" gradientUnits="userSpaceOnUse">
<stop stop-color="#8C6014"/>
<stop offset="0.235577" stop-color="#D4AF37"/>
<stop offset="0.668269" stop-color="#FFFAD5"/>
<stop offset="1" stop-color="#D4AF37"/>
</linearGradient>
<linearGradient id="paint6_linear_210_325" x1="823.982" y1="1062.29" x2="937.754" y2="1063.45" gradientUnits="userSpaceOnUse">
<stop stop-color="#8C6014"/>
<stop offset="0.235577" stop-color="#D4AF37"/>
<stop offset="0.668269" stop-color="#FFFAD5"/>
<stop offset="1" stop-color="#D4AF37"/>
</linearGradient>
<linearGradient id="paint7_linear_210_325" x1="793.355" y1="1066.89" x2="871.157" y2="1067.45" gradientUnits="userSpaceOnUse">
<stop stop-color="#8C6014"/>
<stop offset="0.235577" stop-color="#D4AF37"/>
<stop offset="0.668269" stop-color="#FFFAD5"/>
<stop offset="1" stop-color="#D4AF37"/>
</linearGradient>
<linearGradient id="paint8_linear_210_325" x1="711.399" y1="1066.89" x2="791.686" y2="1067.49" gradientUnits="userSpaceOnUse">
<stop stop-color="#8C6014"/>
<stop offset="0.235577" stop-color="#D4AF37"/>
<stop offset="0.668269" stop-color="#FFFAD5"/>
<stop offset="1" stop-color="#D4AF37"/>
</linearGradient>
<linearGradient id="paint9_linear_210_325" x1="675.51" y1="1041" x2="704.76" y2="1041.06" gradientUnits="userSpaceOnUse">
<stop stop-color="#8C6014"/>
<stop offset="0.235577" stop-color="#D4AF37"/>
<stop offset="0.668269" stop-color="#FFFAD5"/>
<stop offset="1" stop-color="#D4AF37"/>
</linearGradient>
<linearGradient id="paint10_linear_210_325" x1="560.074" y1="1066.89" x2="679.108" y2="1068.21" gradientUnits="userSpaceOnUse">
<stop stop-color="#8C6014"/>
<stop offset="0.235577" stop-color="#D4AF37"/>
<stop offset="0.668269" stop-color="#FFFAD5"/>
<stop offset="1" stop-color="#D4AF37"/>
</linearGradient>
<linearGradient id="paint11_linear_210_325" x1="304.541" y1="1062.29" x2="393.018" y2="1062.99" gradientUnits="userSpaceOnUse">
<stop stop-color="#8C6014"/>
<stop offset="0.235577" stop-color="#D4AF37"/>
<stop offset="0.668269" stop-color="#FFFAD5"/>
<stop offset="1" stop-color="#D4AF37"/>
</linearGradient>
</defs>
</svg>`;

interface Props {
  plan: TrainingPlanData;
  userName: string;
  isSubscribed: boolean;
  onReset: () => void;
  onUpdateWorkoutStatus: (workoutId: string, status: WorkoutStatus) => void;
  onInitiateReadjust: () => void;
  userData: UserData;
  onFinishPlan: () => void;
  planAnalysis: PlanAnalysis | null;
}

const getWorkoutAccent = (type: string): { icon: React.ReactElement; emoji: string; colors: string } => {
    const lowerType = type.toLowerCase();
    
    if (lowerType.startsWith('natación')) {
        return { icon: <SwimIcon />, emoji: '🏊‍♂️', colors: 'bg-teal-100 text-teal-700' };
    }
    if (lowerType.startsWith('running')) {
        return { icon: <RunIcon />, emoji: '🏃‍♀️', colors: 'bg-sky-100 text-sky-700' };
    }
    if (lowerType.startsWith('ciclismo')) {
        return { icon: <CycleIcon />, emoji: '🚴', colors: 'bg-orange-100 text-orange-700' };
    }
    if (lowerType.includes('fuerza') || lowerType.includes('gimnasio')) {
        return { icon: <DumbbellIcon />, emoji: '💪', colors: 'bg-yellow-100 text-yellow-700' };
    }
    if (lowerType.includes('descanso')) {
        return { icon: <RestIcon />, emoji: '😴', colors: 'bg-indigo-100 text-indigo-700' };
    }
    if (lowerType.includes('recuperación')) {
        return { icon: <RunIcon />, emoji: '🧘', colors: 'bg-cyan-100 text-cyan-700'};
    }
    // Default fallback
    return { icon: <RunIcon />, emoji: '🏆', colors: 'bg-amber-100 text-amber-700' };
};

const formatDate = (dateString: string): string => {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString('es-ES', {
        month: 'long',
        day: 'numeric'
    });
};

const ProgressBar: React.FC<{ progress: number; label: string }> = ({ progress, label }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-xs font-semibold text-amber-800">{label}</span>
      <span className="text-xs font-semibold text-amber-800">{Math.round(progress)}%</span>
    </div>
    <div className="w-full bg-amber-200 rounded-full h-2.5">
      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);


const WeekView: React.FC<Props> = ({ plan, userName, isSubscribed, onReset, onUpdateWorkoutStatus, onInitiateReadjust, userData, onFinishPlan, planAnalysis }) => {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [showReadjustPrompt, setShowReadjustPrompt] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!plan?.plan?.length) {
    return (
        <div className="bg-amber-100/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-amber-300/40 text-center animate-fade-in dark:bg-slate-800/80 dark:border-slate-700/60">
            <h2 className="text-2xl font-bold text-amber-950 dark:text-slate-100">Plan de Entrenamiento Inválido</h2>
            <p className="mt-2 text-amber-800 dark:text-slate-300">No se encontraron semanas en tu plan. Por favor, intenta crear uno nuevo.</p>
            <button
              onClick={onReset}
              className="mt-6 px-6 py-3 font-semibold text-amber-700 bg-amber-100 rounded-xl hover:bg-amber-200 transition-colors"
            >
              Empezar un Nuevo Plan
            </button>
        </div>
    );
  }

  const currentWeekData = plan.plan[currentWeekIndex];

  const handleSkipWorkout = (workoutId: string) => {
    onUpdateWorkoutStatus(workoutId, 'skipped');
    setShowReadjustPrompt(true);
  };

  const goToNextWeek = () => {
    if (currentWeekIndex < plan.plan.length - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1);
    }
  };

  const goToPrevWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
    }
  };

  const handleWeekSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentWeekIndex(parseInt(e.target.value, 10));
  };


  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
        const { default: jsPDF } = await import('jspdf');
        const doc = new jsPDF('p', 'pt', 'letter');
        
        const svgToPngDataURL = (svgString: string, width: number, height: number): Promise<string> => {
            return new Promise((resolve, reject) => {
                const canvas = document.createElement('canvas');
                const scale = 3;
                canvas.width = width * scale;
                canvas.height = height * scale;
                const ctx = canvas.getContext('2d');

                if (!ctx) { return reject(new Error('Could not get canvas context')); }

                const img = new Image();
                const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(svgBlob);

                img.onload = () => {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    URL.revokeObjectURL(url);
                    resolve(canvas.toDataURL('image/png'));
                };
                img.onerror = () => {
                    URL.revokeObjectURL(url);
                    reject(new Error('Failed to load SVG image for conversion.'));
                };
                img.src = url;
            });
        };
        
        const logoAspectRatio = 1421 / 1208;
        const logoPngUrl = await svgToPngDataURL(SMAIFLOW_LOGO_SVG, 500, 500 / logoAspectRatio);
        
        const margin = 50;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const contentWidth = pageWidth - margin * 2;
        
        const darkBackgroundColor = '#0f172a';
        const primaryGoldColor = '#D4AF37';
        const lightTextColor = '#f1f5f9';
        const secondaryTextColor = '#94a3b8';

        let y = margin;
        
        const addHeaderAndFooter = (pageNumber: number) => {
            doc.setFillColor(darkBackgroundColor);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');

            doc.setDrawColor(primaryGoldColor);
            doc.setLineWidth(2);
            doc.rect(20, 20, pageWidth - 40, pageHeight - 40);
            doc.setLineWidth(0.5);
            doc.rect(25, 25, pageWidth - 50, pageHeight - 50);

            const watermarkWidth = 400;
            const watermarkHeight = watermarkWidth / logoAspectRatio;
            (doc as any).setGState(new (doc as any).GState({opacity: 0.05}));
            doc.addImage(logoPngUrl, 'PNG', pageWidth / 2 - watermarkWidth / 2, pageHeight / 2 - watermarkHeight / 2, watermarkWidth, watermarkHeight, undefined, 'FAST');
            (doc as any).setGState(new (doc as any).GState({opacity: 1}));

            y = margin;
            const logoHeaderWidth = 100;
            const logoHeaderHeight = logoHeaderWidth / logoAspectRatio;
            doc.addImage(logoPngUrl, 'PNG', pageWidth / 2 - logoHeaderWidth / 2, y, logoHeaderWidth, logoHeaderHeight);
            y += logoHeaderHeight + 15;

            doc.setFont('times', 'normal');
            doc.setFontSize(12);
            doc.setTextColor(secondaryTextColor);
            doc.text('Plan de Entrenamiento Personalizado', pageWidth / 2, y, { align: 'center' });
            y += 20;

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.setTextColor(lightTextColor);
            doc.text(userName, pageWidth / 2, y, { align: 'center' });
            y += 30;

            doc.setDrawColor(primaryGoldColor);
            doc.setLineWidth(0.5);
            doc.line(margin, y, pageWidth - margin, y);
            y += 20;
            
            const footerY = pageHeight - margin + 10;
            doc.setDrawColor(primaryGoldColor);
            doc.setLineWidth(0.5);
            doc.line(margin, footerY, pageWidth - margin, footerY);
            
            const footerText = `Página ${pageNumber} | Generado por SmaiFlow: Predict Your Greatness`;
            doc.setFontSize(8);
            doc.setTextColor(secondaryTextColor);
            doc.text(footerText, pageWidth / 2, footerY + 15, { align: 'center' });
        };
        
        let pageCount = 1;
        addHeaderAndFooter(pageCount);

        plan.plan.forEach((week) => {
            const weekTitle = `Semana ${week.week}: ${week.focus}`;
            const titlePadding = 10;
            const splitTitle = doc.splitTextToSize(weekTitle, contentWidth - (titlePadding * 2));
            const titleBlockHeight = (splitTitle.length * 20);

            if (y + titleBlockHeight > pageHeight - margin - 50) {
                doc.addPage();
                pageCount++;
                addHeaderAndFooter(pageCount);
            }

            doc.setFont('times', 'bold');
            doc.setFontSize(16);
            doc.setTextColor(primaryGoldColor);
            doc.text(splitTitle, margin, y);
            y += titleBlockHeight + 10;

            week.workouts.forEach((workout) => {
                const workoutHeader = `${workout.day} (${workout.date}) - ${workout.type}`;
                const splitDescription = doc.splitTextToSize(workout.description, contentWidth - 20);
                
                const estimatedHeight = 18 + (splitDescription.length * 12) + 15;
                if (y + estimatedHeight > pageHeight - margin - 40) {
                    doc.addPage();
                    pageCount++;
                    addHeaderAndFooter(pageCount);
                }

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(lightTextColor);
                doc.text(workoutHeader, margin, y);
                y += 16;
                
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9);
                doc.setTextColor(secondaryTextColor);
                doc.text(splitDescription, margin + 15, y);
                y += (splitDescription.length * 11) + 18;
            });
            y += 10;
        });

        doc.save(`plan-smaiflow-${userName.toLowerCase().replace(/\s/g, '-')}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
    } finally {
        setIsDownloading(false);
    }
  };

  const sortedWorkouts = currentWeekData.workouts.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if(dateA === dateB) {
        if (a.description.startsWith("Sesión AM:")) return -1;
        if (a.description.startsWith("Sesión PM:")) return 1;
    }
    return dateA - dateB;
  });

  const workoutsForWeek = currentWeekData.workouts.filter(w => !w.type.toLowerCase().includes('descanso'));
  const completedInWeek = workoutsForWeek.filter(w => w.status === 'completed').length;
  const weeklyProgress = workoutsForWeek.length > 0 ? (completedInWeek / workoutsForWeek.length) * 100 : 0;
  
  const isLastWeek = currentWeekIndex === plan.plan.length - 1;
  const isPlanOver = planAnalysis?.isFinished ?? false;

  return (
    <div className="bg-amber-100/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-lg border border-amber-300/40 animate-fade-in">
      <div className="text-center border-b border-amber-200 pb-6 mb-6">
        <h2 className="text-3xl font-extrabold text-amber-950">¡Tu Plan está Listo, {userName}!</h2>
        <p className="mt-2 text-amber-800">Aquí tienes tu hoja de ruta hacia el éxito. ¡A por ello!</p>
      </div>
      
      <div className="px-2 sm:px-4 mb-6">
        <h3 className="text-base font-bold text-amber-900 mb-3 text-center sm:text-left">Progreso General</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProgressBar progress={weeklyProgress} label="Progreso Semanal" />
            <ProgressBar progress={planAnalysis?.completionRate ?? 0} label="Progreso Total del Plan" />
        </div>
      </div>

      <div className="bg-amber-50/60 p-4 sm:p-6 rounded-xl border border-amber-200/50">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
            <div className="flex items-center gap-4">
                <div className="bg-amber-100 text-amber-700 p-3 rounded-full hidden sm:flex"><CalendarIcon /></div>
                <div>
                    <h3 className="text-xl font-bold text-amber-900">Semana {currentWeekData.week} <span className="text-amber-500 font-medium">de {plan.plan.length}</span></h3>
                    <div className="flex items-center gap-2 text-sm text-amber-800 mt-1">
                        <FocusIcon />
                        <span className="font-semibold">Foco:</span>
                        <span>{currentWeekData.focus}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={goToPrevWeek} disabled={currentWeekIndex === 0} className="p-2 rounded-full bg-white/75 border border-amber-300 text-amber-600 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ArrowLeftIcon />
                </button>
                 <select 
                    value={currentWeekIndex} 
                    onChange={handleWeekSelect} 
                    className="py-2 px-3 text-sm font-semibold bg-white/75 border border-amber-300 rounded-lg text-amber-800 focus:ring-amber-500 focus:border-amber-500"
                    aria-label="Seleccionar semana"
                 >
                    {plan.plan.map((week, index) => (
                        <option key={week.week} value={index}>
                            Semana {week.week}
                        </option>
                    ))}
                </select>
                <button onClick={goToNextWeek} disabled={currentWeekIndex === plan.plan.length - 1} className="p-2 rounded-full bg-white/75 border border-amber-300 text-amber-600 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ArrowRightIcon />
                </button>
            </div>
        </div>
        
        {showReadjustPrompt && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg my-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        <WarningIcon />
                    </div>
                    <div className="ml-3">
                        <h4 className="font-bold text-yellow-900">¿Necesitas un ajuste?</h4>
                        <p className="text-yellow-800 text-sm mt-1">
                            ¡No hay problema! La IA puede adaptar tu plan a tu progreso actual para que sigas por el buen camino.
                        </p>
                    </div>
                </div>
                <button 
                    onClick={onInitiateReadjust} 
                    className="w-full sm:w-auto bg-amber-900 text-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-amber-950 transition-colors flex-shrink-0 shadow-sm self-end sm:self-center"
                >
                    {isSubscribed ? 'Reajustar Plan (Incluido)' : 'Reajustar Plan'}
                </button>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {sortedWorkouts.map(workout => {
                const accent = getWorkoutAccent(workout.type);
                const isRest = workout.type.toLowerCase().includes('descanso');
                const cardStyle = workout.status === 'completed' 
                    ? 'bg-green-100/80 border-green-300/80' 
                    : workout.status === 'skipped'
                        ? 'bg-yellow-100/80 border-yellow-300/80 opacity-90'
                        : 'bg-white/60 border-amber-200/80 shadow-sm';

                return (
                    <div key={workout.id} className={`p-4 rounded-xl flex flex-col justify-between transition-all duration-300 border ${cardStyle}`}>
                        <div>
                            <div className="flex items-center justify-between">
                                <p className="font-bold text-amber-900 text-lg">{workout.day}, <span className="text-base font-medium text-amber-800">{formatDate(workout.date)}</span></p>
                                <p className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${accent.colors}`}>{accent.emoji} {workout.type}</p>
                            </div>
                            <p className={`mt-3 text-sm text-amber-800 min-h-[40px] ${workout.status === 'completed' ? 'line-through' : ''}`}>{workout.description}</p>
                        </div>
                        <div className="mt-4">
                             {!isRest && (
                                <>
                                    {workout.status === 'pending' && (
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => onUpdateWorkoutStatus(workout.id, 'completed')}
                                                className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-2 rounded-lg transition-colors bg-green-100 text-green-800 hover:bg-green-200"
                                            >
                                               Completado ✅
                                            </button>
                                            <button 
                                                onClick={() => handleSkipWorkout(workout.id)}
                                                className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-2 rounded-lg transition-colors bg-amber-100 text-amber-800 hover:bg-amber-200"
                                            >
                                               No lo hice ❌
                                            </button>
                                        </div>
                                    )}
                                    {workout.status === 'completed' && (
                                        <div className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-2 rounded-lg bg-green-100 text-green-800 cursor-default">
                                            <CheckIcon /> Completado
                                        </div>
                                    )}
                                     {workout.status === 'skipped' && (
                                        <div className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-2 rounded-lg bg-yellow-100 text-yellow-800 cursor-default">
                                            Omitido
                                        </div>
                                    )}
                                </>
                             )}
                            <button onClick={() => setSelectedWorkout(workout)} className="mt-2 w-full text-center text-xs font-semibold text-amber-700 hover:text-amber-900 py-1.5 rounded-lg hover:bg-amber-100/80 transition-colors">
                                Ver Detalles
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-center gap-4">
        {isLastWeek && !isPlanOver && (
            <button
                onClick={onFinishPlan}
                className="w-full sm:w-auto px-6 py-3 font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
                🏁 Terminar Plan
            </button>
        )}
        <button
            onClick={onInitiateReadjust}
            className="w-full sm:w-auto px-6 py-3 font-semibold text-amber-900 bg-white/80 border border-amber-300 rounded-xl hover:bg-white transition-colors shadow flex items-center justify-center gap-2"
        >
            <AdjustIcon />
            {isSubscribed ? 'Reajustar (Incluido)' : 'Reajustar Plan'}
        </button>
         <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="w-full sm:w-auto px-6 py-3 font-semibold text-amber-900 bg-white/80 border border-amber-300 rounded-xl hover:bg-white transition-colors shadow flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
        >
            <DownloadIcon />
            {isDownloading ? 'Generando PDF...' : 'Descargar Plan'}
        </button>
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3 font-semibold text-amber-700 bg-amber-100 rounded-xl hover:bg-amber-200 transition-colors"
        >
          Empezar Nuevo Plan
        </button>
      </div>

       {selectedWorkout && (
        <WorkoutDetailModal
          workout={selectedWorkout}
          userData={userData}
          onClose={() => setSelectedWorkout(null)}
        />
      )}
    </div>
  );
};

export default React.memo(WeekView);